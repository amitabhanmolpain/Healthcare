import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import socketService from '../../services/socket';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Activity,
  LogOut,
  Shield,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

// Use /api prefix to let Vite proxy handle requests
const API_BASE_URL = '/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('admin');
    
    if (!adminToken || !adminData) {
      navigate('/admin/login');
      return;
    }

    setAdmin(JSON.parse(adminData));
    fetchDashboardData();

    // Connect to WebSocket for real-time updates
    socketService.connect();
    setSocketConnected(true);

    // Listen for real-time appointment updates
    socketService.on('appointment_updated', (data) => {
      console.log('🔔 Appointment updated via WebSocket:', data);
      toast.success(`Appointment status updated to ${data.status}`);
      
      // Update appointments list if viewing appointments tab
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === data.appointment_id ? { ...apt, status: data.status } : apt
        )
      );
      
      // Update recent appointments in dashboard
      setRecentAppointments(prev =>
        prev.map(apt =>
          apt.id === data.appointment_id ? { ...apt, status: data.status } : apt
        )
      );
    });

    // Listen for real-time doctor status updates
    socketService.on('doctor_status_updated', (data) => {
      console.log('🔔 Doctor status updated via WebSocket:', data);
      toast.success(`Dr. ${data.name} is now ${data.is_active ? 'Active' : 'Offline'}`);
      
      // Update doctors list if viewing doctors tab
      setDoctors(prev =>
        prev.map(doc =>
          doc.id === data.doctor_id ? { ...doc, is_active: data.is_active } : doc
        )
      );
    });

    // Cleanup on component unmount
    return () => {
      socketService.off('appointment_updated');
      socketService.off('doctor_status_updated');
      socketService.disconnect();
      setSocketConnected(false);
    };
  }, [navigate]);

  const fetchDashboardData = async (tab = activeTab) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        console.error('No admin token found');
        toast.error('Please login again');
        handleLogout();
        return;
      }

      console.log('Fetching data for tab:', tab);
      
      const config = {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      // Always fetch dashboard stats
      const dashboardRes = await axios.get(`${API_BASE_URL}/admin/dashboard`, config);
      console.log('Dashboard response:', dashboardRes.data);
      setStats(dashboardRes.data.stats);
      setRecentAppointments(dashboardRes.data.recent_appointments);

      // Fetch tab-specific data
      if (tab === 'users') {
        console.log('Fetching users...');
        const usersRes = await axios.get(`${API_BASE_URL}/admin/users`, config);
        console.log('Users response:', usersRes.data);
        console.log('Users array:', usersRes.data.users);
        console.log('Users count:', usersRes.data.users?.length);
        setUsers(usersRes.data.users || []);
      } else if (tab === 'doctors') {
        console.log('Fetching doctors...');
        const doctorsRes = await axios.get(`${API_BASE_URL}/admin/doctors`, config);
        console.log('Doctors response:', doctorsRes.data);
        console.log('Doctors array:', doctorsRes.data.doctors);
        console.log('Doctors count:', doctorsRes.data.doctors?.length);
        setDoctors(doctorsRes.data.doctors || []);
      } else if (tab === 'appointments') {
        console.log('Fetching appointments...');
        const appointmentsRes = await axios.get(`${API_BASE_URL}/admin/appointments`, config);
        console.log('Appointments response:', appointmentsRes.data);
        console.log('Appointments array:', appointmentsRes.data.appointments);
        console.log('Appointments count:', appointmentsRes.data.appointments?.length);
        setAppointments(appointmentsRes.data.appointments || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Session expired or unauthorized. Please login again.');
        handleLogout();
      } else if (error.response?.status === 500) {
        toast.error('Server error: ' + (error.response?.data?.message || 'Please try again'));
      } else {
        toast.error('Failed to load dashboard data: ' + (error.message || 'Unknown error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const toggleDoctorStatus = (doctorId, currentStatus) => {
    const token = localStorage.getItem('adminToken');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    
    axios.put(`${API_BASE_URL}/admin/doctors/${doctorId}`, 
      { is_active: !currentStatus },
      config
    )
      .then(() => {
        setDoctors(doctors.map(doc => 
          doc.id === doctorId ? { ...doc, is_active: !currentStatus } : doc
        ));
        toast.success(`Doctor status updated to ${!currentStatus ? 'Active' : 'Offline'}`);
      })
      .catch(error => {
        console.error('Error updating doctor:', error);
        toast.error('Failed to update doctor status');
      });
  };

  const updateAppointmentStatus = (appointmentId, newStatus) => {
    const token = localStorage.getItem('adminToken');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    
    axios.put(`${API_BASE_URL}/admin/appointments/${appointmentId}`,
      { status: newStatus },
      config
    )
      .then(() => {
        setAppointments(appointments.map(apt =>
          apt.id === appointmentId ? { ...apt, status: newStatus } : apt
        ));
        toast.success(`Appointment status updated to ${newStatus}`);
      })
      .catch(error => {
        console.error('Error updating appointment:', error);
        toast.error('Failed to update appointment status');
      });
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-6 shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <Icon size={32} className="text-white" />
        <div className={`px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium`}>
          Live
        </div>
      </div>
      <h3 className="text-white/80 text-sm mb-1">{title}</h3>
      <p className="text-white text-3xl font-bold">{value}</p>
    </div>
  );

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                <Shield size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-xl">Admin Dashboard</h1>
                <div className="flex items-center gap-3">
                  <p className="text-gray-300 text-sm">{admin?.name}</p>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
                    <span className="text-xs text-gray-400">
                      {socketConnected ? 'Real-time connected' : 'Connecting...'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => { setActiveTab('dashboard'); fetchDashboardData('dashboard'); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>
          <button
            onClick={() => { setActiveTab('users'); fetchDashboardData('users'); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Users size={20} />
            Users
          </button>
          <button
            onClick={() => { setActiveTab('doctors'); fetchDashboardData('doctors'); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition ${
              activeTab === 'doctors'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <UserCheck size={20} />
            Doctors
          </button>
          <button
            onClick={() => { setActiveTab('appointments'); fetchDashboardData('appointments'); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition ${
              activeTab === 'appointments'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Calendar size={20} />
            Appointments
          </button>
        </div>

        {/* Dashboard View */}
        {activeTab === 'dashboard' && stats && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={Users}
                title="Total Users"
                value={stats.total_users}
                color="from-blue-500 to-blue-600"
              />
              <StatCard
                icon={UserCheck}
                title="Total Doctors"
                value={stats.total_doctors}
                color="from-green-500 to-green-600"
              />
              <StatCard
                icon={Calendar}
                title="Total Appointments"
                value={stats.total_appointments}
                color="from-purple-500 to-purple-600"
              />
              <StatCard
                icon={Activity}
                title="Pending Appointments"
                value={stats.pending_appointments}
                color="from-orange-500 to-orange-600"
              />
            </div>

            {/* Appointment Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <Clock size={24} className="text-yellow-400" />
                  <h3 className="text-white font-semibold">Pending</h3>
                </div>
                <p className="text-3xl font-bold text-yellow-400">{stats.pending_appointments}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle size={24} className="text-green-400" />
                  <h3 className="text-white font-semibold">Confirmed</h3>
                </div>
                <p className="text-3xl font-bold text-green-400">{stats.confirmed_appointments}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <XCircle size={24} className="text-red-400" />
                  <h3 className="text-white font-semibold">Cancelled</h3>
                </div>
                <p className="text-3xl font-bold text-red-400">{stats.cancelled_appointments}</p>
              </div>
            </div>

            {/* Recent Appointments */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h2 className="text-white font-bold text-xl mb-4">Recent Appointments</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-gray-300 font-medium p-3">Patient</th>
                      <th className="text-left text-gray-300 font-medium p-3">Doctor</th>
                      <th className="text-left text-gray-300 font-medium p-3">Date</th>
                      <th className="text-left text-gray-300 font-medium p-3">Time</th>
                      <th className="text-left text-gray-300 font-medium p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAppointments.map((apt) => (
                      <tr key={apt.id} className="border-b border-white/5">
                        <td className="text-white p-3">{apt.user?.name}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={apt.doctor?.image || 'https://via.placeholder.com/40'}
                              alt={apt.doctor?.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-purple-500"
                            />
                            <div>
                              <p className="text-white font-medium">{apt.doctor?.name}</p>
                              <p className="text-gray-400 text-xs">{apt.doctor?.specialty}</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-gray-300 p-3">{apt.appointment_date}</td>
                        <td className="text-gray-300 p-3">{apt.appointment_time}</td>
                        <td className="p-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            apt.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                            apt.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            apt.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {apt.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users View */}
        {activeTab === 'users' && (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h2 className="text-white font-bold text-xl mb-4">All Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-gray-300 font-medium p-3">Name</th>
                    <th className="text-left text-gray-300 font-medium p-3">Email</th>
                    <th className="text-left text-gray-300 font-medium p-3">Phone</th>
                    <th className="text-left text-gray-300 font-medium p-3">Orders</th>
                    <th className="text-left text-gray-300 font-medium p-3">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-white/5">
                      <td className="text-white p-3">{user.name}</td>
                      <td className="text-gray-300 p-3">{user.email}</td>
                      <td className="text-gray-300 p-3">{user.phone || 'N/A'}</td>
                      <td className="text-gray-300 p-3">
                        <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
                          {user.total_orders || 0} orders
                        </span>
                      </td>
                      <td className="text-gray-300 p-3">{user.created_at || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Doctors View */}
        {activeTab === 'doctors' && (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h2 className="text-white font-bold text-xl mb-6">All Doctors</h2>
            {loading ? (
              <div className="text-center text-gray-300 py-8">Loading doctors...</div>
            ) : doctors.length === 0 ? (
              <div className="text-center text-gray-300 py-8">No doctors found</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                  <div key={doctor.id} className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-white/20 transition">
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={doctor.image || 'https://via.placeholder.com/80'}
                        alt={doctor.name}
                        className="w-20 h-20 rounded-full object-cover border-2 border-purple-500"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/80'; }}
                      />
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg">{doctor.name}</h3>
                        <p className="text-purple-400 text-sm mb-1">{doctor.specialty}</p>
                        <p className="text-gray-400 text-xs">{doctor.experience} years exp</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300 text-sm">Status:</span>
                        <button
                          onClick={() => toggleDoctorStatus(doctor.id, doctor.is_active)}
                          className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
                            doctor.is_active
                              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                              : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                          }`}
                        >
                          {doctor.is_active ? '✓ Active' : '○ Offline'}
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">Rating:</span>
                        <span className="text-yellow-400">⭐ {doctor.rating || '4.5'}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">Fee:</span>
                        <span className="text-green-400 font-semibold">₹{doctor.consultation_fee}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Appointments View */}
        {activeTab === 'appointments' && (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h2 className="text-white font-bold text-xl mb-4">All Appointments</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-gray-300 font-medium p-3">Patient</th>
                    <th className="text-left text-gray-300 font-medium p-3">Doctor</th>
                    <th className="text-left text-gray-300 font-medium p-3">Date</th>
                    <th className="text-left text-gray-300 font-medium p-3">Time</th>
                    <th className="text-left text-gray-300 font-medium p-3">Type</th>
                    <th className="text-left text-gray-300 font-medium p-3">Status</th>
                    <th className="text-left text-gray-300 font-medium p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="border-b border-white/5">
                      <td className="text-white p-3">{apt.user?.name}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={apt.doctor?.image || 'https://via.placeholder.com/40'}
                            alt={apt.doctor?.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-purple-500"
                          />
                          <div>
                            <p className="text-white font-medium">{apt.doctor?.name}</p>
                            <p className="text-gray-400 text-xs">{apt.doctor?.specialty}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-gray-300 p-3">{apt.appointment_date}</td>
                      <td className="text-gray-300 p-3">{apt.appointment_time}</td>
                      <td className="text-gray-300 p-3">{apt.consultation_type}</td>
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          apt.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                          apt.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          apt.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          {apt.status !== 'confirmed' && (
                            <button
                              onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                              className="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 text-xs font-medium transition"
                            >
                              Confirm
                            </button>
                          )}
                          {apt.status !== 'pending' && (
                            <button
                              onClick={() => updateAppointmentStatus(apt.id, 'pending')}
                              className="px-3 py-1 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 text-xs font-medium transition"
                            >
                              Pending
                            </button>
                          )}
                          {apt.status !== 'cancelled' && (
                            <button
                              onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                              className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs font-medium transition"
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
