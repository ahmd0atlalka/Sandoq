import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';

const UnifiedLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password === 'Admin') {
      setError('');
      onLogin('volunteer');
    } else if (password === 'A12345') {
      setError('');
      onLogin('admin');
    } else {
      setError('كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center font-arabic">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-10 h-10 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">تسجيل الدخول</h2>
          <p className="text-gray-600">أدخل كلمة المرور للوصول للنظام</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-12"
                placeholder="أدخل كلمة المرور"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            دخول
          </button>
        </form>

        

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center text-sm text-gray-500">
            <Shield className="w-4 h-4 ml-2" />
            نظام آمن ومحمي
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedLogin; 