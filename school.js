const elements = {
  studentSelect: document.getElementById('studentSelect'),
  studentCode: document.getElementById('studentCode'),
  studentGuardian: document.getElementById('studentGuardian'),
  latestStatus: document.getElementById('latestStatus'),
  scheduleList: document.getElementById('scheduleList'),
  gradesList: document.getElementById('gradesList'),
  studentAbsences: document.getElementById('studentAbsences'),
  studentBalance: document.getElementById('studentBalance'),
  noticeList: document.getElementById('noticeList'),
  notificationsList: document.getElementById('notificationsList'),
  justificationForm: document.getElementById('justificationForm'),
  justificationReason: document.getElementById('justificationReason'),
  justificationMessage: document.getElementById('justificationMessage'),
  entryButton: document.getElementById('entryButton'),
  exitButton: document.getElementById('exitButton')
};

const students = [
  {
    id: 'joao-silva',
    name: 'João Silva',
    cardId: 'RFID-001',
    qrCode: 'QR-001',
    guardian: 'Maria Silva',
    gradeReport: [
      { subject: 'Matemática', grade: '17', term: '1º Trim' },
      { subject: 'Português', grade: '16', term: '1º Trim' },
      { subject: 'Ciências', grade: '18', term: '1º Trim' },
      { subject: 'Inglês', grade: '15', term: '1º Trim' }
    ],
    absences: 2,
    balance: 14.5,
    schedule: [
      { day: 'Segunda', time: '07:30 - 10:00', subject: 'Matemática' },
      { day: 'Terça', time: '07:30 - 10:00', subject: 'Português' },
      { day: 'Quarta', time: '07:30 - 10:00', subject: 'Ciências' },
      { day: 'Quinta', time: '07:30 - 10:00', subject: 'Inglês' },
      { day: 'Sexta', time: '07:30 - 10:00', subject: 'História' }
    ],
    notices: [
      { date: '2026-06-24', text: 'Reunião de pais e encarregados na sexta-feira às 18h.' },
      { date: '2026-06-23', text: 'Entrega de boletins de avaliação no final do mês.' }
    ],
    notifications: []
  },
  {
    id: 'maria-fernandes',
    name: 'Maria Fernandes',
    cardId: 'RFID-002',
    qrCode: 'QR-002',
    guardian: 'Carlos Fernandes',
    gradeReport: [
      { subject: 'Matemática', grade: '15', term: '1º Trim' },
      { subject: 'Português', grade: '17', term: '1º Trim' },
      { subject: 'Ciências', grade: '16', term: '1º Trim' },
      { subject: 'Inglês', grade: '14', term: '1º Trim' }
    ],
    absences: 1,
    balance: 8.9,
    schedule: [
      { day: 'Segunda', time: '07:30 - 10:00', subject: 'Geografia' },
      { day: 'Terça', time: '07:30 - 10:00', subject: 'História' },
      { day: 'Quarta', time: '07:30 - 10:00', subject: 'Matemática' },
      { day: 'Quinta', time: '07:30 - 10:00', subject: 'Ciências' },
      { day: 'Sexta', time: '07:30 - 10:00', subject: 'Artes' }
    ],
    notices: [
      { date: '2026-06-24', text: 'Prova de Ciências na próxima quarta-feira.' },
      { date: '2026-06-22', text: 'A biblioteca abre aos sábados para estudo.' }
    ],
    notifications: []
  }
];

const attendanceRecords = [];

let currentStudentId = null;

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

function buildList(items, renderItem) {
  if (!items.length) {
    return '<p class="note">Nenhum item disponível.</p>';
  }
  return `<ul class="list-reset">${items.map(renderItem).join('')}</ul>`;
}

function updateStatus(message) {
  elements.latestStatus.innerHTML = `<strong>Status</strong><p>${message}</p>`;
}

function loadStudents() {
  elements.studentSelect.innerHTML = students
    .map((student) => `<option value="${student.id}">${student.name}</option>`)
    .join('');

  if (students.length) {
    currentStudentId = students[0].id;
    loadStudent(currentStudentId);
  }
}

function loadStudent(studentId) {
  if (!studentId) return;
  currentStudentId = studentId;
  const student = students.find((s) => s.id === studentId);
  if (!student) return;

  elements.studentCode.textContent = student.cardId || student.qrCode || 'N/A';
  elements.studentGuardian.textContent = student.guardian || 'N/A';
  elements.studentAbsences.textContent = student.absences;
  elements.studentBalance.textContent = formatCurrency(student.balance);

  elements.scheduleList.innerHTML = buildList(student.schedule, (item) => `
    <li><strong>${item.day}</strong> — ${item.time}<br /><span>${item.subject}</span></li>
  `);

  elements.gradesList.innerHTML = buildList(student.gradeReport, (item) => `
    <li><strong>${item.subject}</strong>: ${item.grade} <span class="note">${item.term}</span></li>
  `);

  elements.noticeList.innerHTML = buildList(student.notices, (item) => `
    <li><strong>${item.date}</strong><br />${item.text}</li>
  `);

  elements.notificationsList.innerHTML = buildList(student.notifications, (item) => `
    <li>${item.message}</li>
  `);
}

function getCurrentTimestamp() {
  return new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function scanAttendance(action) {
  if (!currentStudentId) return;
  const student = students.find((s) => s.id === currentStudentId);
  if (!student) return;

  const label = action === 'entry' ? 'entrou' : 'saiu';
  const timestamp = getCurrentTimestamp();
  const message = `✅ ${student.name} ${label} na escola às ${timestamp}.`;

  const record = {
    studentId: student.id,
    action,
    timestamp,
    message
  };

  attendanceRecords.unshift(record);
  student.notifications.unshift({ date: new Date().toLocaleDateString('pt-BR'), text: message });

  updateStatus(message);
  loadStudent(student.id);
}

function sendJustification(event) {
  event.preventDefault();
  const reason = elements.justificationReason.value.trim();
  if (!reason) {
    elements.justificationMessage.textContent = 'Informe um motivo para a justificativa.';
    return;
  }

  const student = students.find((s) => s.id === currentStudentId);
  if (!student) return;

  student.notifications.unshift({
    date: new Date().toLocaleDateString('pt-BR'),
    text: `Justificativa enviada: ${reason}`
  });

  elements.justificationMessage.textContent = 'Justificativa enviada com sucesso.';
  elements.justificationReason.value = '';
  loadStudent(student.id);
}

function bindEvents() {
  elements.studentSelect.addEventListener('change', (event) => {
    loadStudent(event.target.value);
  });

  elements.entryButton.addEventListener('click', () => {
    scanAttendance('entry');
  });

  elements.exitButton.addEventListener('click', () => {
    scanAttendance('exit');
  });

  elements.justificationForm.addEventListener('submit', sendJustification);
}

window.addEventListener('DOMContentLoaded', () => {
  bindEvents();
  loadStudents();
  updateStatus('Selecione um aluno para iniciar o registro de presença.');
});
