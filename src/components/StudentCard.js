import React from 'react';
import { User, Phone, FileText, MapPin, CheckCircle, CreditCard } from 'lucide-react';

const StudentCard = ({ student, onConfirmAttendance, onConfirmCheck, isLoading }) => {
  // دالة للحصول على الاسم حسب المغلف
  const getNameAsGroup = () => {
    const name = student.nameAsgroup || student['nameAsgroup'] || 'غير متوفر';
    return name;
  };

  // دالة للحصول على الاسم الكامل
  const getFullName = () => {
    const name = student.fullname || student['fullname'] || 'غير متوفر';
    return name;
  };

  // دالة للحصول على آخر 4 أرقام من الهاتف
  const getLastFourDigits = (phone) => {
    if (!phone) return 'غير متوفر';
    const phoneStr = String(phone);
    const cleanPhone = phoneStr.replace(/\D/g, '');
    return cleanPhone.slice(-4);
  };

  // دالة للحصول على آخر 4 أرقام من الهوية
  const getLastFourId = (id) => {
    if (!id) return 'غير متوفر';
    return String(id).slice(-4);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-primary-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{getFullName()}</h3>
          <p className="text-gray-600">{getNameAsGroup()}</p>
        </div>

        {/* Student Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <User className="w-5 h-5 text-primary-600 ml-3" />
            <div>
              <p className="text-sm text-gray-500">آخر 4 أرقام من الهوية</p>
              <p className="font-semibold text-gray-800">{getLastFourId(student.id)}</p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <Phone className="w-5 h-5 text-primary-600 ml-3" />
            <div>
              <p className="text-sm text-gray-500">آخر 4 أرقام من الهاتف</p>
              <p className="font-semibold text-gray-800">{getLastFourDigits(student.phone)}</p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <FileText className="w-5 h-5 text-primary-600 ml-3" />
            <div>
              <p className="text-sm text-gray-500">الاسم حسب المغلف</p>
              <p className="font-semibold text-gray-800">{getNameAsGroup()}</p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <MapPin className="w-5 h-5 text-primary-600 ml-3" />
            <div>
              <p className="text-sm text-gray-500">البلد/المدينة</p>
              <p className="font-semibold text-gray-800">{student.city || 'غير متوفر'}</p>
            </div>
          </div>
  
   <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <MapPin className="w-5 h-5 text-primary-600 ml-3" />
            <div>
              <p className="text-sm text-gray-500">رقم الطاولة</p>
              <p className="font-semibold text-gray-800">{student.Code || 'غير متوفر'}</p>
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center justify-center space-x-4 space-x-reverse mb-6">
          <div className={`flex items-center px-4 py-2 rounded-lg ${
            student.IS_Participated === 0 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            <CheckCircle className={`w-4 h-4 ml-2 ${
              student.IS_Participated === 0 ? 'text-green-600' : 'text-yellow-600'
            }`} />
            <span className="text-sm font-medium">
              {student.IS_Participated === 0 ? 'حضور مؤكد' : 'حضور غير مؤكد'}
            </span>
          </div>

          <div className={`flex items-center px-4 py-2 rounded-lg ${
            student.Is_received === 0 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            <CreditCard className={`w-4 h-4 ml-2 ${
              student.Is_received === 0 ? 'text-green-600' : 'text-yellow-600'
            }`} />
            <span className="text-sm font-medium">
              {student.Is_received === 0 ? 'شيك مستلم' : 'شيك غير مستلم'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onConfirmAttendance(student)}
            disabled={isLoading || student.IS_Participated === 0}
            className={`flex-1 flex items-center justify-center py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
              student.IS_Participated === 0
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'btn-primary'
            }`}
          >
            <CheckCircle className="w-5 h-5 ml-2" />
            {student.IS_Participated === 0 ? 'الحضور مؤكد' : 'تأكيد الحضور'}
          </button>

          <button
            onClick={() => onConfirmCheck(student)}
            disabled={isLoading || student.Is_received === 0 || student.IS_Participated !== 0}
            className={`flex-1 flex items-center justify-center py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
              student.Is_received === 0
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : student.IS_Participated !== 0
                ? 'bg-red-100 text-red-600 cursor-not-allowed'
                : 'btn-secondary'
            }`}
          >
            <CreditCard className="w-5 h-5 ml-2" />
            {student.Is_received === 0 
              ? 'الشيك مستلم' 
              : student.IS_Participated !== 0 
              ? 'يجب تأكيد الحضور أولاً'
              : 'تأكيد استلام الشيك'
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentCard; 
