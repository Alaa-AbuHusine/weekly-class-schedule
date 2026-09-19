/**
 * منطق التطبيق الرئيسي - مدرسة مخيم الزعتري الأساسية الثانية للبنين
 * Zattari Second Primary Boys School - Timetable App Logic
 */

// حالة التطبيق (State)
const AppState = {
  currentDay: 'sunday', // 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'all'
  selectedClass: 'all',  // 'all' or classId e.g. '8a'
  selectedTeacher: 'all',// 'all' or teacher name
  searchQuery: '',
  viewMode: 'grid',      // 'grid', 'cards', 'teacher'
  theme: localStorage.getItem('zattari_theme') || 'light',
  timetableData: null,
  editingCell: null // { day, period, classId }
};

// إصدار البيانات لضمان تحديث الذاكرة المحلية تلقائياً عند تغيير الملفات
const CURRENT_DATA_VERSION = '2025_2026_v4';

// تهيئة البيانات من التخزين المحلي أو من البيانات الافتراضية المعتمدة
function initData() {
  const savedVersion = localStorage.getItem('zattari_data_version');
  const saved = localStorage.getItem('zattari_timetable_data');

  if (saved && savedVersion === CURRENT_DATA_VERSION) {
    try {
      AppState.timetableData = JSON.parse(saved);
      return;
    } catch (e) {
      console.error('فشل استعادة البيانات المحفوظة، سيتم استخدام البيانات المعتمدة', e);
    }
  }

  // تحديث تلقائي للبيانات المعتمدة الجديدة
  AppState.timetableData = JSON.parse(JSON.stringify(DEFAULT_TIMETABLE_DATA));
  localStorage.setItem('zattari_timetable_data', JSON.stringify(AppState.timetableData));
  localStorage.setItem('zattari_data_version', CURRENT_DATA_VERSION);
}

// حفظ البيانات في التخزين المحلي وحفظها على القرص مباشرة
function persistData() {
  localStorage.setItem('zattari_timetable_data', JSON.stringify(AppState.timetableData));
  localStorage.setItem('zattari_data_version', CURRENT_DATA_VERSION);
  saveToServer(AppState.timetableData);
}

// حفظ مباشر في ملف المشروع على القرص عند تشغيل الخادم المحلي
function saveToServer(data) {
  fetch('/api/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => {
    if (res.ok) console.log('تم حفظ التعديل مباشرة على ملفات المشروع في القرص الصلب.');
  }).catch(() => {
    // في حال العمل بصفحة عادية بدون خادم محلي
  });
}

// تصدير نسخة احتياطية من الجدول
function exportTimetableData() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(AppState.timetableData, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "جدول_مدرسة_الزعتري_المعدل.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast('تم تصدير وحفظ نسخة الجدول بنجاح!');
}

// استعادة الجدول الأصلي
function resetToDefaultData() {
  if (confirm('هل أنت متأكد من رغبتك في استعادة الجدول الأساسي المعتمد؟')) {
    AppState.timetableData = JSON.parse(JSON.stringify(DEFAULT_TIMETABLE_DATA));
    persistData();
    populateTeacherFilter();
    updateConflictStatus();
    renderApp();
    showToast('تمت استعادة الجدول الأساسي بنجاح!');
  }
}

// تحديد اليوم الحالي تلقائياً
function detectRealCurrentDay() {
  const dayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday, ..., 4 = Thursday
  const dayMap = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday'
  };
  return dayMap[dayIndex] || 'sunday';
}

// إعداد فلاتر المعلمين والصفوف في القوائم المنسدلة
function populateFilters() {
  // ملء فلتر الصفوف
  const classSelect = document.getElementById('classFilterSelect');
  if (classSelect) {
    classSelect.innerHTML = '<option value="all">جميع الصفوف والشعب</option>';
    TIMETABLE_CLASSES.forEach(cls => {
      const opt = document.createElement('option');
      opt.value = cls.id;
      opt.textContent = cls.name;
      classSelect.appendChild(opt);
    });
  }

  // ملء فلتر المعلمين
  populateTeacherFilter();
}

function populateTeacherFilter() {
  const teacherSelect = document.getElementById('teacherFilterSelect');
  if (!teacherSelect) return;

  const currentVal = teacherSelect.value;
  teacherSelect.innerHTML = '<option value="all">جميع المعلمين</option>';
  
  const teachers = getUniqueTeachers(AppState.timetableData);
  teachers.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.name;
    opt.textContent = `${t.name} (${t.totalLessons} حصة)`;
    teacherSelect.appendChild(opt);
  });

  if (currentVal && Array.from(teacherSelect.options).some(o => o.value === currentVal)) {
    teacherSelect.value = currentVal;
  }
}

