import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiPhone } from 'react-icons/fi';
import { authAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import Button from '../components/common/Button';
import useNotification from '../hooks/useNotification';

const Auth = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { success, error } = useNotification();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('customer');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (isLogin) {
        response = await authAPI.login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        response = await authAPI.register({
          ...formData,
          role,
        });
      }

      const { user, token } = response.data.data;
      login(user, token);
      success(isLogin ? 'Login successful!' : 'Registration successful!');
      
      setTimeout(() => {
        navigate(user.role === 'worker' ? '/worker-dashboard' : '/customer-dashboard');
      }, 1000);
    } catch (err) {
      error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-accent flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-4xl">🐝</span>
          <h1 className="text-3xl font-bold text-secondary mt-2">WorkBee</h1>
        </div>

        {/* Toggle */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 font-bold rounded-lg transition ${
              isLogin ? 'bg-primary text-dark' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 font-bold rounded-lg transition ${
              !isLogin ? 'bg-primary text-dark' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name (signup only) */}
          {!isLogin && (
            <div className="relative">
              <FiUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          )}

          {/* Email */}
          <div className="relative">
            <FiMail className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FiLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>

          {/* Phone (signup only) */}
          {!isLogin && (
            <div className="relative">
              <FiPhone className="absolute left-3 top-3 text-gray-400" />
              <input
                type="tel"
                name="phone"
                placeholder="Phone (10 digits)"
                value={formData.phone}
                onChange={handleChange}
                required={!isLogin}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          )}

          {/* Role (signup only) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-bold mb-2">I am a:</label>
              <div className="flex gap-3">
                {['customer', 'worker'].map((r) => (
                  <label key={r} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value={r}
                      checked={role === r}
                      onChange={() => setRole(r)}
                      className="cursor-pointer"
                    />
                    <span className="capitalize">{r}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            loading={loading}
            className="w-full"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
