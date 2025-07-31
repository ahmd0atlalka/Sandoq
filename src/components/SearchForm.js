import React, { useState } from 'react';
import { Search, User, Hash } from 'lucide-react';

const SearchForm = ({ onSearch }) => {
  const [searchType, setSearchType] = useState('group'); // 'group' or 'id'
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [groupNumber, setGroupNumber] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // الحروف المتاحة من A إلى O
  const availableLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let searchValue = '';
    if (searchType === 'group') {
      if (!groupNumber.trim()) {
        alert('يرجى إدخال رقم المجموعة');
        return;
      }
      // تنسيق رقم المجموعة: A-1, B-2, إلخ (بدون إضافة صفر)
      searchValue = `${selectedLetter}-${groupNumber}`;
    } else {
      if (!idNumber.trim()) {
        alert('يرجى إدخال رقم الهوية');
        return;
      }
      searchValue = idNumber.trim();
    }

    setIsLoading(true);
    try {
      await onSearch(searchType, searchValue);
    } catch (error) {
      // تم حذف console.error للأمان
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
        البحث عن الطالب
      </h2>
      
      {/* نوع البحث */}
      <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
        <button
          type="button"
          onClick={() => setSearchType('group')}
          className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-all ${
            searchType === 'group'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Hash className="w-4 h-4 ml-2" />
          رقم المجموعة
        </button>
        <button
          type="button"
          onClick={() => setSearchType('id')}
          className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-all ${
            searchType === 'id'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <User className="w-4 h-4 ml-2" />
          رقم الهوية
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {searchType === 'group' ? (
          <div className="space-y-4">
            {/* اختيار الحرف */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اختر الحرف
              </label>
              <div className="grid grid-cols-5 gap-2">
                {availableLetters.map((letter) => (
                  <button
                    key={letter}
                    type="button"
                    onClick={() => setSelectedLetter(letter)}
                    className={`py-2 px-3 rounded-lg border-2 transition-all ${
                      selectedLetter === letter
                        ? 'border-primary-600 bg-primary-50 text-primary-700 font-semibold'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-primary-400 hover:bg-primary-50'
                    }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>

            {/* إدخال الرقم */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم المجموعة (مثال: 1, 2, 3...)
              </label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={groupNumber}
                  onChange={(e) => setGroupNumber(e.target.value)}
                  placeholder="أدخل الرقم (1-99)"
                  className="input-field pr-10"
                  required
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                سيتم البحث عن: {selectedLetter}-{groupNumber || 'X'}
              </p>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رقم الهوية
            </label>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="أدخل رقم الهوية"
                className="input-field pr-10"
                required
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || (searchType === 'group' && !groupNumber.trim()) || (searchType === 'id' && !idNumber.trim())}
          className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
              جاري البحث...
            </div>
          ) : (
            'بحث'
          )}
        </button>
      </form>
    </div>
  );
};

export default SearchForm; 