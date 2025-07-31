import { ref, get, update, set } from 'firebase/database';
import { database } from '../firebase';

export const searchStudent = async (searchType, searchValue) => {
  try {
    // الحصول على جميع البيانات من قاعدة البيانات
    const dataRef = ref(database);
    const snapshot = await get(dataRef);
    
    if (!snapshot.exists()) {
      throw new Error('لا توجد بيانات في قاعدة البيانات');
    }
    
    const allData = snapshot.val();
    
    let foundStudent = null;
    
    // البحث في جميع الطلاب
    for (const [key, student] of Object.entries(allData)) {
      if (searchType === 'group') {
        // البحث حسب رقم المجموعة (Code)
        if (student.Code === searchValue) {
          foundStudent = { ...student, dbKey: key }; // إضافة معرف قاعدة البيانات كـ dbKey
          break;
        }
      } else if (searchType === 'id') {
        // البحث حسب رقم الهوية (id)
        if (student.id == searchValue) { // eslint-disable-line eqeqeq
          foundStudent = { ...student, dbKey: key }; // إضافة معرف قاعدة البيانات كـ dbKey
          break;
        }
      }
    }
    
    if (!foundStudent) {
      if (searchType === 'group') {
        throw new Error(`لم يتم العثور على طالب في المجموعة ${searchValue}`);
      } else {
        throw new Error(`لم يتم العثور على طالب برقم الهوية ${searchValue}`);
      }
    }
    
    return foundStudent;
    
  } catch (error) {
    throw error;
  }
};

export const updateAttendance = async (studentId) => {
  try {
    // التأكد من أن studentId هو نص
    const studentIdStr = String(studentId);
    
    // الحصول على مرجع الطالب
    const studentRef = ref(database, studentIdStr);
    
    // قراءة البيانات الحالية
    const snapshot = await get(studentRef);
    
    if (!snapshot.exists()) {
      throw new Error(`الطالب برقم ${studentIdStr} غير موجود`);
    }
    
    const currentData = snapshot.val();
    
    // التحقق من القيمة الحالية
    if (currentData.IS_Participated === 0) {
      return true;
    }
    
    // تحديث البيانات باستخدام update بدلاً من set
    const updateData = {
      IS_Participated: 0
    };
    
    await update(studentRef, updateData);
    
    // انتظار للتأكد من حفظ البيانات
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // قراءة البيانات مرة أخرى للتحقق
    const updatedSnapshot = await get(studentRef);
    const updatedData = updatedSnapshot.val();
    
    if (updatedData.IS_Participated === 0) {
      return true;
    } else {
      throw new Error('فشل في تحديث الحضور - القيمة لم تتغير');
    }
    
  } catch (error) {
    // إذا فشل update، نجرب set كبديل
    if (error.message.includes('permission') || error.message.includes('rules')) {
      try {
        const studentIdStr = String(studentId);
        const fieldRef = ref(database, `${studentIdStr}/IS_Participated`);
        await set(fieldRef, 0);
        return true;
      } catch (setError) {
        throw new Error(`فشل في التحديث: ${setError.message}`);
      }
    }
    
    throw error;
  }
};

export const updateCheckReceived = async (studentId) => {
  try {
    // التأكد من أن studentId هو نص
    const studentIdStr = String(studentId);
    
    // الحصول على مرجع الطالب
    const studentRef = ref(database, studentIdStr);
    
    // قراءة البيانات الحالية
    const snapshot = await get(studentRef);
    
    if (!snapshot.exists()) {
      throw new Error(`الطالب برقم ${studentIdStr} غير موجود`);
    }
    
    const currentData = snapshot.val();
    
    // التحقق من أن الحضور مؤكد أولاً
    if (currentData.IS_Participated !== 0) {
      throw new Error('يجب تأكيد الحضور أولاً قبل تأكيد استلام الشيك');
    }
    
    // التحقق من القيمة الحالية
    if (currentData.Is_received === 0) {
      return true;
    }
    
    // تحديث البيانات باستخدام update بدلاً من set
    const updateData = {
      Is_received: 0
    };
    
    await update(studentRef, updateData);
    
    // انتظار للتأكد من حفظ البيانات
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // قراءة البيانات مرة أخرى للتحقق
    const updatedSnapshot = await get(studentRef);
    const updatedData = updatedSnapshot.val();
    
    if (updatedData.Is_received === 0) {
      return true;
    } else {
      throw new Error('فشل في تحديث استلام الشيك - القيمة لم تتغير');
    }
    
  } catch (error) {
    // إذا فشل update، نجرب set كبديل
    if (error.message.includes('permission') || error.message.includes('rules')) {
      try {
        const studentIdStr = String(studentId);
        const fieldRef = ref(database, `${studentIdStr}/Is_received`);
        await set(fieldRef, 0);
        return true;
      } catch (setError) {
        throw new Error(`فشل في التحديث: ${setError.message}`);
      }
    }
    
    throw error;
  }
};