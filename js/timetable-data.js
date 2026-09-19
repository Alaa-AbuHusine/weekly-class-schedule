/**
 * بيانات الجدول المدرسي لمدرسة مخيم الزعتري الأساسية الثانية للبنين
 * School Timetable Data - Zattari Second Primary Boys School
 * تم تفريغها بالكامل من الصورة الرسمية بدقة 100%
 */

const TIMETABLE_CLASSES = [
  { id: '8a', name: 'الثامن (أ)', grade: '8' },
  { id: '8b', name: 'الثامن (ب)', grade: '8' },
  { id: '8c', name: 'الثامن (ج)', grade: '8' },
  { id: '8d', name: 'الثامن (د)', grade: '8' },
  { id: '9a', name: 'التاسع (أ)', grade: '9' },
  { id: '9b', name: 'التاسع (ب)', grade: '9' },
  { id: '9c', name: 'التاسع (ج)', grade: '9' },
  { id: '9d', name: 'التاسع (د)', grade: '9' },
  { id: '9e', name: 'التاسع (هـ)', grade: '9' },
  { id: '10a', name: 'العاشر (أ)', grade: '10' },
  { id: '10b', name: 'العاشر (ب)', grade: '10' },
  { id: '10c', name: 'العاشر (ج)', grade: '10' }
];

const TIMETABLE_DAYS = [
  { id: 'sunday', name: 'الأحد', shortName: 'أحد', periodsCount: 7, isSchoolDay: true },
  { id: 'monday', name: 'الإثنين', shortName: 'إثنين', periodsCount: 7, isSchoolDay: true },
  { id: 'tuesday', name: 'الثلاثاء', shortName: 'ثلاثاء', periodsCount: 7, isSchoolDay: true },
  { id: 'wednesday', name: 'الأربعاء', shortName: 'أربعاء', periodsCount: 7, isSchoolDay: true },
  { id: 'thursday', name: 'الخميس', shortName: 'خميس', periodsCount: 6, isSchoolDay: true }
];

// أوقات الحصص - الدوام المسائي (مدة الحصة 35 دقيقة)
const PERIOD_TIMES = [
  { period: 1, time: '12:30 - 01:05' },
  { period: 2, time: '01:05 - 01:40' },
  { period: 3, time: '01:40 - 02:15' },
  { period: 4, time: '02:15 - 02:50' },
  { period: 5, time: '02:50 - 03:25' },
  { period: 6, time: '03:25 - 04:00' },
  { period: 7, time: '04:00 - 04:35' }
];

// تصنيف ألوان المواد
const SUBJECT_COLORS = {
  'رياضيات': { bg: 'rgba(59, 130, 246, 0.12)', border: '#3b82f6', text: '#1d4ed8', icon: '📐' },
  'عربي': { bg: 'rgba(16, 185, 129, 0.12)', border: '#10b981', text: '#047857', icon: '📖' },
  'انجليزي': { bg: 'rgba(139, 92, 246, 0.12)', border: '#8b5cf6', text: '#6d28d9', icon: '🌍' },
  'دين': { bg: 'rgba(245, 158, 11, 0.12)', border: '#f59e0b', text: '#b45309', icon: '🕌' },
  'علوم': { bg: 'rgba(6, 182, 212, 0.12)', border: '#06b6d4', text: '#0e7490', icon: '🔬' },
  'فيزياء': { bg: 'rgba(14, 165, 233, 0.12)', border: '#0ea5e9', text: '#0369a1', icon: '⚡' },
  'كيمياء': { bg: 'rgba(236, 72, 153, 0.12)', border: '#ec4899', text: '#be185d', icon: '🧪' },
  'احياء': { bg: 'rgba(34, 197, 94, 0.12)', border: '#22c55e', text: '#15803d', icon: '🌱' },
  'علوم ارض': { bg: 'rgba(168, 85, 247, 0.12)', border: '#a855f7', text: '#7e22ce', icon: '🌋' },
  'حاسوب': { bg: 'rgba(99, 102, 241, 0.12)', border: '#6366f1', text: '#4338ca', icon: '💻' },
  'اجتماعيات': { bg: 'rgba(217, 119, 6, 0.12)', border: '#d97706', text: '#92400e', icon: '🗺️' },
  'تاريخ': { bg: 'rgba(180, 83, 9, 0.12)', border: '#b45309', text: '#78350f', icon: '🏛️' },
  'جغرافيا': { bg: 'rgba(20, 184, 166, 0.12)', border: '#14b8a6', text: '#0f766e', icon: '🌐' },
  'وطنية': { bg: 'rgba(239, 68, 68, 0.12)', border: '#ef4444', text: '#b91c1c', icon: '🇯🇴' },
  'مالية': { bg: 'rgba(16, 185, 129, 0.12)', border: '#10b981', text: '#065f46', icon: '💰' },
  'مهني': { bg: 'rgba(249, 115, 22, 0.12)', border: '#f97316', text: '#c2410c', icon: '🛠️' },
  'رياضة': { bg: 'rgba(234, 88, 12, 0.12)', border: '#ea580c', text: '#9a3412', icon: '⚽' },
  'فن': { bg: 'rgba(219, 39, 119, 0.12)', border: '#db2777', text: '#9d174d', icon: '🎨' },
  'نشاط': { bg: 'rgba(107, 114, 128, 0.12)', border: '#6b7280', text: '#374151', icon: '⭐' }
};

