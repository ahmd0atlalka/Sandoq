import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  CheckCircle, 
  CreditCard, 
  Download, 
  Printer, 
  LogOut,
  TrendingUp,
  MapPin,
  FileText
} from 'lucide-react';
import { database } from '../firebase';
import { ref, get } from 'firebase/database';
import { 
  CitiesBarChart, 
  GroupsBarChart, 
  AttendanceDoughnutChart, 
  CheckReceivedDoughnutChart 
} from './Charts';

const AdminDashboard = ({ onLogout }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    attended: 0,
    received: 0,
    cities: {},
    groups: {}
  });

  useEffect(() => {
    fetchAllStudents();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAllStudents = async () => {
    try {
      setLoading(true);
      const dataRef = ref(database);
      const snapshot = await get(dataRef);
      
      if (snapshot.exists()) {
        const allData = snapshot.val();
        const studentsList = Object.entries(allData).map(([key, student]) => ({
          ...student,
          dbKey: key
        }));
        
        setStudents(studentsList);
        calculateStats(studentsList);
      }
    } catch (error) {
      // تم حذف console.error للأمان
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (studentsList) => {
    const stats = {
      total: studentsList.length,
      attended: studentsList.filter(s => s.IS_Participated === 0).length,
      received: studentsList.filter(s => s.Is_received === 0).length,
      cities: {},
      groups: {}
    };

    studentsList.forEach(student => {
      // إحصائيات المدن
      const city = student.city || 'غير محدد';
      stats.cities[city] = (stats.cities[city] || 0) + 1;

      // إحصائيات المجموعات
      const group = student.Code || 'غير محدد';
      stats.groups[group] = (stats.groups[group] || 0) + 1;
    });

    setStats(stats);
  };

  const exportToExcel = () => {
    const headers = [
      'المجموعة', 'الاسم الكامل', 'الاسم حسب المغلف', 'رقم الهوية', 
      'آخر 4 أرقام الهوية', 'الهاتف', 'آخر 4 أرقام الهاتف', 
      'المدينة', 'البريد الإلكتروني', 'حالة الحضور', 'حالة استلام الشيك'
    ];

    const data = students.map(student => [
      student.Code || '',
      student.fullname || '',
      student.nameAsgroup || '',
      student.id || '',
      String(student.id || '').slice(-4),
      student.phone || '',
      String(student.phone || '').replace(/\D/g, '').slice(-4),
      student.city || '',
      student.email || '',
      student.IS_Participated === 0 ? 'حاضر' : 'غير حاضر',
      student.Is_received === 0 ? 'مستلم' : 'غير مستلم'
    ]);

    const csvContent = [headers, ...data]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `طلاب_صندوق_عبدالله_نمر_درويش_${new Date().toLocaleDateString('ar-SA')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printData = () => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <html dir="rtl">
        <head>
          <title>تقرير الطلاب - صندوق عبدالله نمر درويش</title>
          <style>
            body { font-family: 'Cairo', sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
            th { background-color: #f2f2f2; }
            .header { text-align: center; margin-bottom: 30px; }
            .stats { display: flex; justify-content: space-around; margin: 20px 0; }
            .stat { text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>تقرير الطلاب</h1>
            <h2>صندوق الشيخ عبدالله نمر درويش للمنح</h2>
            <p>تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}</p>
          </div>
          
          <div class="stats">
            <div class="stat">
              <h3>إجمالي الطلاب</h3>
              <p>${stats.total}</p>
            </div>
            <div class="stat">
              <h3>الحضور المؤكد</h3>
              <p>${stats.attended}</p>
            </div>
            <div class="stat">
              <h3>الشيكات المستلمة</h3>
              <p>${stats.received}</p>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>المجموعة</th>
                <th>الاسم الكامل</th>
                <th>الاسم حسب المغلف</th>
                <th>رقم الهوية</th>
                <th>الهاتف</th>
                <th>المدينة</th>
                <th>حالة الحضور</th>
                <th>حالة الشيك</th>
              </tr>
            </thead>
            <tbody>
              ${students.map(student => `
                <tr>
                  <td>${student.Code || ''}</td>
                  <td>${student.fullname || ''}</td>
                  <td>${student.nameAsgroup || ''}</td>
                  <td>${student.id || ''}</td>
                  <td>${student.phone || ''}</td>
                  <td>${student.city || ''}</td>
                  <td>${student.IS_Participated === 0 ? 'حاضر' : 'غير حاضر'}</td>
                  <td>${student.Is_received === 0 ? 'مستلم' : 'غير مستلم'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center font-arabic">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 font-arabic">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">لوحة الإدارة</h1>
                <p className="text-sm text-gray-600">صندوق الشيخ عبدالله نمر درويش للمنح</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 space-x-reverse">
              <button
                onClick={fetchAllStudents}
                className="flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
              >
                <div className="w-4 h-4 ml-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                تحديث البيانات
              </button>
              <button
                onClick={exportToExcel}
                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4 ml-2" />
                تصدير Excel
              </button>
              <button
                onClick={printData}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Printer className="w-4 h-4 ml-2" />
                طباعة
              </button>
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
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">إجمالي الطلاب</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">الحضور المؤكد</p>
                <p className="text-2xl font-bold text-gray-800">{stats.attended}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">الشيكات المستلمة</p>
                <p className="text-2xl font-bold text-gray-800">{stats.received}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">نسبة الحضور</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.total > 0 ? Math.round((stats.attended / stats.total) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Cities Bar Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <MapPin className="w-5 h-5 ml-2 text-primary-600" />
              توزيع الطلاب حسب المدن
            </h3>
            <div className="h-80">
              <CitiesBarChart citiesData={stats.cities} />
            </div>
          </div>

          {/* Groups Bar Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FileText className="w-5 h-5 ml-2 text-primary-600" />
              توزيع الطلاب حسب المجموعات
            </h3>
            <div className="h-80">
              <GroupsBarChart groupsData={stats.groups} />
            </div>
          </div>
        </div>

        {/* Doughnut Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Attendance Doughnut Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 ml-2 text-green-600" />
              نسبة الحضور
            </h3>
            <div className="h-80 flex items-center justify-center">
              <AttendanceDoughnutChart 
                total={stats.total} 
                attended={stats.attended} 
                received={stats.received} 
              />
            </div>
          </div>

          {/* Check Received Doughnut Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <CreditCard className="w-5 h-5 ml-2 text-purple-600" />
              نسبة استلام الشيكات
            </h3>
            <div className="h-80 flex items-center justify-center">
              <CheckReceivedDoughnutChart 
                total={stats.total} 
                received={stats.received} 
              />
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">جدول الطلاب</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المجموعة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الاسم الكامل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المدينة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    رقم الهوية
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحضور
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الشيك
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student, index) => (
                  <tr key={student.dbKey} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.Code || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.fullname || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.city || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.id ? String(student.id).slice(-4) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        student.IS_Participated === 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {student.IS_Participated === 0 ? 'حاضر' : 'غير حاضر'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        student.Is_received === 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {student.Is_received === 0 ? 'مستلم' : 'غير مستلم'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 