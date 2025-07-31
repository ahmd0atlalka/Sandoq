import React, { useState } from 'react';
import Logo from './components/Logo';
import AdminDashboard from './components/AdminDashboard';
import VolunteerDashboard from './components/VolunteerDashboard';
import UnifiedLogin from './components/UnifiedLogin';
import { LogIn, User, BarChart3 } from 'lucide-react';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [showLogin, setShowLogin] = useState(false);



  const handleUnifiedLogin = (userType) => {
    if (userType === 'admin') {
      setIsAdmin(true);
    } else if (userType === 'volunteer') {
      setIsVolunteer(true);
    }
    setShowLogin(false);
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
  };

  const handleVolunteerLogout = () => {
    setIsVolunteer(false);
  };

  // إذا كان المستخدم مسجل دخول كمدير
  if (isAdmin) {
    return <AdminDashboard onLogout={handleAdminLogout} />;
  }

  // إذا كان المستخدم مسجل دخول كمتطوع
  if (isVolunteer) {
    return <VolunteerDashboard onLogout={handleVolunteerLogout} />;
  }

  // إذا كان المستخدم يريد تسجيل دخول
  if (showLogin) {
    return <UnifiedLogin onLogin={handleUnifiedLogin} />;
  }

  // الصفحة الرئيسية - صفحة دخول فقط
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 font-arabic">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Logo />
          
          <div className="mt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">مرحباً بك في نظام صندوق الشيخ عبدالله نمر درويش</h2>
            <p className="text-gray-600 mb-6">قم بتسجيل الدخول للوصول للنظام</p>
            
            <button
              onClick={() => setShowLogin(true)}
              className="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg font-semibold"
            >
              <LogIn className="w-6 h-6 ml-3" />
              تسجيل الدخول
            </button>
          </div>
        </div>

        {/* معلومات إضافية */}
        <div className="max-w-2xl mx-auto mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-6 h-6 text-secondary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">للمتطوعين</h3>
              <p className="text-gray-600 text-sm">البحث عن الطلاب وتأكيد الحضور والشيكات</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">للمديرين</h3>
              <p className="text-gray-600 text-sm">لوحة الإدارة والإحصائيات والتقارير</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 