// رسم تبويبات الأيام
function renderDayTabs() {
  const tabsContainer = document.getElementById('dayTabs');
  if (!tabsContainer) return;

  const realToday = detectRealCurrentDay();

  let html = '';
  TIMETABLE_DAYS.forEach(day => {
    const isActive = AppState.currentDay === day.id;
    const isToday = realToday === day.id;

    html += `
      <li class="day-tab-item">
        <button class="day-tab-btn ${isActive ? 'active' : ''}" onclick="selectDay('${day.id}')">
          ${isToday ? '<span class="today-indicator">اليوم</span>' : ''}
          <span class="day-tab-name">
            <span>📅</span> ${day.name}
          </span>
          <span class="day-tab-badge">${day.periodsCount} حصص</span>
        </button>
      </li>
    `;
  });

  // إضافة تبويب الجدول الأسبوعي الكامل
  const isAllActive = AppState.currentDay === 'all';
  html += `
    <li class="day-tab-item">
      <button class="day-tab-btn ${isAllActive ? 'active' : ''}" onclick="selectDay('all')">
        <span class="day-tab-name">
          <span>📑</span> الجدول الأسبوعي الكامل
        </span>
        <span class="day-tab-badge">5 أيام</span>
      </button>
    </li>
  `;

  tabsContainer.innerHTML = html;
}

// اختيار اليوم
function selectDay(dayId) {
  AppState.currentDay = dayId;
  renderDayTabs();
  renderApp();
}

// الحصول على فصول مصفاة
function getVisibleClasses() {
  if (AppState.selectedClass === 'all') {
    return TIMETABLE_CLASSES;
  }
  return TIMETABLE_CLASSES.filter(c => c.id === AppState.selectedClass);
}

// رسم الجدول الرئيسي (Grid View)
function renderTimetableGrid() {
  const container = document.getElementById('timetableContainer');
  if (!container) return;

  const visibleClasses = getVisibleClasses();
  const isTeacherView = AppState.selectedTeacher !== 'all';

  if (AppState.currentDay === 'all') {
    renderWeeklyFullTable(container, visibleClasses);
    return;
  }

  const dayInfo = TIMETABLE_DAYS.find(d => d.id === AppState.currentDay) || TIMETABLE_DAYS[0];
  const dayPeriods = AppState.timetableData[AppState.currentDay] || {};

  // تحديث نصوص الترويسة
  updateHeaderBanners(dayInfo.name, `${dayInfo.periodsCount} حصص`);

  let tableHtml = `
    <div class="timetable-wrapper">
      <div class="table-scroll-container">
        <table class="timetable-grid" id="mainTimetableTable">
          <thead>
            <tr>
              <th class="col-period">الحصة / الوقت</th>
  `;

  // أعمدة الفصول (من اليمين لليسار حسب الترتيب المعتمد في الأردن)
  visibleClasses.forEach(cls => {
    tableHtml += `<th>${cls.name}</th>`;
  });

  tableHtml += `
            </tr>
          </thead>
          <tbody>
  `;

  // صفوف الحصص (1 إلى 7 أو 6)
  for (let p = 1; p <= dayInfo.periodsCount; p++) {
    const periodTimeInfo = PERIOD_TIMES.find(pt => pt.period === p)?.time || '';
    const periodLessons = dayPeriods[p] || {};

    tableHtml += `
      <tr>
        <td class="period-badge-cell">
          <span class="period-num">الحصة ${p}</span>
          <span class="period-time">${periodTimeInfo}</span>
        </td>
    `;

    visibleClasses.forEach(cls => {
      const lesson = periodLessons[cls.id];
      tableHtml += `<td>${renderLessonCell(lesson, AppState.currentDay, p, cls.id)}</td>`;
    });

    tableHtml += `</tr>`;
  }

  tableHtml += `
          </tbody>
        </table>
      </div>
    </div>
  `;

  container.innerHTML = tableHtml;
}

// ==========================================================================
// نظام كشف التعارضات في الحصص والمعلمين (Conflict Detection Engine)
// ==========================================================================

/**
 * كشف كافة التعارضات وتضارب المعلمين في نفس الحصة
 */
function detectConflicts(timetableData = AppState.timetableData) {
  const conflicts = [];
  if (!timetableData) return conflicts;

  TIMETABLE_DAYS.forEach(day => {
    const dayPeriods = timetableData[day.id] || {};
    for (let p = 1; p <= day.periodsCount; p++) {
      const periodData = dayPeriods[p] || {};
      const teacherMap = {};

      for (const classId in periodData) {
        const cell = periodData[classId];
        if (cell && cell.teacher && cell.teacher.trim() && cell.teacher.trim() !== '-') {
          const tName = cell.teacher.trim();
          if (!teacherMap[tName]) teacherMap[tName] = [];
          const classObj = TIMETABLE_CLASSES.find(c => c.id === classId);
          teacherMap[tName].push({
            classId,
            className: classObj ? classObj.name : classId,
            subject: cell.subject || 'مادة'
          });
        }
      }

      for (const tName in teacherMap) {
        if (teacherMap[tName].length > 1) {
          conflicts.push({
            dayId: day.id,
            dayName: day.name,
            period: p,
            teacher: tName,
            assignments: teacherMap[tName]
          });
        }
      }
    }
  });

  return conflicts;
}

/**
 * التحقق مما إذا كانت حصة معينة تحتوي على تعارض
 */
function getCellConflict(dayId, periodNum, classId, conflictsList) {
  if (!conflictsList || conflictsList.length === 0) return null;
  return conflictsList.find(c =>
    c.dayId === dayId &&
    c.period === periodNum &&
    c.assignments.some(a => a.classId === classId)
  );
}