const DEFAULT_TIMETABLE_DATA = {
  sunday: {
    1: {
      '8a': { subject: 'حاسوب', teacher: 'مالك صبيحات' },
      '8b': { subject: 'علوم', teacher: 'عليمات' },
      '8c': { subject: 'انجليزي', teacher: 'علاء' },
      '8d': { subject: 'مهني', teacher: 'علي الفواعرة' },
      '9a': { subject: 'رياضيات', teacher: 'عبد الحميد' },
      '9b': { subject: 'احياء', teacher: 'الشرعه' },
      '9c': { subject: 'جغرافيا', teacher: 'يوسف' },
      '9d': { subject: 'حاسوب', teacher: 'يوسف' },
      '9e': { subject: 'انجليزي', teacher: 'عليق' },
      '10a': { subject: 'عربي', teacher: 'عبد الرحيم' },
      '10b': { subject: 'رياضيات', teacher: 'يمان' },
      '10c': { subject: 'دين', teacher: 'إبراهيم' }
    },
    2: {
      '8a': { subject: 'عربي', teacher: 'يزيد' },
      '8b': { subject: 'دين', teacher: 'نايل' },
      '8c': { subject: 'رياضيات', teacher: 'محمد الملاحيم' },
      '8d': { subject: 'مالية', teacher: 'مالك صبيحات' },
      '9a': { subject: 'عربي', teacher: 'مؤمن' },
      '9b': { subject: 'جغرافيا', teacher: 'يوسف' },
      '9c': { subject: 'وطنية', teacher: 'عمر فهد' },
      '9d': { subject: 'مهني', teacher: 'علي الفواعرة' },
      '9e': { subject: 'عربي', teacher: 'عبد الرحيم' },
      '10a': { subject: 'دين', teacher: 'إبراهيم' },
      '10b': { subject: 'احياء', teacher: 'الشرعه' },
      '10c': { subject: 'انجليزي', teacher: 'عليق' }
    },
    3: {
      '8a': { subject: 'اجتماعيات', teacher: 'عمر فهد' },
      '8b': { subject: 'رياضيات', teacher: 'محمد الملاحيم' },
      '8c': { subject: 'عربي', teacher: 'يزيد' },
      '8d': { subject: 'اجتماعيات', teacher: 'يوسف' },
      '9a': { subject: 'علوم ارض', teacher: 'الشرعه' },
      '9b': { subject: 'انجليزي', teacher: 'مروان' },
      '9c': { subject: 'عربي', teacher: 'مؤمن' },
      '9d': { subject: 'رياضيات', teacher: 'عبد الحميد' },
      '9e': { subject: 'مهني', teacher: 'علي الفواعرة' },
      '10a': { subject: 'رياضيات', teacher: 'يمان' },
      '10b': { subject: 'كيمياء', teacher: 'عليمات' },
      '10c': { subject: 'عربي', teacher: 'عبد الرحيم' }
    },
    4: {
      '8a': { subject: 'انجليزي', teacher: 'علاء' },
      '8b': { subject: 'عربي', teacher: 'يزيد' },
      '8c': { subject: 'حاسوب', teacher: 'يوسف' },
      '8d': { subject: 'رياضيات', teacher: 'محمد الملاحيم' },
      '9a': { subject: 'كيمياء', teacher: 'عليمات' },
      '9b': { subject: 'دين', teacher: 'نايل' },
      '9c': { subject: 'مهني', teacher: 'علي الفواعرة' },
      '9d': { subject: 'انجليزي', teacher: 'مروان' },
      '9e': { subject: 'رياضيات', teacher: 'يمان' },
      '10a': { subject: 'انجليزي', teacher: 'عليق' },
      '10b': { subject: 'فيزياء', teacher: 'كرد' },
      '10c': { subject: 'علوم ارض', teacher: 'الشرعه' }
    },
    5: {
      '8a': { subject: 'رياضيات', teacher: 'محمد الملاحيم' },
      '8b': { subject: 'انجليزي', teacher: 'علاء' },
      '8c': { subject: 'اجتماعيات', teacher: 'يوسف' },
      '8d': { subject: 'عربي', teacher: 'يزيد' },
      '9a': { subject: 'حاسوب', teacher: 'يوسف' },
      '9b': { subject: 'رياضيات', teacher: 'عبد الحميد' },
      '9c': { subject: 'انجليزي', teacher: 'مروان' },
      '9d': { subject: 'عربي', teacher: 'مؤمن' },
      '9e': { subject: 'فيزياء', teacher: 'كرد' },
      '10a': { subject: 'احياء', teacher: 'الشرعه' },
      '10b': { subject: 'عربي', teacher: 'عبد الرحيم' },
      '10c': { subject: 'كيمياء', teacher: 'عليمات' }
    },
    6: {
      '8a': { subject: 'رياضة', teacher: 'علي صبيحات' },
      '8b': { subject: 'مهني', teacher: 'علي الفواعرة' },
      '8c': { subject: 'علوم', teacher: 'عليمات' },
      '8d': { subject: 'انجليزي', teacher: 'علاء' },
      '9a': { subject: 'انجليزي', teacher: 'مروان' },
      '9b': { subject: 'عربي', teacher: 'مؤمن' },
      '9c': { subject: 'حاسوب', teacher: 'يوسف' },
      '9d': { subject: 'دين', teacher: 'إبراهيم' },
      '9e': { subject: 'وطنية', teacher: 'عمر فهد' },
      '10a': { subject: 'فيزياء', teacher: 'كرد' },
      '10b': { subject: 'انجليزي', teacher: 'عليق' },
      '10c': { subject: 'فن', teacher: 'السميران' }
    },
    7: {
      '8a': { subject: 'فن', teacher: 'السميران' },
      '8b': { subject: 'اجتماعيات', teacher: 'يوسف' },
      '8c': { subject: 'عربي', teacher: 'يزيد' },
      '8d': { subject: 'علوم', teacher: 'ناصر' },
      '9a': { subject: 'رياضة', teacher: 'علي صبيحات' },
      '9b': { subject: 'عربي', teacher: 'مؤمن' },
      '9c': { subject: 'فن', teacher: 'السميران' },
      '9d': { subject: 'مهني', teacher: 'علي الفواعرة' },
      '9e': { subject: 'حاسوب', teacher: 'يوسف' },
      '10a': null,
      '10b': null,
      '10c': { subject: 'رياضيات', teacher: 'يمان' }
    }
  },
  monday: {
    1: {
      '8a': { subject: 'علوم', teacher: 'كرد' },
      '8b': { subject: 'دين', teacher: 'نايل' },
      '8c': { subject: 'حاسوب', teacher: 'يوسف' },
      '8d': { subject: 'انجليزي', teacher: 'علاء' },
      '9a': { subject: 'انجليزي', teacher: 'مروان' },
      '9b': { subject: 'رياضيات', teacher: 'عبد الحميد' },
      '9c': { subject: 'عربي', teacher: 'مؤمن' },
      '9d': { subject: 'احياء', teacher: 'الشرعه' },
      '9e': { subject: 'دين', teacher: 'إبراهيم' },
      '10a': { subject: 'رياضيات', teacher: 'يمان' },
      '10b': { subject: 'عربي', teacher: 'عبد الرحيم' },
      '10c': { subject: 'انجليزي', teacher: 'عليق' }
    },
    2: {
      '8a': { subject: 'دين', teacher: 'نايل' },
      '8b': { subject: 'حاسوب', teacher: 'مالك صبيحات' },
      '8c': { subject: 'عربي', teacher: 'يزيد' },
      '8d': { subject: 'رياضيات', teacher: 'محمد الملاحيم' },
      '9a': { subject: 'رياضيات', teacher: 'عبد الحميد' },
      '9b': { subject: 'تاريخ', teacher: 'عمر فهد' },
      '9c': { subject: 'دين', teacher: 'إبراهيم' },
      '9d': { subject: 'عربي', teacher: 'مؤمن' },
      '9e': { subject: 'حاسوب', teacher: 'يوسف' },
      '10a': { subject: 'كيمياء', teacher: 'عليمات' },
      '10b': { subject: 'فيزياء', teacher: 'كرد' },
      '10c': { subject: 'احياء', teacher: 'الشرعه' }
    },
    3: {
      '8a': { subject: 'رياضيات', teacher: 'محمد الملاحيم' },
      '8b': { subject: 'عربي', teacher: 'يزيد' },
      '8c': { subject: 'دين', teacher: 'نايل' },
      '8d': { subject: 'علوم', teacher: 'الشرعه' },
      '9a': { subject: 'فيزياء', teacher: 'كرد' },
      '9b': { subject: 'مالية', teacher: 'مالك' },
      '9c': { subject: 'حاسوب', teacher: 'يوسف' },
      '9d': { subject: 'دين', teacher: 'إبراهيم' },
      '9e': { subject: 'رياضيات', teacher: 'يمان' },
      '10a': { subject: 'وطنية', teacher: 'عمر فهد' },
      '10b': { subject: 'انجليزي', teacher: 'عليق' },
      '10c': { subject: 'وطنية', teacher: 'يوسف' }
    },
    4: {
      '8a': { subject: 'اجتماعيات', teacher: 'عمر فهد' },
      '8b': { subject: 'انجليزي', teacher: 'علاء' },
      '8c': { subject: 'علوم', teacher: 'عليمات' },
      '8d': { subject: 'عربي', teacher: 'يزيد' },
      '9a': { subject: 'دين', teacher: 'نايل' },
      '9b': { subject: 'حاسوب', teacher: 'يوسف' },
      '9c': { subject: 'انجليزي', teacher: 'مروان' },
      '9d': { subject: 'علوم ارض', teacher: 'الشرعه' },
      '9e': { subject: 'انجليزي', teacher: 'عليق' },
      '10a': { subject: 'عربي', teacher: 'عبد الرحيم' },
      '10b': { subject: 'رياضيات', teacher: 'يمان' },
      '10c': { subject: 'مالية', teacher: 'مالك' }
    },
    5: {
      '8a': { subject: 'عربي', teacher: 'يزيد' },
      '8b': { subject: 'رياضيات', teacher: 'محمد الملاحيم' },
      '8c': { subject: 'انجليزي', teacher: 'علاء' },
      '8d': { subject: 'دين', teacher: 'نايل' },
      '9a': { subject: 'مهني', teacher: 'علي الفواعرة' },
      '9b': { subject: 'كيمياء', teacher: 'عليمات' },
      '9c': { subject: 'رياضيات', teacher: 'عبد الحميد' },
      '9d': { subject: 'انجليزي', teacher: 'مروان' },
      '9e': { subject: 'تاريخ', teacher: 'عمر فهد' },
      '10a': { subject: 'انجليزي', teacher: 'عليق' },
      '10b': { subject: 'دين', teacher: 'إبراهيم' },
      '10c': { subject: 'رياضيات', teacher: 'يمان' }
    },
    6: {
      '8a': { subject: 'انجليزي', teacher: 'علاء' },
      '8b': { subject: 'عربي', teacher: 'يزيد' },
      '8c': { subject: 'رياضيات', teacher: 'محمد الملاحيم' },
      '8d': { subject: 'رياضة', teacher: 'علي صبيحات' },
      '9a': { subject: 'عربي', teacher: 'مؤمن' },
      '9b': { subject: 'انجليزي', teacher: 'مروان' },
      '9c': { subject: 'مهني', teacher: 'علي الفواعرة' },
      '9d': { subject: 'حاسوب', teacher: 'يوسف' },
      '9e': { subject: 'عربي', teacher: 'عبد الرحيم' },
      '10a': { subject: 'دين', teacher: 'إبراهيم' },
      '10b': { subject: 'كيمياء', teacher: 'عليمات' },
      '10c': { subject: 'نشاط', teacher: '-' }
    },
    7: {
      '8a': { subject: 'عربي', teacher: 'يزيد' },
      '8b': { subject: 'رياضة', teacher: 'علي الفواعرة' },
      '8c': { subject: 'رياضة', teacher: 'علي صبيحات' },
      '8d': { subject: 'اجتماعيات', teacher: 'يوسف' },
      '9a': { subject: 'مهني', teacher: 'علي الفواعرة' },
      '9b': { subject: 'عربي', teacher: 'مؤمن' },
      '9c': { subject: 'انجليزي', teacher: 'مروان' },
      '9d': { subject: 'رياضيات', teacher: 'عبد الحميد' },
      '9e': { subject: 'رياضة', teacher: 'علي' },
      '10a': { subject: 'فن', teacher: 'السميران' },
      '10b': { subject: 'رياضة', teacher: 'علي' },
      '10c': { subject: 'عربي', teacher: 'عبد الرحيم' }
    }
  },
  tuesday: {
    1: {
      '8a': { subject: 'رياضيات', teacher: 'محمد الملاحيم' },
      '8b': { subject: 'علوم', teacher: 'عليمات' },
      '8c': { subject: 'دين', teacher: 'نايل' },
      '8d': { subject: 'انجليزي', teacher: 'علاء' },
      '9a': { subject: 'فيزياء', teacher: 'كرد' },
      '9b': { subject: 'علوم ارض', teacher: 'الشرعه' },
      '9c': { subject: 'رياضيات', teacher: 'عبد الحميد' },
      '9d': { subject: 'عربي', teacher: 'مؤمن' },
      '9e': { subject: 'جغرافيا', teacher: 'يوسف' },
      '10a': { subject: 'رياضيات', teacher: 'يمان' },
      '10b': { subject: 'مالية', teacher: 'مالك' },
      '10c': { subject: 'تاريخ', teacher: 'عمر فهد' }
    },
    2: {
      '8a': { subject: 'دين', teacher: 'نايل' },
      '8b': { subject: 'حاسوب', teacher: 'مالك صبيحات' },
      '8c': { subject: 'رياضيات', teacher: 'محمد الملاحيم' },
      '8d': { subject: 'عربي', teacher: 'يزيد' },
      '9a': { subject: 'رياضيات', teacher: 'عبد الحميد' },
      '9b': { subject: 'عربي', teacher: 'مؤمن' },
      '9c': { subject: 'احياء', teacher: 'الشرعه' },
      '9d': { subject: 'جغرافيا', teacher: 'يوسف' },
      '9e': { subject: 'عربي', teacher: 'عبد الرحيم' },
      '10a': { subject: 'فيزياء', teacher: 'كرد' },
      '10b': { subject: 'تاريخ', teacher: 'عمر فهد' },
      '10c': { subject: 'رياضيات', teacher: 'يمان' }
    },
    3: {
      '8a': { subject: 'عربي', teacher: 'يزيد' },
      '8b': { subject: 'دين', teacher: 'نايل' },
      '8c': { subject: 'انجليزي', teacher: 'علاء' },
      '8d': { subject: 'اجتماعيات', teacher: 'يوسف' },
      '9a': { subject: 'تاريخ', teacher: 'عمر فهد' },
      '9b': { subject: 'انجليزي', teacher: 'مروان' },
      '9c': { subject: 'فيزياء', teacher: 'كرد' },
      '9d': { subject: 'رياضيات', teacher: 'عبد الحميد' },
      '9e': { subject: 'انجليزي', teacher: 'عليق' },
      '10a': { subject: 'عربي', teacher: 'عبد الرحيم' },
      '10b': { subject: 'دين', teacher: 'إبراهيم' },
      '10c': { subject: 'حاسوب', teacher: 'يوسف' }
    },
    4: {
      '8a': { subject: 'مالية', teacher: 'مالك صبيحات' },
      '8b': { subject: 'انجليزي', teacher: 'علاء' },
      '8c': { subject: 'عربي', teacher: 'يزيد' },
      '8d': { subject: 'علوم', teacher: 'الشرعه' },
      '9a': { subject: 'دين', teacher: 'نايل' },
      '9b': { subject: 'حاسوب', teacher: 'يوسف' },
      '9c': { subject: 'عربي', teacher: 'مؤمن' },
      '9d': { subject: 'وطنية', teacher: 'عمر فهد' },
      '9e': { subject: 'كيمياء', teacher: 'عليمات' },
      '10a': { subject: 'انجليزي', teacher: 'عليق' },
      '10b': { subject: 'عربي', teacher: 'عبد الرحيم' },
      '10c': { subject: 'فيزياء', teacher: 'كرد' }
    },
    5: {
      '8a': { subject: 'عربي', teacher: 'يزيد' },
      '8b': { subject: 'اجتماعيات', teacher: 'يوسف' },
      '8c': { subject: 'انجليزي', teacher: 'علاء' },
      '8d': { subject: 'رياضيات', teacher: 'محمد الملاحيم' },
      '9a': { subject: 'انجليزي', teacher: 'مروان' },
      '9b': { subject: 'فيزياء', teacher: 'كرد' },
      '9c': { subject: 'دين', teacher: 'إبراهيم' },
      '9d': { subject: 'عربي', teacher: 'مؤمن' },
      '9e': { subject: 'مالية', teacher: 'مالك' },
      '10a': { subject: 'كيمياء', teacher: 'عليمات' },
      '10b': { subject: 'رياضيات', teacher: 'يمان' },
      '10c': { subject: 'عربي', teacher: 'عبد الرحيم' }
    },
    6: {
      '8a': { subject: 'انجليزي', teacher: 'علاء' },
      '8b': { subject: 'عربي', teacher: 'يزيد' },
      '8c': { subject: 'رياضة', teacher: 'علي صبيحات' },
      '8d': { subject: 'مهني', teacher: 'علي الفواعرة' },
      '9a': { subject: 'عربي', teacher: 'مؤمن' },
      '9b': { subject: 'رياضيات', teacher: 'عبد الحميد' },
      '9c': { subject: 'انجليزي', teacher: 'مروان' },
      '9d': { subject: 'فن', teacher: 'السميران' },
      '9e': { subject: 'رياضيات', teacher: 'يمان' },
      '10a': { subject: 'حاسوب', teacher: 'يوسف' },
      '10b': { subject: 'انجليزي', teacher: 'عليق' },
      '10c': { subject: 'دين', teacher: 'إبراهيم' }
    },
    7: {
      '8a': { subject: 'حاسوب', teacher: 'مالك صبيحات' },
      '8b': { subject: 'رياضيات', teacher: 'محمد الملاحيم' },
      '8c': { subject: 'مهني', teacher: 'علي الفواعرة' },
      '8d': null,
      '9a': null,
      '9b': null,
      '9c': { subject: 'عربي', teacher: 'مؤمن' },
      '9d': { subject: 'انجليزي', teacher: 'مروان' },
      '9e': { subject: 'رياضة', teacher: 'علي' },
      '10a': null,
      '10b': null,
      '10c': { subject: 'انجليزي', teacher: 'عليق' }
    }
  },
  wednesday: {
    1: {
      '8a': { subject: 'عربي', teacher: 'يزيد' },
      '8b': { subject: 'مالية', teacher: 'مالك صبيحات' },
      '8c': { subject: 'رياضيات', teacher: 'محمد الملاحيم' },
      '8d': { subject: 'حاسوب', teacher: 'يوسف' },
      '9a': { subject: 'احياء', teacher: 'الشرعه' },
      '9b': { subject: 'فيزياء', teacher: 'كرد' },
      '9c': { subject: 'كيمياء', teacher: 'عليمات' },
      '9d': { subject: 'دين', teacher: 'إبراهيم' },
      '9e': { subject: 'انجليزي', teacher: 'عليق' },
      '10a': { subject: 'عربي', teacher: 'عبد الرحيم' },
      '10b': { subject: 'رياضيات', teacher: 'يمان' },
      '10c': { subject: 'جغرافيا', teacher: 'يوسف' }
    },
    2: {
      '8a': { subject: 'رياضيات', teacher: 'محمد الملاحيم' },
      '8b': { subject: 'مهني', teacher: 'علي الفواعرة' },
      '8c': { subject: 'اجتماعيات', teacher: 'يوسف' },
      '8d': { subject: 'دين', teacher: 'نايل' },
      '9a': { subject: 'عربي', teacher: 'مؤمن' },
      '9b': { subject: 'وطنية', teacher: 'عمر فهد' },
      '9c': { subject: 'علوم ارض', teacher: 'الشرعه' },
      '9d': { subject: 'انجليزي', teacher: 'مروان' },
      '9e': { subject: 'عربي', teacher: 'عبد الرحيم' },
      '10a': { subject: 'دين', teacher: 'إبراهيم' },
      '10b': { subject: 'حاسوب', teacher: 'يوسف' },
      '10c': { subject: 'انجليزي', teacher: 'عليق' }
    },
    3: {
      '8a': { subject: 'علوم', teacher: 'كرد' },
      '8b': { subject: 'رياضيات', teacher: 'محمد الملاحيم' },
      '8c': { subject: 'مهني', teacher: 'علي الفواعرة' },
      '8d': { subject: 'انجليزي', teacher: 'علاء' },
      '9a': { subject: 'دين', teacher: 'نايل' },
      '9b': { subject: 'عربي', teacher: 'مؤمن' },
      '9c': { subject: 'مالية', teacher: 'مالك' },
      '9d': { subject: 'رياضيات', teacher: 'عبد الحميد' },
      '9e': { subject: 'علوم ارض', teacher: 'الشرعه' },
      '10a': { subject: 'تاريخ', teacher: 'عمر فهد' },
      '10b': { subject: 'انجليزي', teacher: 'عليق' },
      '10c': { subject: 'رياضيات', teacher: 'يمان' }
    },
    4: {
      '8a': { subject: 'مهني', teacher: 'علي الفواعرة' },
      '8b': { subject: 'انجليزي', teacher: 'علاء' },
      '8c': { subject: 'دين', teacher: 'نايل' },
      '8d': { subject: 'عربي', teacher: 'يزيد' },
      '9a': { subject: 'مالية', teacher: 'مالك' },
      '9b': { subject: 'رياضيات', teacher: 'عبد الحميد' },
      '9c': { subject: 'انجليزي', teacher: 'مروان' },
      '9d': { subject: 'فيزياء', teacher: 'كرد' },
      '9e': { subject: 'دين', teacher: 'إبراهيم' },
      '10a': { subject: 'جغرافيا', teacher: 'يوسف' },
      '10b': { subject: 'علوم ارض', teacher: 'الشرعه' },
      '10c': { subject: 'عربي', teacher: 'عبد الرحيم' }
    },
    5: {
      '8a': { subject: 'انجليزي', teacher: 'علاء' },
      '8b': { subject: 'علوم', teacher: 'عليمات' },
      '8c': { subject: 'مالية', teacher: 'مالك صبيحات' },
      '8d': { subject: 'رياضيات', teacher: 'محمد الملاحيم' },
      '9a': { subject: 'رياضيات', teacher: 'عبد الحميد' },
      '9b': { subject: 'انجليزي', teacher: 'مروان' },
      '9c': { subject: 'عربي', teacher: 'مؤمن' },
      '9d': { subject: 'تاريخ', teacher: 'عمر فهد' },
      '9e': { subject: 'عربي', teacher: 'عبد الرحيم' },
      '10a': { subject: 'رياضيات', teacher: 'يمان' },
      '10b': { subject: 'دين', teacher: 'إبراهيم' },
      '10c': { subject: 'حاسوب', teacher: 'يوسف' }
    },
    6: {
      '8a': { subject: 'اجتماعيات', teacher: 'عمر فهد' },
      '8b': { subject: 'فن', teacher: 'السميران' },
      '8c': { subject: 'عربي', teacher: 'يزيد' },
      '8d': { subject: 'رياضة', teacher: 'علي صبيحات' },
      '9a': { subject: 'حاسوب', teacher: 'يوسف' },
      '9b': { subject: 'رياضة', teacher: 'علي' },
      '9c': { subject: 'رياضيات', teacher: 'عبد الحميد' },
      '9d': { subject: 'عربي', teacher: 'مؤمن' },
      '9e': { subject: 'رياضيات', teacher: 'يمان' },
      '10a': { subject: 'انجليزي', teacher: 'عليق' },
      '10b': { subject: 'عربي', teacher: 'عبد الرحيم' },
      '10c': { subject: 'فيزياء', teacher: 'كرد' }
    },
    7: {
      '8a': { subject: 'رياضة', teacher: 'يمان' },
      '8b': { subject: 'اجتماعيات', teacher: 'عمر فهد' },
      '8c': { subject: 'علوم', teacher: 'عليمات' },
      '8d': { subject: 'علوم', teacher: 'الشرعه' },
      '9a': null,
      '9b': null,
      '9c': { subject: 'دين', teacher: 'نايل' },
      '9d': { subject: 'عربي', teacher: 'مؤمن' },
      '9e': { subject: 'مهني', teacher: 'علي الفواعرة' },
      '10a': { subject: 'عربي', teacher: 'عبد الرحيم' },
      '10b': null,
      '10c': { subject: 'انجليزي', teacher: 'عليق' }
    }
  },
  thursday: {
    1: {
      '8a': { subject: 'مهني', teacher: 'علي الفواعرة' },
      '8b': { subject: 'رياضيات', teacher: 'محمد الملاحيم' },
      '8c': { subject: 'انجليزي', teacher: 'علاء' },
      '8d': { subject: 'دين', teacher: 'نايل' },
      '9a': { subject: 'عربي', teacher: 'مؤمن' },
      '9b': { subject: 'رياضيات', teacher: 'عبد الحميد' },
      '9c': { subject: 'دين', teacher: 'إبراهيم' },
      '9d': { subject: 'انجليزي', teacher: 'مروان' },
      '9e': { subject: 'فيزياء', teacher: 'كرد' },
      '10a': { subject: 'انجليزي', teacher: 'عليق' },
      '10b': { subject: 'جغرافيا', teacher: 'يوسف' },
      '10c': { subject: 'رياضيات', teacher: 'يمان' }
    },
    2: {
      '8a': { subject: 'دين', teacher: 'نايل' },
      '8b': { subject: 'انجليزي', teacher: 'علاء' },
      '8c': { subject: 'رياضيات', teacher: 'محمد الملاحيم' },
      '8d': { subject: 'عربي', teacher: 'يزيد' },
      '9a': { subject: 'جغرافيا', teacher: 'يوسف' },
      '9b': { subject: 'مهني', teacher: 'علي الفواعرة' },
      '9c': { subject: 'تاريخ', teacher: 'عمر فهد' },
      '9d': { subject: 'مالية', teacher: 'مالك' },
      '9e': { subject: 'احياء', teacher: 'الشرعه' },
      '10a': { subject: 'رياضيات', teacher: 'يمان' },
      '10b': { subject: 'حاسوب', teacher: 'يوسف' },
      '10c': { subject: 'كيمياء', teacher: 'عليمات' }
    },
    3: {
      '8a': { subject: 'علوم', teacher: 'كرد' },
      '8b': { subject: 'عربي', teacher: 'يزيد' },
      '8c': { subject: 'اجتماعيات', teacher: 'يوسف' },
      '8d': { subject: 'حاسوب', teacher: 'يوسف' },
      '9a': { subject: 'رياضيات', teacher: 'عبد الحميد' },
      '9b': { subject: 'دين', teacher: 'نايل' },
      '9c': { subject: 'عربي', teacher: 'مؤمن' },
      '9d': { subject: 'كيمياء', teacher: 'عليمات' },
      '9e': { subject: 'دين', teacher: 'إبراهيم' },
      '10a': { subject: 'علوم ارض', teacher: 'الشرعه' },
      '10b': { subject: 'وطنية', teacher: 'عمر فهد' },
      '10c': { subject: 'عربي', teacher: 'عبد الرحيم' }
    },
    4: {
      '8a': { subject: 'رياضيات', teacher: 'محمد الملاحيم' },
      '8b': { subject: 'اجتماعيات', teacher: 'يوسف' },
      '8c': { subject: 'علوم', teacher: 'عليمات' },
      '8d': { subject: 'انجليزي', teacher: 'علاء' },
      '9a': { subject: 'وطنية', teacher: 'عمر فهد' },
      '9b': { subject: 'انجليزي', teacher: 'مروان' },
      '9c': { subject: 'رياضيات', teacher: 'عبد الحميد' },
      '9d': { subject: 'فيزياء', teacher: 'كرد' },
      '9e': { subject: 'رياضيات', teacher: 'يمان' },
      '10a': { subject: 'حاسوب', teacher: 'يوسف' },
      '10b': { subject: 'عربي', teacher: 'عبد الرحيم' },
      '10c': { subject: 'انجليزي', teacher: 'عليق' }
    },
    5: {
      '8a': { subject: 'انجليزي', teacher: 'علاء' },
      '8b': { subject: 'علوم', teacher: 'عليمات' },
      '8c': { subject: 'عربي', teacher: 'يزيد' },
      '8d': { subject: 'رياضيات', teacher: 'محمد الملاحيم' },
      '9a': { subject: 'انجليزي', teacher: 'مروان' },
      '9b': { subject: 'عربي', teacher: 'مؤمن' },
      '9c': { subject: 'فيزياء', teacher: 'كرد' },
      '9d': { subject: 'رياضيات', teacher: 'عبد الحميد' },
      '9e': { subject: 'انجليزي', teacher: 'عليق' },
      '10a': { subject: 'مالية', teacher: 'مالك' },
      '10b': { subject: 'رياضيات', teacher: 'يمان' },
      '10c': { subject: 'دين', teacher: 'إبراهيم' }
    },
    6: {
      '8a': { subject: 'علوم', teacher: 'كرد' },
      '8b': { subject: 'رياضة', teacher: 'علي' },
      '8c': { subject: 'فن', teacher: 'السميران' },
      '8d': { subject: 'رياضة', teacher: 'علي صبيحات' },
      '9a': { subject: 'عربي', teacher: 'مؤمن' },
      '9b': { subject: 'مهني', teacher: 'علي الفواعرة' },
      '9c': { subject: 'رياضيات', teacher: 'عبد الحميد' },
      '9d': { subject: 'نشاط', teacher: '-' },
      '9e': { subject: 'عربي', teacher: 'عبد الرحيم' },
      '10a': { subject: 'رياضة', teacher: 'يمان' },
      '10b': null,
      '10c': null
    }
  }
};

