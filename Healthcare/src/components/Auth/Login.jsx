import { useState } from "react";
import { logow } from "../../assets";
import { authAPI } from "../../services/api";

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin) {
      if (!name) {
        newErrors.name = "Name is required";
      }
      if (!confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setServerError("");

    try {
      if (isLogin) {
        // Login
        const response = await authAPI.login({ email, password });
        
        // Store token and user data
        authAPI.setAuthData(response.token, response.user);
        
        // Call parent onLogin callback
        onLogin(response.user);
      } else {
        // Register
        const response = await authAPI.register({ name, email, password });
        
        // Store token and user data
        authAPI.setAuthData(response.token, response.user);
        
        // Call parent onLogin callback
        onLogin(response.user);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      
      // Handle error messages
      if (error.response?.data?.message) {
        setServerError(error.response.data.message);
      } else if (error.message) {
        setServerError(error.message);
      } else {
        setServerError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src={logow} alt="VitalEase" className="w-[80px] h-[28px]" />
            <span className="font-poppins font-semibold text-[28px] bg-gradient-to-r from-blue-400 to-green-400 text-transparent bg-clip-text -ml-4">
              VitalEase
            </span>
          </div>
          <p className="text-dimWhite">Your Health, Our Priority</p>
        </div>

        {/* Login/Register Card */}
        <div className="bg-purple-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl">
          <h2 className="font-poppins font-bold text-2xl text-white text-center mb-6">
            {isLogin ? "Welcome Back!" : "Create Account"}
          </h2>

          {/* Server Error Message */}
          {serverError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/50">
              <p className="text-red-400 text-sm text-center">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field (Register only) */}
            {!isLogin && (
              <div>
                <label className="block text-dimWhite text-sm mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 rounded-xl bg-purple-700/50 border ${
                    errors.name ? "border-red-500" : "border-white/10"
                  } text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition`}
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                )}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-dimWhite text-sm mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 rounded-xl bg-purple-700/50 border ${
                  errors.email ? "border-red-500" : "border-white/10"
                } text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition`}
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-dimWhite text-sm mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`w-full px-4 py-3 rounded-xl bg-purple-700/50 border ${
                  errors.password ? "border-red-500" : "border-white/10"
                } text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition`}
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field (Register only) */}
            {!isLogin && (
              <div>
                <label className="block text-dimWhite text-sm mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className={`w-full px-4 py-3 rounded-xl bg-purple-700/50 border ${
                    errors.confirmPassword ? "border-red-500" : "border-white/10"
                  } text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Forgot Password (Login only) */}
            {isLogin && (
              <div className="text-right">
                <a
                  href="#"
                  className="text-blue-400 hover:text-blue-300 text-sm transition"
                >
                  Forgot Password?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition ${
                isLoading
                  ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-green-500 text-white hover:opacity-90"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {isLogin ? "Signing In..." : "Creating Account..."}
                </span>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-white/10"></div>
            <span className="px-4 text-dimWhite text-sm">or continue with</span>
            <div className="flex-1 border-t border-white/10"></div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-700/50 border border-white/10 text-white hover:bg-purple-600/50 transition">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-700/50 border border-white/10 text-white hover:bg-purple-600/50 transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
              </svg>
              Apple
            </button>
          </div>

          {/* Toggle Login/Register */}
          <p className="text-center text-dimWhite mt-6">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
                setServerError("");
              }}
              className="text-blue-400 hover:text-blue-300 font-medium transition"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>

        {/* Admin Login Link */}
        <div className="mt-6 text-center">
          <a 
            href="/admin/login" 
            className="text-sm text-dimWhite hover:text-red-500 transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <span>🛡️</span>
            <span>Admin Portal</span>
          </a>
        </div>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-2">
              📅
            </div>
            <p className="text-dimWhite text-xs">Book Appointments</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-2">
              💊
            </div>
            <p className="text-dimWhite text-xs">Order Medications</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center mx-auto mb-2">
              🧠
            </div>
            <p className="text-dimWhite text-xs">Mental Health</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