/**
 * تحديث شارة وحالة التعارضات في الواجهة
 */
function updateConflictStatus() {
  const btn = document.getElementById('conflictBtn');
  const icon = document.getElementById('conflictIcon');
  const text = document.getElementById('conflictStatusText');
  if (!btn || !text) return;

  const conflicts = detectConflicts(AppState.timetableData);

  if (conflicts.length > 0) {
    btn.className = 'btn-conflict-check has-conflicts';
    if (icon) icon.textContent = '⚠️';
    text.textContent = `يوجد ${conflicts.length} تعارض في الحصص`;
    btn.title = `انقر لعرض وحل التعارضات (${conflicts.length} تعارض)`;
  } else {
    btn.className = 'btn-conflict-check no-conflicts';
    if (icon) icon.textContent = '✅';
    text.textContent = 'لا توجد تعارضات';
    btn.title = 'الجدول خالي من أي تعارضات بين المعلمين';
  }
}

// رسم خلية الحصة مع تمييز التعارض إن وجد
function renderLessonCell(lesson, dayId, periodNum, classId) {
  const allConflicts = detectConflicts(AppState.timetableData);
  const conflict = getCellConflict(dayId, periodNum, classId, allConflicts);

  if (!lesson || !lesson.subject || lesson.subject === '-') {
    return `
      <div class="lesson-card empty-lesson" onclick="openEditModal('${dayId}', ${periodNum}, '${classId}')" title="فراغ - انقر للتعديل">
        <span>فراغ</span>
      </div>
    `;
  }

  const subject = lesson.subject.trim();
  const teacher = (lesson.teacher || '').trim();
  const colorConfig = SUBJECT_COLORS[subject] || {
    bg: 'rgba(100, 116, 139, 0.1)',
    border: '#94a3b8',
    text: '#334155',
    icon: '📚'
  };

  // فحص مطابقة البحث والفلترة
  const query = AppState.searchQuery.trim().toLowerCase();
  const isMatchSearch = query && (
    subject.toLowerCase().includes(query) ||
    teacher.toLowerCase().includes(query)
  );

  const isMatchTeacher = AppState.selectedTeacher === 'all' || teacher === AppState.selectedTeacher;
  const isDimmed = !isMatchTeacher || (query && !isMatchSearch);

  const styleAttr = `
    background-color: ${colorConfig.bg};
    border-color: ${colorConfig.border};
    color: ${colorConfig.text};
    ${isDimmed ? 'opacity: 0.25; filter: grayscale(80%);' : ''}
  `;

  let conflictNotice = '';
  let tooltipText = `انقر لتعديل ${subject} / ${teacher}`;
  let conflictClass = '';

  if (conflict) {
    conflictClass = 'is-conflict';
    const otherClasses = conflict.assignments
      .filter(a => a.classId !== classId)
      .map(a => `${a.className} (${a.subject})`)
      .join(' و ');
    conflictNotice = `<span class="conflict-warning-pill">⚠️ تعارض!</span>`;
    tooltipText = `⚠️ تنبيه تعارض: المعلم (${teacher}) لديه حصة أخرى في نفس الوقت في: ${otherClasses}`;
  }

  return `
    <div class="lesson-card ${isMatchSearch ? 'highlight-match' : ''} ${conflictClass}"
         style="${styleAttr}"
         onclick="openEditModal('${dayId}', ${periodNum}, '${classId}')"
         title="${tooltipText}">
      <div class="subject-name">
        <span class="subject-icon">${colorConfig.icon}</span>
        <span>${subject}</span>
      </div>
      <div class="teacher-name">${teacher || '—'}</div>
      ${conflictNotice}
    </div>
  `;
}

