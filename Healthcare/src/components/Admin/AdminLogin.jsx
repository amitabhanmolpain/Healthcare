import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';

// Use /api prefix to let Vite proxy handle requests
const API_BASE_URL = '/api';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/login`, formData);
      
      if (response.data.token) {
        // Store admin token and data
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('admin', JSON.stringify(response.data.admin));
        
        toast.success('Admin login successful!');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      const errorMessage = error.response?.data?.message || 'Invalid admin credentials';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 w-full max-w-md border border-white/20 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-orange-500 mb-4">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-gray-300">Secure access for administrators only</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-white font-medium mb-2">Email Address</label>
            <div className="relative">
              <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@healthcare.com"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-white font-medium mb-2">Password</label>
            <div className="relative">
              <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login as Admin'}
          </button>
        </form>

        {/* Back to User Login */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-300 hover:text-white transition text-sm"
          >
            ← Back to User Login
          </button>
        </div>

        {/* Warning */}
        <div className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
          <p className="text-red-300 text-xs text-center">
            ⚠️ This area is restricted to authorized administrators only. Unauthorized access attempts are logged.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
