const studentElements = {
  studentSelect: document.getElementById('studentSelect'),
  studentName: document.getElementById('studentName'),
  studentGuardian: document.getElementById('studentGuardian'),
  studentCode: document.getElementById('studentCode'),
  studentAbsences: document.getElementById('studentAbsences'),
  studentBalance: document.getElementById('studentBalance'),
  scheduleList: document.getElementById('scheduleList'),
  gradesList: document.getElementById('gradesList'),
  noticeList: document.getElementById('noticeList'),
  notificationsList: document.getElementById('notificationsList'),
  attendanceLog: document.getElementById('attendanceLog'),
  latestStatus: document.getElementById('latestStatus'),
  justificationForm: document.getElementById('justificationForm'),
  justificationReason: document.getElementById('justificationReason'),
  justificationMessage: document.getElementById('justificationMessage'),
  entryButton: document.getElementById('entryButton'),
  exitButton: document.getElementById('exitButton')
};

const studentLoginForm = document.getElementById('studentLoginForm');
const studentLoginMessage = document.getElementById('studentLoginMessage');
const studentPortal = document.getElementById('studentPortal');
let selectedStudentId = data.students[0]?.id;

function renderStudentInfo(student) {
  studentElements.studentName.textContent = student.name;
  studentElements.studentGuardian.textContent = student.guardian;
  studentElements.studentCode.textContent = `${student.cardId} / ${student.qrCode}`;
  studentElements.studentAbsences.textContent = student.absences;
  studentElements.studentBalance.textContent = formatCurrency(student.balance);

  studentElements.scheduleList.innerHTML = buildList(student.schedule, (item) => `
    <li><strong>${item.day}</strong><span>${item.time}</span><br /><em>${item.subject}</em></li>
  `);

  studentElements.gradesList.innerHTML = buildList(student.gradeReport, (item) => `
    <li><strong>${item.subject}</strong><span>${item.grade}</span><br /><em>${item.term}</em></li>
  `);

  studentElements.noticeList.innerHTML = buildList(student.notices, (item) => `
    <li><strong>${item.date}</strong><br />${item.text}</li>
  `, 'Sem avisos no momento.');

  studentElements.notificationsList.innerHTML = buildList(student.notifications, (item) => `
    <li>${item.text}</li>
  `, 'Sem notificações recentes.');

  studentElements.attendanceLog.innerHTML = buildList(student.attendance, (item) => `
    <li><strong>${formatTimestamp(item.timestamp)}</strong><br />${item.message}</li>
  `, 'Nenhuma entrada ou saída registrada.');
}

function updateStatus(message) {
  studentElements.latestStatus.innerHTML = `<strong>Status</strong><p>${message}</p>`;
}

function populateStudentOptions() {
  studentElements.studentSelect.innerHTML = data.students
    .map((student) => `<option value="${student.id}">${student.name}</option>`)
    .join('');
}

function onStudentChange(event) {
  selectedStudentId = event.target.value;
  const student = getStudentById(selectedStudentId);
  if (student) {
    renderStudentInfo(student);
    updateStatus('Aluno selecionado com sucesso.');
  }
}

function scanStudent(action) {
  const student = getStudentById(selectedStudentId);
  if (!student) return;

  const event = createAttendanceEvent(student, action);
  renderStudentInfo(student);
  updateStatus(event.message);
}

function submitJustification(event) {
  event.preventDefault();
  const reason = studentElements.justificationReason.value.trim();
  if (!reason) {
    studentElements.justificationMessage.textContent = 'Informe o motivo da justificativa.';
    return;
  }

  const student = getStudentById(selectedStudentId);
  if (!student) return;

  addJustification(student, reason);
  studentElements.justificationMessage.textContent = 'Justificativa enviada com sucesso.';
  studentElements.justificationReason.value = '';
  renderStudentInfo(student);
  updateStatus('Justificativa registrada e notificação enviada ao encarregado.');
}

function bindStudentEvents() {
  studentElements.studentSelect.addEventListener('change', onStudentChange);
  studentElements.entryButton.addEventListener('click', () => scanStudent('entry'));
  studentElements.exitButton.addEventListener('click', () => scanStudent('exit'));
  if (studentElements.justificationForm) {
    studentElements.justificationForm.addEventListener('submit', submitJustification);
  }
}

function getCurrentSession() {
  return data.session;
}

function showStudentPortal() {
  document.getElementById('studentLoginGate')?.classList.add('hidden');
  studentPortal?.classList.remove('hidden');
}

function showStudentLogin() {
  document.getElementById('studentLoginGate')?.classList.remove('hidden');
  studentPortal?.classList.add('hidden');
}

function configureStudentSession() {
  const session = getCurrentSession();
  if (!session || session.type !== 'student') {
    showStudentLogin();
    return false;
  }

  selectedStudentId = session.userId;
  showStudentPortal();
  const studentCard = studentElements.studentSelect?.closest('.card');
  if (studentCard) {
    studentCard.classList.add('hidden');
  }
  return true;
}

function bindStudentLogin() {
  if (!studentLoginForm) {
    return;
  }

  studentLoginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const result = studentLogin({
      name: document.getElementById('studentLoginName').value,
      cardId: document.getElementById('studentLoginCard').value,
      password: document.getElementById('studentLoginPassword').value
    });

    if (result.success) {
      showMessage(studentLoginMessage, 'Login realizado com sucesso.', 'success');
      selectedStudentId = data.session?.userId;
      showStudentPortal();
      populateStudentOptions();
      const studentCard = studentElements.studentSelect?.closest('.card');
      if (studentCard) {
        studentCard.classList.add('hidden');
      }
      bindStudentEvents();
      if (selectedStudentId) {
        renderStudentInfo(getStudentById(selectedStudentId));
        updateStatus('Bem-vindo ao painel do aluno. Use os botões para registrar presença.');
      }
      return;
    }

    showMessage(studentLoginMessage, result.message, 'error');
  });
}

window.addEventListener('DOMContentLoaded', () => {
  bindStudentLogin();

  if (!configureStudentSession()) {
    return;
  }

  populateStudentOptions();
  bindStudentEvents();
  if (selectedStudentId) {
    renderStudentInfo(getStudentById(selectedStudentId));
    updateStatus('Bem-vindo ao painel do aluno. Use os botões para registrar presença.');
  }
});
