import React from 'react';

const Logo = ({ className = "" }) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* الشعار الرسومي */}
      <div className="relative mb-4">
        <div className="w-20 h-20 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center shadow-lg">
          {/* قبعة التخرج */}
          <div className="relative w-12 h-8">
            <div className="absolute top-0 left-0 w-6 h-4 bg-primary-700 rounded-t-lg"></div>
            <div className="absolute top-0 right-0 w-6 h-4 bg-secondary-700 rounded-t-lg"></div>
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-secondary-600 rounded-full"></div>
            {/* الشريط */}
            <div className="absolute top-2 right-0 w-1 h-6 bg-secondary-600 rounded-full"></div>
          </div>
          {/* الشخص */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <div className="w-6 h-4 bg-white rounded-full mt-1"></div>
          </div>
          {/* النجوم */}
          <div className="absolute -top-2 -right-2">
            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
          </div>
          <div className="absolute -top-1 -right-4">
            <div className="w-1.5 h-1.5 bg-secondary-500 rounded-full"></div>
          </div>
        </div>
      </div>
      
      {/* النص */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">صندوق</h1>
        <div className="text-lg font-semibold text-gray-700 mb-2">الشيخ عبدالله نمر درويش</div>
        <div className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
          للمنح
        </div>
      </div>
    </div>
  );
};

export default Logo; 