// عرض الجدول الأسبوعي الكامل (All Days)
function renderWeeklyFullTable(container, visibleClasses) {
  updateHeaderBanners('الجدول الأسبوعي العام الكامل', 'شامل لكافة أيام الأسبوع (الأحد - الخميس)');

  let html = '';

  TIMETABLE_DAYS.forEach(day => {
    const dayPeriods = AppState.timetableData[day.id] || {};

    html += `
      <div class="timetable-wrapper" style="margin-bottom: 2.5rem;">
        <div style="background: var(--primary-gradient); color: #fff; padding: 0.75rem 1.25rem; font-weight: 800; font-size: 1.15rem; display: flex; justify-content: space-between; align-items: center;">
          <span>📅 جدول يوم ${day.name} (${day.periodsCount} حصص)</span>
          <button class="btn btn-secondary btn-sm" style="background:#fff; color: var(--primary); padding: 0.3rem 0.8rem; font-size: 0.82rem;" onclick="printSpecificDay('${day.id}')">
            🖨️ طباعة يوم ${day.name}
          </button>
        </div>
        <div class="table-scroll-container">
          <table class="timetable-grid">
            <thead>
              <tr>
                <th class="col-period">الحصة</th>
    `;

    visibleClasses.forEach(cls => {
      html += `<th>${cls.name}</th>`;
    });

    html += `
              </tr>
            </thead>
            <tbody>
    `;

    for (let p = 1; p <= day.periodsCount; p++) {
      const periodLessons = dayPeriods[p] || {};
      html += `
        <tr>
          <td class="period-badge-cell">
            <span class="period-num">الحصة ${p}</span>
          </td>
      `;

      visibleClasses.forEach(cls => {
        const lesson = periodLessons[cls.id];
        html += `<td>${renderLessonCell(lesson, day.id, p, cls.id)}</td>`;
      });

      html += `</tr>`;
    }

    html += `
            </tbody>
          </table>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// رسم بطاقات الفصول (Class Cards View)
function renderClassCards() {
  const container = document.getElementById('timetableContainer');
  if (!container) return;

  const dayInfo = TIMETABLE_DAYS.find(d => d.id === AppState.currentDay) || TIMETABLE_DAYS[0];
  const dayPeriods = AppState.timetableData[AppState.currentDay] || {};
  const visibleClasses = getVisibleClasses();

  updateHeaderBanners(dayInfo.name, `عرض البطاقات - ${dayInfo.periodsCount} حصص`);

  let html = `<div class="class-cards-grid">`;

  visibleClasses.forEach(cls => {
    html += `
      <div class="class-card">
        <div class="class-card-header">
          <h3>الصف ${cls.name}</h3>
          <span style="font-size: 0.8rem; background: rgba(255,255,255,0.25); padding: 2px 8px; border-radius: 99px;">
            ${dayInfo.name}
          </span>
        </div>
        <div class="class-card-body">
          <div class="class-period-list">
    `;

    for (let p = 1; p <= dayInfo.periodsCount; p++) {
      const lesson = (dayPeriods[p] || {})[cls.id];
      const timeInfo = PERIOD_TIMES.find(pt => pt.period === p)?.time || '';
      const subject = lesson?.subject || 'فراغ';
      const teacher = lesson?.teacher || '—';
      const color = SUBJECT_COLORS[subject] || { bg: '#f1f5f9', text: '#334155', border: '#cbd5e1', icon: '📖' };

      html += `
        <div class="class-period-row" onclick="openEditModal('${dayInfo.id}', ${p}, '${cls.id}')" style="cursor: pointer;">
          <div class="class-period-label">
            <strong>الحصة ${p}</strong>
            <span style="font-size: 0.7rem; display: block; color: var(--text-muted);">${timeInfo}</span>
          </div>
          <div class="class-period-detail">
            <span style="background: ${color.bg}; color: ${color.text}; border: 1px solid ${color.border}; padding: 2px 8px; border-radius: 6px; font-weight: 800; font-size: 0.85rem;">
              ${color.icon} ${subject}
            </span>
            <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary);">
              ${teacher}
            </span>
          </div>
        </div>
      `;
    }

    html += `
          </div>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;
}

// رسم جدول المعلم المخصص (Teacher View)
function renderTeacherView() {
  const container = document.getElementById('timetableContainer');
  if (!container) return;

  const teacherName = AppState.selectedTeacher;
  if (teacherName === 'all') {
    renderTimetableGrid();
    return;
  }

  const teacherSchedule = getTeacherSchedule(teacherName, AppState.timetableData);
  const teachersList = getUniqueTeachers(AppState.timetableData);
  const teacherInfo = teachersList.find(t => t.name === teacherName) || {
    name: teacherName,
    subjects: [],
    classes: [],
    totalLessons: 0
  };

  updateHeaderBanners(`جدول المعلم: ${teacherName}`, `إجمالي الحصص: ${teacherInfo.totalLessons} حصة أسبوعياً`);

  let html = `
    <div class="teacher-view-container">
      <div class="teacher-profile-bar">
        <div class="teacher-info">
          <div class="teacher-avatar">👨‍🏫</div>
          <div>
            <h2 style="font-size: 1.4rem; font-weight: 800;">أ. ${teacherName}</h2>
            <p style="color: var(--text-muted); font-size: 0.88rem;">
              المواد: ${teacherInfo.subjects.join('، ') || '—'}
            </p>
          </div>
        </div>
        <div class="teacher-stats">
          <div class="stat-pill">الحصص الأسبوعية: <strong>${teacherInfo.totalLessons} حصة</strong></div>
          <div class="stat-pill">الصفوف: <strong>${teacherInfo.classes.join('، ')}</strong></div>
          <button class="btn btn-print btn-sm" onclick="printTeacherSchedule('${teacherName}')">
            🖨️ طباعة جدول المعلم
          </button>
        </div>
      </div>

      <div class="table-scroll-container">
        <table class="timetable-grid">
          <thead>
            <tr>
              <th class="col-period">اليوم / الحصة</th>
              <th>الحصة 1</th>
              <th>الحصة 2</th>
              <th>الحصة 3</th>
              <th>الحصة 4</th>
              <th>الحصة 5</th>
              <th>الحصة 6</th>
              <th>الحصة 7</th>
            </tr>
          </thead>
          <tbody>
  `;

  TIMETABLE_DAYS.forEach(day => {
    const daySchedule = teacherSchedule[day.id] || [];
    html += `
      <tr>
        <td class="period-badge-cell" style="font-weight: 800;">
          ${day.name}
        </td>
    `;

    for (let p = 1; p <= 7; p++) {
      if (p > day.periodsCount) {
        html += `<td class="period-off-cell">—</td>`;
        continue;
      }

      const item = daySchedule.find(s => s.period === p);
      if (item && item.lesson) {
        const subject = item.lesson.subject;
        const color = SUBJECT_COLORS[subject] || { bg: 'rgba(59, 130, 246, 0.1)', text: '#1d4ed8', border: '#3b82f6', icon: '📚' };
        html += `
          <td>
            <div class="lesson-card" style="background:${color.bg}; border-color:${color.border}; color:${color.text};">
              <span class="subject-name">${color.icon} ${subject}</span>
              <span class="teacher-name teacher-schedule-class" style="font-weight: 800;">${item.lesson.className}</span>
            </div>
          </td>
        `;
      } else {
        html += `
          <td>
            <div class="lesson-card empty-lesson">
              <span style="font-weight: 700;">فراغ</span>
            </div>
          </td>
        `;
      }
    }

    html += `</tr>`;
  });

  html += `
          </tbody>
        </table>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

// تحديث نصوص الترويسة الرئيسية
function updateHeaderBanners(title, subtitle) {
  const titleEl = document.getElementById('currentDayTitle');
  const subtitleEl = document.getElementById('currentDaySubtitle');
  if (titleEl) titleEl.textContent = title;
  if (subtitleEl) subtitleEl.textContent = subtitle;

  // تحديث الترويسة الرسمية الخاصة بالطباعة
  const printDayNameEl = document.getElementById('printDayName');
  if (printDayNameEl) {
    if (AppState.selectedTeacher !== 'all') {
      printDayNameEl.textContent = `جدول المعلم: ${AppState.selectedTeacher}`;
    } else if (AppState.currentDay === 'all') {
      printDayNameEl.textContent = `الجدول الأسبوعي العام الكامل لجميع الصفوف`;
    } else {
      const dayInfo = TIMETABLE_DAYS.find(d => d.id === AppState.currentDay);
      printDayNameEl.textContent = `جدول حصص يوم ${dayInfo ? dayInfo.name : ''}`;
    }
  }

  const printDateEl = document.getElementById('printCurrentDate');
  if (printDateEl) {
    printDateEl.textContent = new Intl.DateTimeFormat('ar-JO', {
      dateStyle: 'full'
    }).format(new Date());
  }
}

// دالة العرض الرئيسية
function renderApp() {
  updateConflictStatus();

  // ضبط ظهور مؤشر التمرير الأفقي حسب نمط العرض
  const swipeHint = document.getElementById('swipeHint');
  if (swipeHint) {
    if (AppState.viewMode === 'cards' || (AppState.selectedClass !== 'all') || (AppState.viewMode === 'teacher' && AppState.selectedTeacher !== 'all')) {
      swipeHint.style.display = 'none';
    } else {
      swipeHint.style.display = '';
    }
  }

  if (AppState.viewMode === 'teacher' && AppState.selectedTeacher !== 'all') {
    renderTeacherView();
  } else if (AppState.viewMode === 'cards') {
    renderClassCards();
  } else {
    renderTimetableGrid();
  }
}

// ==========================================================================
// وظائف الطباعة المخصصة (Print Engine)
// ==========================================================================

/**
 * طباعة جدول اليوم المعروض حالياً بضغطة واحدة!
 * ويلبي تماماً طلب المستخدم: "خيار طباعة مثلا طباعة جدول يوم الاحد مع الحصص تبعاتو"
 */
function printCurrentDay() {
  if (AppState.currentDay === 'all') {
    selectDay('sunday');
  }
  
  const previousViewMode = AppState.viewMode;
  AppState.viewMode = 'grid';
  renderApp();

  const originalTitle = document.title;
  const dayInfo = TIMETABLE_DAYS.find(d => d.id === AppState.currentDay);
  const dayName = dayInfo ? dayInfo.name : 'الدراسي';
  document.title = `جدول حصص يوم ${dayName} - مدرسة مخيم الزعتري الأساسية الثانية للبنين`;

  setTimeout(() => {
    window.print();
    document.title = originalTitle;
    if (previousViewMode !== 'grid') {
      AppState.viewMode = previousViewMode;
      renderApp();
    }
  }, 150);
}

/**
 * طباعة يوم محدد بالاسم
 */
function printSpecificDay(dayId) {
  AppState.currentDay = dayId;
  AppState.viewMode = 'grid';
  renderDayTabs();
  renderApp();
  setTimeout(() => {
    printCurrentDay();
  }, 100);
}

/**
 * طباعة جدول معلم معين
 */
function printTeacherSchedule(teacherName) {
  AppState.selectedTeacher = teacherName;
  AppState.viewMode = 'teacher';
  renderApp();

  const originalTitle = document.title;
  document.title = `جدول المعلم ${teacherName} - مدرسة مخيم الزعتري الأساسية الثانية للبنين`;

  setTimeout(() => {
    window.print();
    document.title = originalTitle;
  }, 150);
}

// فتح نافذة خيارات الطباعة المتقدمة
function openPrintModal() {
  const modal = document.getElementById('printModal');
  if (modal) modal.classList.add('active');
}

function closePrintModal() {
  const modal = document.getElementById('printModal');
  if (modal) modal.classList.remove('active');
}

// ==========================================================================
// نافذة طباعة جدول المعلم بشكل منفصل (Teacher Print Modal)
// ==========================================================================

function openTeacherPrintModal() {
  const select = document.getElementById('teacherPrintSelect');
  if (!select) return;

  select.innerHTML = '';
  const teachers = getUniqueTeachers(AppState.timetableData);

  teachers.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.name;
    opt.textContent = `${t.name} (${t.totalLessons} حصة أسبوعياً)`;
    select.appendChild(opt);
  });

  if (AppState.selectedTeacher !== 'all' && teachers.some(t => t.name === AppState.selectedTeacher)) {
    select.value = AppState.selectedTeacher;
  }

  const selectedVal = select.value || (teachers[0] ? teachers[0].name : '');
  previewTeacherScheduleForPrint(selectedVal);

  const modal = document.getElementById('teacherPrintModal');
  if (modal) modal.classList.add('active');
}

function closeTeacherPrintModal() {
  const modal = document.getElementById('teacherPrintModal');
  if (modal) modal.classList.remove('active');
}

function previewTeacherScheduleForPrint(teacherName) {
  const card = document.getElementById('teacherPrintPreviewCard');
  if (!card || !teacherName) return;

  const teachers = getUniqueTeachers(AppState.timetableData);
  const tInfo = teachers.find(t => t.name === teacherName);
  if (!tInfo) {
    card.innerHTML = '<p style="color:var(--text-muted);">لم يتم العثور على بيانات هذا المعلم.</p>';
    return;
  }

  const schedule = getTeacherSchedule(teacherName, AppState.timetableData);

  let dayRows = '';
  TIMETABLE_DAYS.forEach(d => {
    const dayLessons = (schedule[d.id] || []).filter(item => item && item.lesson);
    const periodsSummary = dayLessons.map(item => {
      const conflictTag = item.lesson.hasConflict ? '<span style="color:#ef4444; font-weight:800;">(⚠️ تعارض)</span>' : '';
      return `<strong>الحصة ${item.period}:</strong> ${item.lesson.className} (${item.lesson.subject}) ${conflictTag}`;
    }).join(' | ');

    dayRows += `
      <tr>
        <td style="font-weight: 800; width: 90px;">${d.name}</td>
        <td style="width: 75px; text-align: center;">
          <span style="background: var(--primary-light); color: var(--primary); font-weight: 800; padding: 2px 8px; border-radius: 99px; font-size: 0.8rem;">
            ${dayLessons.length} حصص
          </span>
        </td>
        <td style="font-size: 0.82rem; color: var(--text-secondary); text-align: right; line-height: 1.5;">
          ${periodsSummary || '<span style="color: var(--text-light); font-style: italic;">لا توجد حصص في هذا اليوم</span>'}
        </td>
      </tr>
    `;
  });

  card.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 10px; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
      <div>
        <h4 style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary); margin: 0;">أ. ${tInfo.name}</h4>
        <div style="font-size: 0.84rem; color: var(--text-muted); margin-top: 4px;">
          المواد: <strong style="color: var(--text-secondary);">${tInfo.subjects.join('، ') || '—'}</strong> | الصفوف: <strong style="color: var(--text-secondary);">${tInfo.classes.join('، ') || '—'}</strong>
        </div>
      </div>
      <div style="text-align: left;">
        <span style="background: var(--primary-gradient); color: #fff; font-weight: 800; font-size: 0.88rem; padding: 4px 12px; border-radius: 99px; display: inline-block;">
          الحصص الأسبوعية: ${tInfo.totalLessons} حصة
        </span>
      </div>
    </div>
    <div style="font-size: 0.86rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 6px;">
      معاينة توزيع الحصص الأسبوعية للمعلم:
    </div>
    <table class="teacher-preview-table">
      <thead>
        <tr>
          <th>اليوم</th>
          <th>العدد</th>
          <th style="text-align: right;">تفاصيل الحصص والفصول</th>
        </tr>
      </thead>
      <tbody>
        ${dayRows}
      </tbody>
    </table>
  `;
}

function executeTeacherPrint() {
  const select = document.getElementById('teacherPrintSelect');
  if (!select || !select.value) {
    showToast('يرجى اختيار معلم أولاً للطباعة');
    return;
  }
  const teacherName = select.value;
  closeTeacherPrintModal();
  printTeacherSchedule(teacherName);
}

// ==========================================================================
// نافذة كشف وإصلاح التعارضات (Conflicts Modal)
// ==========================================================================

function openConflictsModal() {
  const conflicts = detectConflicts(AppState.timetableData);
  const summaryEl = document.getElementById('conflictsModalSummary');
  const listContainer = document.getElementById('conflictsListContainer');
  const iconEl = document.getElementById('conflictsModalIcon');

  if (summaryEl) {
    if (conflicts.length > 0) {
      if (iconEl) iconEl.textContent = '⚠️';
      summaryEl.innerHTML = `
        <div style="background: #fef2f2; border: 1.5px solid #fecaca; border-radius: var(--radius-md); padding: 12px 16px; color: #991b1b;">
          <div style="font-size: 1rem; font-weight: 800; margin-bottom: 4px;">
            ⚠️ تم رصد ${conflicts.length} حالة تعارض وتضارب في الجدول الحالي:
          </div>
          <div style="font-size: 0.84rem; color: #b91c1c; line-height: 1.4;">
            يوجد معلمون تم تعيينهم لأكثر من شعبة أو صف في نفس الحصة والتوقيت. انقر على زر "حل وتعديل" لتصحيح الحصة وتفادي الازدواجية فوراً.
          </div>
        </div>
      `;
    } else {
      if (iconEl) iconEl.textContent = '✅';
      summaryEl.innerHTML = `
        <div style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: var(--radius-md); padding: 14px 18px; color: #166534; text-align: center;">
          <div style="font-size: 1.1rem; font-weight: 800; margin-bottom: 4px;">
            🎉 الجدول المدرسي مثالي وسليم 100%!
          </div>
          <div style="font-size: 0.86rem; color: #15803d;">
            لا توجد أي تعارضات أو تضارب بين الحصص والمعلمين في أي يوم من أيام الأسبوع.
          </div>
        </div>
      `;
    }
  }

  if (listContainer) {
    if (conflicts.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem; color: var(--text-muted);">
          <span style="font-size: 3rem; display: block; margin-bottom: 0.5rem;">👍</span>
          <p style="font-weight: 700;">لا توجد أي تعارضات تحتاج إلى تصحيح حالياً.</p>
        </div>
      `;
    } else {
      let itemsHtml = '';
      conflicts.forEach((c, idx) => {
        const assignmentsBadges = c.assignments.map(a => `
          <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-color); padding: 5px 10px; border-radius: 6px; display: inline-flex; align-items: center; gap: 8px; margin: 3px;">
            <strong style="color: var(--text-primary); font-size: 0.86rem;">الصف ${a.className}:</strong>
            <span style="color: var(--primary); font-size: 0.84rem; font-weight: 700;">${a.subject}</span>
            <button class="btn btn-sm" style="padding: 2px 8px; font-size: 0.76rem; background: var(--primary); color: #fff; border: none; border-radius: 4px; cursor: pointer;" onclick="resolveConflictDirectly('${c.dayId}', ${c.period}, '${a.classId}')" title="فتح نافذة تعديل هذه الحصة">
              ✏️ حل وتعديل
            </button>
          </div>
        `).join('');

        itemsHtml += `
          <div class="conflict-item-card">
            <div class="conflict-item-info" style="width: 100%;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <h4>#${idx + 1} - 📅 يوم ${c.dayName} | الحصة ${c.period}</h4>
                <span style="background: #fee2e2; color: #dc2626; font-size: 0.76rem; font-weight: 800; padding: 2px 8px; border-radius: 99px;">
                  تضارب معلم
                </span>
              </div>
              <p>👨‍🏫 المعلم: <strong style="color: #991b1b; font-size: 0.95rem;">${c.teacher}</strong> لديه حصص مكررة في نفس الوقت في الفصول التالية:</p>
              <div style="margin-top: 8px; display: flex; flex-wrap: wrap; align-items: center;">
                ${assignmentsBadges}
              </div>
            </div>
          </div>
        `;
      });
      listContainer.innerHTML = itemsHtml;
    }
  }

  const modal = document.getElementById('conflictsModal');
  if (modal) modal.classList.add('active');
}

function closeConflictsModal() {
  const modal = document.getElementById('conflictsModal');
  if (modal) modal.classList.remove('active');
}

function resolveConflictDirectly(dayId, periodNum, classId) {
  closeConflictsModal();
  openEditModal(dayId, periodNum, classId);
}

// فحص التعارض اللحظي أثناء كتابة المعلم في نافذة التعديل
function checkTeacherConflictLive() {
  const warnEl = document.getElementById('editConflictWarning');
  if (!warnEl) return;

  if (!AppState.editingCell) {
    warnEl.style.display = 'none';
    return;
  }

  const { dayId, periodNum, classId } = AppState.editingCell;
  const teacherInput = document.getElementById('editTeacherInput');
  const typedTeacher = (teacherInput ? teacherInput.value : '').trim();

  if (!typedTeacher || typedTeacher === '-') {
    warnEl.style.display = 'none';
    return;
  }

  const dayPeriods = AppState.timetableData[dayId] || {};
  const periodData = dayPeriods[periodNum] || {};
  const conflictingAssignments = [];

  for (const otherClassId in periodData) {
    if (otherClassId === classId) continue;
    const otherCell = periodData[otherClassId];
    if (otherCell && otherCell.teacher && otherCell.teacher.trim().toLowerCase() === typedTeacher.toLowerCase()) {
      const classObj = TIMETABLE_CLASSES.find(c => c.id === otherClassId);
      conflictingAssignments.push({
        className: classObj ? classObj.name : otherClassId,
        subject: otherCell.subject || 'مادة'
      });
    }
  }

  if (conflictingAssignments.length > 0) {
    const details = conflictingAssignments.map(a => `${a.className} (${a.subject})`).join(' و ');
    warnEl.innerHTML = `⚠️ <strong>تنبيه تعارض:</strong> المعلم (<strong>${typedTeacher}</strong>) لديه حصة أخرى في نفس هذا الوقت في: <strong>${details}</strong>. إذا تم حفظ الحصة فسيكون هناك تضارب في جدول المعلم!`;
    warnEl.style.display = 'block';
  } else {
    warnEl.style.display = 'none';
  }
}

// ==========================================================================
// إدارة تعديل الحصص يدوياً
// ==========================================================================

function openEditModal(dayId, periodNum, classId) {
  const dayData = AppState.timetableData[dayId] || {};
  const periodData = dayData[periodNum] || {};
  const currentCell = periodData[classId] || { subject: '', teacher: '' };

  AppState.editingCell = { dayId, periodNum, classId };

  const dayObj = TIMETABLE_DAYS.find(d => d.id === dayId);
  const classObj = TIMETABLE_CLASSES.find(c => c.id === classId);

  document.getElementById('editModalTitle').textContent = `تعديل الحصة: ${classObj?.name} - يوم ${dayObj?.name} (الحصة ${periodNum})`;
  document.getElementById('editSubjectInput').value = currentCell.subject || '';
  document.getElementById('editTeacherInput').value = currentCell.teacher || '';

  // فحص مباشر لأي تعارض موجود
  checkTeacherConflictLive();

  const modal = document.getElementById('editLessonModal');
  if (modal) modal.classList.add('active');
}

function closeEditModal() {
  const modal = document.getElementById('editLessonModal');
  if (modal) modal.classList.remove('active');
  const warnEl = document.getElementById('editConflictWarning');
  if (warnEl) warnEl.style.display = 'none';
  AppState.editingCell = null;
}

function saveCellEdit() {
  if (!AppState.editingCell) return;

  const { dayId, periodNum, classId } = AppState.editingCell;
  const newSubject = document.getElementById('editSubjectInput').value.trim();
  const newTeacher = document.getElementById('editTeacherInput').value.trim();

  if (!AppState.timetableData[dayId]) AppState.timetableData[dayId] = {};
  if (!AppState.timetableData[dayId][periodNum]) AppState.timetableData[dayId][periodNum] = {};

  if (newSubject) {
    AppState.timetableData[dayId][periodNum][classId] = {
      subject: newSubject,
      teacher: newTeacher
    };
  } else {
    AppState.timetableData[dayId][periodNum][classId] = null;
  }

  persistData();
  populateTeacherFilter();
  closeEditModal();
  updateConflictStatus();
  renderApp();
  showToast('تم حفظ تعديل الحصة بنجاح!');
}

// إغلاق كافة النوافذ المنبثقة
function closeAllModals() {
  closeEditModal();
  closePrintModal();
  closeTeacherPrintModal();
  closeConflictsModal();
}

// إشعار سريع (Toast)
function showToast(msg) {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: #1e293b;
      color: #fff;
      padding: 10px 22px;
      border-radius: 99px;
      font-size: 0.9rem;
      font-weight: 700;
      box-shadow: 0 10px 25px rgba(0,0,0,0.25);
      z-index: 2000;
      transition: all 0.3s ease;
      opacity: 0;
      pointer-events: none;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
  }, 2500);
}

// تبديل الوضع الليلي والنهاري
function toggleTheme() {
  const newTheme = AppState.theme === 'dark' ? 'light' : 'dark';
  AppState.theme = newTheme;
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('zattari_theme', newTheme);
  
  const icon = document.getElementById('themeIcon');
  if (icon) {
    icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
  }
}

// تبديل نمط العرض (Grid / Cards)
function setViewMode(mode) {
  AppState.viewMode = mode;
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });
  renderApp();
}

// ==========================================================================
// أحداث الإدخال والمستمعات (Event Listeners)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // تهيئة الثيم
  document.documentElement.setAttribute('data-theme', AppState.theme);
  const icon = document.getElementById('themeIcon');
  if (icon) {
    icon.textContent = AppState.theme === 'dark' ? '☀️' : '🌙';
  }

  // تهيئة البيانات
  initData();

  // تهيئة الفلاتر والتبويبات
  populateFilters();
  renderDayTabs();

  // تفعيل مستمع البحث الحي
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      AppState.searchQuery = e.target.value;
      renderApp();
    });
  }

  // مستمع فلتر الصفوف
  const classFilter = document.getElementById('classFilterSelect');
  if (classFilter) {
    classFilter.addEventListener('change', (e) => {
      AppState.selectedClass = e.target.value;
      renderApp();
    });
  }

  // مستمع فلتر المعلمين
  const teacherFilter = document.getElementById('teacherFilterSelect');
  if (teacherFilter) {
    teacherFilter.addEventListener('change', (e) => {
      AppState.selectedTeacher = e.target.value;
      if (AppState.selectedTeacher !== 'all') {
        AppState.viewMode = 'teacher';
      } else if (AppState.viewMode === 'teacher') {
        AppState.viewMode = 'grid';
      }
      renderApp();
    });
  }

  // مستمع أزرار نمط العرض
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setViewMode(btn.dataset.mode);
    });
  });

  // إغلاق النوافذ المنبثقة عند الضغط على مفتاح Escape أو النقر على الخلفية
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeAllModals();
      }
    });
  });

  // فحص التعارضات والعرض المبدئي
  updateConflictStatus();
  renderApp();
});