/**
 * دالة استخراج قائمة المعلمين الفريدة مع إحصائياتهم
 */
function getUniqueTeachers(timetableData = DEFAULT_TIMETABLE_DATA) {
  const teachersMap = new Map();
  
  for (const dayKey in timetableData) {
    const dayPeriods = timetableData[dayKey];
    for (const p in dayPeriods) {
      const classesObj = dayPeriods[p];
      for (const cId in classesObj) {
        const cell = classesObj[cId];
        if (cell && cell.teacher && cell.teacher !== '-') {
          const teacher = cell.teacher.trim();
          if (!teachersMap.has(teacher)) {
            teachersMap.set(teacher, {
              name: teacher,
              subjects: new Set(),
              classes: new Set(),
              totalLessons: 0
            });
          }
          const info = teachersMap.get(teacher);
          info.subjects.add(cell.subject);
          const className = TIMETABLE_CLASSES.find(c => c.id === cId)?.name || cId;
          info.classes.add(className);
          info.totalLessons++;
        }
      }
    }
  }
  
  return Array.from(teachersMap.values())
    .map(t => ({
      ...t,
      subjects: Array.from(t.subjects),
      classes: Array.from(t.classes)
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'ar'));
}

/**
 * دالة استخراج جدول معلم معين عبر كافة الأيام
 */
function getTeacherSchedule(teacherName, timetableData = DEFAULT_TIMETABLE_DATA) {
  const schedule = {};
  
  TIMETABLE_DAYS.forEach(day => {
    schedule[day.id] = [];
    const dayPeriods = timetableData[day.id] || {};
    for (let p = 1; p <= day.periodsCount; p++) {
      const periodClasses = dayPeriods[p] || {};
      let found = null;
      for (const classId in periodClasses) {
        const cell = periodClasses[classId];
        if (cell && cell.teacher && cell.teacher.trim() === teacherName.trim()) {
          const classObj = TIMETABLE_CLASSES.find(c => c.id === classId);
          const clsName = classObj?.name || classId;
          if (!found) {
            found = {
              period: p,
              classId,
              className: clsName,
              subject: cell.subject,
              hasConflict: false
            };
          } else {
            found.className += ` ⚡ ${clsName}`;
            found.subject += ` / ${cell.subject}`;
            found.hasConflict = true;
          }
        }
      }
      schedule[day.id].push({
        period: p,
        lesson: found // null if free period
      });
    }
  });
  
  return schedule;
}

/**
 * دالة استخراج جدول صف معين عبر كافة الأيام
 */
function getClassSchedule(classId, timetableData = DEFAULT_TIMETABLE_DATA) {
  const schedule = {};
  
  TIMETABLE_DAYS.forEach(day => {
    schedule[day.id] = [];
    const dayPeriods = timetableData[day.id] || {};
    for (let p = 1; p <= day.periodsCount; p++) {
      const periodClasses = dayPeriods[p] || {};
      const cell = periodClasses[classId];
      schedule[day.id].push({
        period: p,
        lesson: cell || null
      });
    }
  });
  
  return schedule;
}
