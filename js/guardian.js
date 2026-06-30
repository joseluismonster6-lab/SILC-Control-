const guardianElements = {
  studentSelect: document.getElementById('guardianStudentSelect'),
  studentName: document.getElementById('guardianStudentName'),
  studentGuardian: document.getElementById('guardianStudentGuardian'),
  studentAbsences: document.getElementById('guardianStudentAbsences'),
  studentBalance: document.getElementById('guardianStudentBalance'),
  notificationsBox: document.getElementById('guardianNotifications'),
  noticesBox: document.getElementById('guardianNotices'),
  absenceList: document.getElementById('guardianAbsenceList'),
  attendanceLog: document.getElementById('guardianAttendanceLog'),
  statusBox: document.getElementById('guardianStatus'),
  justificationForm: document.getElementById('guardianJustificationForm'),
  justificationReason: document.getElementById('guardianJustificationReason'),
  justificationMessage: document.getElementById('guardianJustificationMessage')
};

const guardianLoginForm = document.getElementById('guardianLoginForm');
const guardianLoginMessage = document.getElementById('guardianLoginMessage');
const guardianPortal = document.getElementById('guardianPortal');
let guardianStudentId = data.students[0]?.id;

function renderGuardianInfo(student) {
  guardianElements.studentName.textContent = student.name;
  guardianElements.studentGuardian.textContent = student.guardian;
  guardianElements.studentAbsences.textContent = student.absences;
  guardianElements.studentBalance.textContent = formatCurrency(student.balance);

  guardianElements.notificationsBox.innerHTML = buildList(student.notifications, (item) => `
    <li><strong>${item.date}</strong><br />${item.text}</li>
  `, 'Nenhuma notificação de presença ainda.');

  guardianElements.noticesBox.innerHTML = buildList(student.notices, (item) => `
    <li><strong>${item.date}</strong><br />${item.text}</li>
  `, 'Nenhum comunicado recente.');

  guardianElements.attendanceLog.innerHTML = buildList(student.attendance, (item) => `
    <li><strong>${formatTimestamp(item.timestamp)}</strong><br />${item.message}</li>
  `, 'Nenhum histórico de presença disponível.');

  guardianElements.absenceList.innerHTML = buildList(
    student.attendance.filter((item) => item.action === 'exit'),
    (item) => `<li><strong>${formatTimestamp(item.timestamp)}</strong><br />${item.message}</li>`,
    'Nenhuma falta registrada.'
  );
}

function updateGuardianStatus(message) {
  guardianElements.statusBox.innerHTML = `<strong>Última notificação</strong><p>${message}</p>`;
}

function populateGuardianOptions() {
  const session = getCurrentSession();
  const eligibleStudents = data.students.filter((student) => {
    if (!session || session.type !== 'guardian') {
      return true;
    }
    return normalizeText(student.id) === normalizeText(session.studentId);
  });

  guardianElements.studentSelect.innerHTML = eligibleStudents
    .map((student) => `<option value="${student.id}">${student.name}</option>`)
    .join('');
}

function onGuardianStudentChange(event) {
  guardianStudentId = event.target.value;
  const student = getStudentById(guardianStudentId);
  if (student) {
    renderGuardianInfo(student);
    updateGuardianStatus('Aluno selecionado para o painel do encarregado.');
  }
}

function submitGuardianJustification(event) {
  event.preventDefault();
  const reason = guardianElements.justificationReason.value.trim();
  if (!reason) {
    guardianElements.justificationMessage.textContent = 'Informe o conteúdo do relatório.';
    return;
  }

  const student = getStudentById(guardianStudentId);
  if (!student) return;

  addJustification(student, reason);
  guardianElements.justificationMessage.textContent = 'Relatório enviado com sucesso.';
  guardianElements.justificationReason.value = '';
  renderGuardianInfo(student);
  updateGuardianStatus('Relatório registado para o aluno.');
}

function bindGuardianEvents() {
  guardianElements.studentSelect.addEventListener('change', onGuardianStudentChange);
  guardianElements.justificationForm.addEventListener('submit', submitGuardianJustification);
}

function getCurrentSession() {
  return data.session;
}

function showGuardianPortal() {
  document.getElementById('guardianLoginGate')?.classList.add('hidden');
  guardianPortal?.classList.remove('hidden');
}

function showGuardianLogin() {
  document.getElementById('guardianLoginGate')?.classList.remove('hidden');
  guardianPortal?.classList.add('hidden');
}

function configureGuardianSession() {
  const session = getCurrentSession();
  if (!session || session.type !== 'guardian') {
    showGuardianLogin();
    return false;
  }

  guardianStudentId = session.studentId;
  showGuardianPortal();
  return true;
}

function bindGuardianLogin() {
  if (!guardianLoginForm) {
    return;
  }

  guardianLoginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const result = guardianLogin({
      studentId: document.getElementById('guardianLoginStudentId').value,
      studentName: document.getElementById('guardianLoginStudentName').value,
      studentPassword: document.getElementById('guardianLoginStudentPassword').value,
      name: document.getElementById('guardianLoginName').value,
      phone: document.getElementById('guardianLoginPhone').value
    });

    if (result.success) {
      showMessage(guardianLoginMessage, 'Login realizado com sucesso.', 'success');
      showGuardianPortal();
      populateGuardianOptions();
      bindGuardianEvents();
      if (guardianStudentId) {
        renderGuardianInfo(getStudentById(guardianStudentId));
        updateGuardianStatus('Bem-vindo ao painel do encarregado. Você pode ver alertas e enviar relatórios.');
      }
      return;
    }

    showMessage(guardianLoginMessage, result.message, 'error');
  });
}

window.addEventListener('DOMContentLoaded', () => {
  bindGuardianLogin();

  if (!configureGuardianSession()) {
    return;
  }

  populateGuardianOptions();
  bindGuardianEvents();
  if (guardianStudentId) {
    renderGuardianInfo(getStudentById(guardianStudentId));
    updateGuardianStatus('Bem-vindo ao painel do encarregado. Você pode ver alertas e enviar relatórios.');
  }
});
