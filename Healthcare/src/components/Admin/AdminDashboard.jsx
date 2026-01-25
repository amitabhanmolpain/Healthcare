import { useState, useEffect, useMemo } from 'react';
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
  const [appointmentFilter, setAppointmentFilter] = useState('new'); // 'new' or 'old'

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
                              src={
                                (apt.doctor && (apt.doctor.image || apt.doctor.img))
                                  || (apt.doctor_image)
                                  || 'https://via.placeholder.com/40'
                              }
                              alt={apt.doctor?.name || apt.doctor_id || 'Unknown Doctor'}
                              className="w-10 h-10 rounded-full object-cover border-2 border-purple-500"
                            />
                            <div>
                              <p className="text-white font-medium">
                                {apt.doctor?.name || apt.doctor_name || apt.doctor_id || 'Unknown Doctor'}
                              </p>
                              <p className="text-gray-400 text-xs">
                                {apt.doctor?.specialty || ''}
                              </p>
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
                  <div key={doctor.id} className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center p-6">
                    <img
                      src={doctor.image || 'https://via.placeholder.com/120'}
                      alt={doctor.name}
                      className="w-24 h-24 rounded-lg object-cover border-2 border-purple-400 shadow mb-4 bg-white mx-auto"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/120'; }}
                    />
                    <h3 className="text-white font-bold text-lg mb-1">{doctor.name}</h3>
                    <div className="flex flex-wrap justify-center gap-2 mb-2">
                      <span className="bg-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full">{doctor.specialty}</span>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${doctor.is_active ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}`}>{doctor.is_active ? 'Available' : 'Offline'}</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 mb-2">
                      {doctor.qualifications && doctor.qualifications.map((q, i) => (
                        <span key={i} className="bg-white/10 text-purple-200 text-xs px-2 py-0.5 rounded-full">{q}</span>
                      ))}
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 mb-2">
                      <span className="flex items-center gap-1 text-yellow-400 text-sm font-semibold bg-yellow-400/10 px-2 py-1 rounded-full"><svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.036 6.29a1 1 0 00.95.69h6.6c.969 0 1.371 1.24.588 1.81l-5.347 3.89a1 1 0 00-.364 1.118l2.036 6.29c.3.921-.755 1.688-1.538 1.118l-5.347-3.89a1 1 0 00-1.176 0l-5.347 3.89c-.783.57-1.838-.197-1.538-1.118l2.036-6.29a1 1 0 00-.364-1.118l-5.347-3.89c-.783-.57-.38-1.81.588-1.81h6.6a1 1 0 00.95-.69l2.036-6.29z' /></svg>{doctor.rating || '4.5'}</span>
                      <span className="flex items-center gap-1 text-green-400 text-sm font-semibold bg-green-400/10 px-2 py-1 rounded-full">₹{doctor.consultation_fee}</span>
                      <span className="bg-purple-500/20 text-purple-200 text-xs font-semibold px-3 py-1 rounded-full">{doctor.experience} yrs</span>
                    </div>
                    <p className="text-gray-300 text-xs mb-4 min-h-[40px]">{doctor.about}</p>
                    <div className="flex items-center justify-center gap-2 mt-auto">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={doctor.is_active}
                          onChange={() => toggleDoctorStatus(doctor.id, doctor.is_active)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer dark:bg-gray-700 peer-checked:bg-green-500 transition-all duration-300"></div>
                        <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-md transition-transform duration-300 peer-checked:translate-x-5"></div>
                      </label>
                      <span className={`text-xs font-medium ${doctor.is_active ? 'text-green-400' : 'text-gray-400'}`}>{doctor.is_active ? 'Available' : 'Offline'}</span>
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-bold text-xl">Appointment Management</h2>
              <div className="flex items-center gap-4">
                <div className="flex bg-white/10 rounded-lg p-1">
                  <button
                    onClick={() => setAppointmentFilter('new')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                      appointmentFilter === 'new'
                        ? 'bg-purple-500 text-white'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    New Requests
                  </button>
                  <button
                    onClick={() => setAppointmentFilter('old')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                      appointmentFilter === 'old'
                        ? 'bg-purple-500 text-white'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    Past Requests
                  </button>
                </div>
              </div>
            </div>

            {(() => {
              const filteredAppointments = appointments.filter(apt => {
                const appointmentDate = new Date(apt.appointment_date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (appointmentFilter === 'new') {
                  // New: pending status or future dates
                  return apt.status === 'pending' || appointmentDate >= today;
                } else {
                  // Old: confirmed/cancelled or past dates
                  return apt.status === 'confirmed' || apt.status === 'cancelled' || appointmentDate < today;
                }
              });

              return (
                <>
                  <div className="mb-4">
                    <p className="text-gray-300 text-sm">
                      Showing {filteredAppointments.length} {appointmentFilter === 'new' ? 'new' : 'past'} appointment{filteredAppointments.length !== 1 ? 's' : ''}
                    </p>
                  </div>

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
                        {filteredAppointments.map((apt) => {
                          const isPastAppointment = new Date(apt.appointment_date) < new Date();
                          const canModify = appointmentFilter === 'new' && !isPastAppointment;
                          
                          return (
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
                                  {canModify && apt.status !== 'confirmed' && (
                                    <button
                                      onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                                      className="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 text-xs font-medium transition"
                                    >
                                      Accept
                                    </button>
                                  )}
                                  {canModify && apt.status !== 'pending' && (
                                    <button
                                      onClick={() => updateAppointmentStatus(apt.id, 'pending')}
                                      className="px-3 py-1 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 text-xs font-medium transition"
                                    >
                                      Pending
                                    </button>
                                  )}
                                  {canModify && apt.status !== 'cancelled' && (
                                    <button
                                      onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                                      className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs font-medium transition"
                                    >
                                      Reject
                                    </button>
                                  )}
                                  {!canModify && (
                                    <span className="text-gray-500 text-xs">No actions available</span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
