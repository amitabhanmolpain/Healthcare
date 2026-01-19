import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
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
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);

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
  }, [navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const dashboardRes = await axios.get(`${API_BASE_URL}/admin/dashboard`, config);
      setStats(dashboardRes.data.stats);
      setRecentAppointments(dashboardRes.data.recent_appointments);

      if (activeTab === 'users') {
        const usersRes = await axios.get(`${API_BASE_URL}/admin/users`, config);
        setUsers(usersRes.data.users);
      } else if (activeTab === 'appointments') {
        const appointmentsRes = await axios.get(`${API_BASE_URL}/admin/appointments`, config);
        setAppointments(appointmentsRes.data.appointments);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Session expired. Please login again.');
        handleLogout();
      } else {
        toast.error('Failed to load dashboard data');
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
                <p className="text-gray-300 text-sm">{admin?.name}</p>
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
            onClick={() => { setActiveTab('dashboard'); fetchDashboardData(); }}
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
            onClick={() => { setActiveTab('users'); fetchDashboardData(); }}
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
            onClick={() => { setActiveTab('appointments'); fetchDashboardData(); }}
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
                        <td className="text-gray-300 p-3">{apt.doctor?.name}</td>
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
                    <th className="text-left text-gray-300 font-medium p-3">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-white/5">
                      <td className="text-white p-3">{user.name}</td>
                      <td className="text-gray-300 p-3">{user.email}</td>
                      <td className="text-gray-300 p-3">{user.phone || 'N/A'}</td>
                      <td className="text-gray-300 p-3">{user.created_at || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                    <th className="text-left text-gray-300 font-medium p-3">Specialty</th>
                    <th className="text-left text-gray-300 font-medium p-3">Date</th>
                    <th className="text-left text-gray-300 font-medium p-3">Time</th>
                    <th className="text-left text-gray-300 font-medium p-3">Type</th>
                    <th className="text-left text-gray-300 font-medium p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="border-b border-white/5">
                      <td className="text-white p-3">{apt.user?.name}</td>
                      <td className="text-gray-300 p-3">{apt.doctor?.name}</td>
                      <td className="text-gray-300 p-3">{apt.doctor?.specialty}</td>
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
