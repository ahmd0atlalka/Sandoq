import React, { useState } from 'react';
import { 
  User, 
  Search, 
  LogOut, 
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import SearchForm from './SearchForm';
import StudentCard from './StudentCard';
import Logo from './Logo';

const VolunteerDashboard = ({ onLogout }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSearch = async (searchType, searchValue) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    setStudent(null);

    try {
      const { searchStudent } = await import('../services/firebaseService');
      const result = await searchStudent(searchType, searchValue);
      setStudent(result);
      setSuccess(`تم العثور على الطالب: ${result.fullname || result['fullname'] || 'غير محدد'}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAttendance = async (student) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { updateAttendance } = await import('../services/firebaseService');
      await updateAttendance(student.dbKey);
      setSuccess('تم تأكيد الحضور بنجاح');
      
      // إعادة جلب بيانات الطالب المحدثة من قاعدة البيانات
      const { searchStudent } = await import('../services/firebaseService');
      const updatedStudent = await searchStudent('id', student.id);
      setStudent(updatedStudent);
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCheck = async (student) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { updateCheckReceived } = await import('../services/firebaseService');
      await updateCheckReceived(student.dbKey);
      setSuccess('تم تأكيد استلام الشيك بنجاح');
      
      // إعادة جلب بيانات الطالب المحدثة من قاعدة البيانات
      const { searchStudent } = await import('../services/firebaseService');
      const updatedStudent = await searchStudent('id', student.id);
      setStudent(updatedStudent);
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNewSearch = () => {
    setStudent(null);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 font-arabic">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-secondary-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">نظام المتطوعين</h1>
                <p className="text-sm text-gray-600">صندوق الشيخ عبدالله نمر درويش للمنح</p>
              </div>
            </div>
            
            <button
              onClick={onLogout}
              className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 ml-2" />
              خروج
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Logo />
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">مرحباً بك في نظام تسجيل الطلاب</h2>
            <p className="text-gray-600">ابحث عن الطالب وقم بتأكيد حضوره أو استلام شيكه</p>
          </div>
        </div>

        {/* رسائل الحالة */}
        {loading && (
          <div className="text-center mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-800 ml-2"></div>
              جاري التحميل...
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-600 ml-2" />
              <div>
                <p className="text-red-800 font-semibold">خطأ:</p>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 ml-2" />
              <div>
                <p className="text-green-800 font-semibold">نجح:</p>
                <p className="text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* إما تفاصيل الطالب أو نموذج البحث */}
        {student ? (
          <div>
            <StudentCard
              student={student}
              onConfirmAttendance={handleConfirmAttendance}
              onConfirmCheck={handleConfirmCheck}
              isLoading={loading}
            />
            
            {/* زر البحث عن طالب آخر */}
            <div className="text-center mt-6">
              <button
                onClick={handleNewSearch}
                className="inline-flex items-center px-6 py-3 bg-secondary-600 hover:bg-secondary-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Search className="w-5 h-5 ml-2" />
                بحث عن طالب آخر
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-secondary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">البحث عن الطلاب</h3>
                <p className="text-gray-600">ابحث عن الطالب بالمجموعة أو رقم الهوية</p>
              </div>
              
              <SearchForm onSearch={handleSearch} />
            </div>
          </div>
        )}

        {/* تعليمات للمتطوعين */}
        {!student && (
          <div className="max-w-2xl mx-auto mt-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start">
                <AlertCircle className="w-6 h-6 text-blue-600 ml-3 mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-blue-800 mb-2">تعليمات للمتطوعين:</h4>
                  <ul className="text-blue-700 space-y-2 text-sm">
                    <li className="flex items-center">
                      <ArrowRight className="w-4 h-4 ml-2" />
                      ابحث عن الطالب بالمجموعة (مثل A-1) أو رقم الهوية
                    </li>
                    <li className="flex items-center">
                      <ArrowRight className="w-4 h-4 ml-2" />
                      تأكد من هوية الطالب قبل تأكيد الحضور
                    </li>
                    <li className="flex items-center">
                      <ArrowRight className="w-4 h-4 ml-2" />
                      لا يمكن تأكيد استلام الشيك إلا بعد تأكيد الحضور
                    </li>
                    <li className="flex items-center">
                      <ArrowRight className="w-4 h-4 ml-2" />
                      تأكد من صحة البيانات قبل التحديث
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerDashboard; 