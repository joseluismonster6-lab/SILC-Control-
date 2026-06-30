const storageKey = 'controlSILC-state';

const initialData = {
  admins: [
    {
      id: 'admin-1',
      name: 'Administrador',
      username: 'admin',
      password: 'Admin@123'
    }
  ],
  students: [
    {
      id: 'joao-silva',
      name: 'João Silva',
      password: 'Aluno123',
      approved: true,
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
      notifications: [],
      attendance: []
    },
    {
      id: 'maria-fernandes',
      name: 'Maria Fernandes',
      password: 'Aluno123',
      approved: true,
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
      notifications: [],
      attendance: []
    }
  ],
  guardians: [
    {
      id: 'guardian-1',
      studentId: 'joao-silva',
      name: 'Maria Silva',
      phone: '(11) 99999-9999',
      approved: true
    }
  ],
  pendingStudents: [],
  pendingGuardians: [],
  teachers: [
    {
      id: 'teacher-1',
      name: 'Ana Costa',
      username: 'ana',
      password: 'Prof123',
      subject: 'Matemática',
      role: 'teacher',
      permissions: ['notas', 'faltas', 'horarios']
    }
  ],
  classes: [
    {
      id: 'class-1',
      name: '10º A',
      level: '10º ano',
      room: 'Sala 12',
      teacherId: 'teacher-1'
    }
  ],
  subjects: [
    {
      id: 'subject-1',
      name: 'Matemática',
      teacherId: 'teacher-1'
    }
  ],
  schedules: [
    {
      id: 'schedule-1',
      classId: 'class-1',
      subjectId: 'subject-1',
      teacherId: 'teacher-1',
      day: 'Segunda',
      time: '07:30'
    }
  ],
  notices: [
    {
      id: 'notice-1',
      title: 'Reunião de pais',
      message: 'A reunião acontece na sexta-feira às 18h.',
      audience: 'all',
      createdAt: new Date().toISOString()
    }
  ],
  payments: [
    {
      id: 'payment-1',
      studentId: 'joao-silva',
      amount: 1200,
      status: 'Pago',
      dueDate: '2026-06-30'
    }
  ],
  logs: [],
  session: null
};

function cloneInitialData() {
  return JSON.parse(JSON.stringify(initialData));
}

function loadState() {
  const raw = window.localStorage.getItem(storageKey);
  if (!raw) {
    return cloneInitialData();
  }

  try {
    const parsed = JSON.parse(raw);
    return Object.assign(cloneInitialData(), parsed);
  } catch (error) {
    console.warn('Falha ao carregar estado local:', error);
    return cloneInitialData();
  }
}

const data = loadState();

function persistState() {
  window.localStorage.setItem(storageKey, JSON.stringify(data));
}

function normalizeText(value) {
  return String(value || '').trim().toLowerCase();
}

function normalizePhone(value) {
  return String(value || '').replace(/\D+/g, '');
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

function buildList(items, renderItem, emptyText = 'Nenhum item disponível.') {
  if (!items.length) {
    return `<p class="note">${emptyText}</p>`;
  }
  return `<ul class="list-reset">${items.map(renderItem).join('')}</ul>`;
}

function formatTimestamp(date) {
  return new Date(date).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function audit(eventType, message) {
  const entry = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    eventType,
    message
  };

  data.logs.unshift(entry);
  if (data.logs.length > 200) {
    data.logs.length = 200;
  }

  persistState();
  return entry;
}

function getCurrentSession() {
  return data.session;
}

function setCurrentSession(session) {
  data.session = session;
  persistState();
}

function clearCurrentSession() {
  data.session = null;
  persistState();
}

function getStudentById(id) {
  return data.students.find((student) => normalizeText(student.id) === normalizeText(id));
}

function getGuardianByStudent(studentId, guardianName, guardianPhone) {
  return data.guardians.find(
    (guardian) =>
      normalizeText(guardian.studentId) === normalizeText(studentId) &&
      normalizeText(guardian.name) === normalizeText(guardianName) &&
      normalizePhone(guardian.phone) === normalizePhone(guardianPhone) &&
      guardian.approved
  );
}

function getAdminByCredentials(username, password) {
  return data.admins.find(
    (admin) => normalizeText(admin.username) === normalizeText(username) && admin.password === password
  );
}

function getStudentLogin(studentName, cardId, password) {
  return data.students.find(
    (student) =>
      normalizeText(student.name) === normalizeText(studentName) &&
      normalizeText(student.cardId) === normalizeText(cardId) &&
      student.password === password &&
      student.approved
  );
}

function getGuardianLogin(studentId, studentName, studentPassword, guardianName, guardianPhone) {
  const student = getStudentById(studentId);
  if (!student || student.name !== studentName || student.password !== studentPassword || !student.approved) {
    return null;
  }

  return getGuardianByStudent(studentId, guardianName, guardianPhone);
}

function showMessage(element, message, type = 'info') {
  if (!element) {
    return;
  }

  element.textContent = message;
  element.classList.toggle('success', type === 'success');
  element.classList.toggle('error', type === 'error');
}

function showAuthPanel(panelId) {
  document.querySelectorAll('.auth-pane').forEach((panel) => {
    panel.classList.add('hidden');
  });
  document.querySelectorAll('.auth-tab-button').forEach((button) => {
    button.classList.remove('active');
  });

  const panel = document.getElementById(panelId);
  const button = document.querySelector(`.auth-tab-button[data-panel="${panelId}"]`);
  if (panel) {
    panel.classList.remove('hidden');
  }
  if (button) {
    button.classList.add('active');
  }
}

function initAuthTabs() {
  if (!document.getElementById('loginForms')) {
    return;
  }

  document.querySelectorAll('.auth-tab-button').forEach((button) => {
    button.addEventListener('click', () => {
      showAuthPanel(button.dataset.panel);
    });
  });
  showAuthPanel('studentPanel');
}

function initFormToggles() {
  if (!document.getElementById('loginForms')) {
    return;
  }

  document.getElementById('toggleStudentRegister')?.addEventListener('click', () => {
    document.getElementById('studentRegisterForm')?.classList.toggle('hidden');
  });
  document.getElementById('toggleGuardianRequest')?.addEventListener('click', () => {
    document.getElementById('guardianRequestForm')?.classList.toggle('hidden');
  });
}

function createAttendanceEvent(student, action) {
  const timestamp = new Date();
  const label = action === 'entry' ? 'entrou' : 'saiu';
  const message = `✅ ${student.name} ${label} na escola às ${formatTimestamp(timestamp)}.`;

  const event = {
    action,
    timestamp: timestamp.toISOString(),
    message
  };

  student.attendance.unshift(event);
  student.notifications.unshift({ date: timestamp.toLocaleDateString('pt-BR'), text: message });
  audit('attendance', message);
  persistState();
  return event;
}

function addJustification(student, reason) {
  const timestamp = new Date();
  const justification = {
    reason,
    timestamp: timestamp.toISOString(),
    message: `Justificativa enviada: ${reason}`
  };

  student.notifications.unshift({ date: timestamp.toLocaleDateString('pt-BR'), text: justification.message });
  audit('justification', `Justificativa enviada para ${student.name}: ${reason}`);
  persistState();
  return justification;
}

function generateStudentId(name, cardId) {
  return normalizeText(`${name}-${cardId}`)
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function registerStudentRequest(request) {
  const studentId = generateStudentId(request.name, request.cardId);
  const existingStudent = getStudentById(studentId);
  const pendingStudent = data.pendingStudents.find((pending) => pending.id === studentId);

  if (existingStudent || pendingStudent) {
    return { success: false, message: 'Aluno já cadastrado ou solicitação já enviada.' };
  }

  const newRequest = {
    id: studentId,
    name: request.name,
    password: request.password,
    cardId: request.cardId,
    guardian: request.guardian,
    guardianPhone: request.guardianPhone,
    requestedAt: new Date().toISOString()
  };

  data.pendingStudents.unshift(newRequest);
  audit('request', `Novo pedido de cadastro de aluno: ${newRequest.name}`);
  persistState();

  return { success: true };
}

function registerGuardianRequest(request) {
  const student = getStudentById(request.studentId);

  if (!student || student.name !== request.studentName || student.password !== request.studentPassword) {
    return { success: false, message: 'Dados do aluno inválidos ou não encontrados.' };
  }

  const pendingGuardian = data.pendingGuardians.find(
    (pending) =>
      normalizeText(pending.studentId) === normalizeText(request.studentId) &&
      normalizeText(pending.name) === normalizeText(request.name) &&
      normalizePhone(pending.phone) === normalizePhone(request.phone)
  );

  if (pendingGuardian) {
    return { success: false, message: 'Solicitação de encarregado já enviada.' };
  }

  const existingGuardian = data.guardians.find(
    (guardian) =>
      normalizeText(guardian.studentId) === normalizeText(request.studentId) &&
      normalizeText(guardian.name) === normalizeText(request.name) &&
      normalizePhone(guardian.phone) === normalizePhone(request.phone)
  );

  if (existingGuardian) {
    return { success: false, message: 'Este encarregado já está cadastrado.' };
  }

  data.pendingGuardians.unshift({
    id: `guardian-${Date.now()}`,
    studentId: normalizeText(request.studentId),
    studentName: request.studentName,
    name: request.name,
    phone: request.phone,
    requestedAt: new Date().toISOString()
  });

  audit('request', `Novo pedido de acesso de encarregado: ${request.name} para ${request.studentId}`);
  persistState();

  return { success: true };
}

function addStudent(student) {
  if (!student.name || !student.password || !student.cardId || !student.guardian || !student.guardianPhone) {
    return { success: false, message: 'Preencha todos os campos de aluno.' };
  }

  const studentId = generateStudentId(student.name, student.cardId);
  if (getStudentById(studentId)) {
    return { success: false, message: 'Aluno já existe no sistema.' };
  }

  data.students.unshift({
    id: studentId,
    name: student.name,
    password: student.password,
    approved: true,
    cardId: student.cardId,
    qrCode: student.cardId,
    guardian: student.guardian,
    guardianPhone: student.guardianPhone,
    gradeReport: [],
    absences: 0,
    balance: 0,
    schedule: [],
    notices: [
      { date: new Date().toLocaleDateString('pt-BR'), text: 'Cadastro criado diretamente pelo administrador.' }
    ],
    notifications: [],
    attendance: []
  });

  audit('add', `Aluno cadastrado pelo administrador: ${student.name}`);
  persistState();
  return { success: true };
}

function removeStudent(studentId) {
  const studentIndex = data.students.findIndex((student) => student.id === studentId);
  if (studentIndex === -1) {
    return { success: false, message: 'Aluno não encontrado.' };
  }

  const removedStudent = data.students.splice(studentIndex, 1)[0];
  data.guardians = data.guardians.filter((guardian) => guardian.studentId !== studentId);
  data.pendingStudents = data.pendingStudents.filter((pending) => pending.id !== studentId);
  data.pendingGuardians = data.pendingGuardians.filter((pending) => pending.studentId !== studentId);

  audit('remove', `Aluno removido pelo administrador: ${removedStudent.name}`);
  persistState();
  return { success: true };
}

function addGuardian(guardian) {
  if (!guardian.studentId || !guardian.name || !guardian.phone) {
    return { success: false, message: 'Preencha todos os campos de encarregado.' };
  }

  const student = getStudentById(guardian.studentId);
  if (!student) {
    return { success: false, message: 'Aluno associado não encontrado.' };
  }

  const existingGuardian = data.guardians.find(
    (item) =>
      normalizeText(item.studentId) === normalizeText(guardian.studentId) &&
      normalizeText(item.name) === normalizeText(guardian.name) &&
      normalizePhone(item.phone) === normalizePhone(guardian.phone)
  );

  if (existingGuardian) {
    return { success: false, message: 'Este encarregado já está cadastrado.' };
  }

  data.guardians.unshift({
    id: `guardian-${Date.now()}`,
    studentId: student.id,
    name: guardian.name,
    phone: guardian.phone,
    approved: true
  });

  audit('add', `Encarregado cadastrado pelo administrador: ${guardian.name}`);
  persistState();
  return { success: true };
}

function removeGuardian(guardianId) {
  const guardianIndex = data.guardians.findIndex((guardian) => guardian.id === guardianId);
  if (guardianIndex === -1) {
    return { success: false, message: 'Encarregado não encontrado.' };
  }

  const removedGuardian = data.guardians.splice(guardianIndex, 1)[0];
  audit('remove', `Encarregado removido pelo administrador: ${removedGuardian.name}`);
  persistState();
  return { success: true };
}

function addTeacher(teacher) {
  if (!teacher.name || !teacher.username || !teacher.password || !teacher.subject) {
    return { success: false, message: 'Preencha todos os campos do professor.' };
  }

  const existingTeacher = data.teachers.find((item) => normalizeText(item.username) === normalizeText(teacher.username));
  if (existingTeacher) {
    return { success: false, message: 'Este utilizador de professor já existe.' };
  }

  data.teachers.unshift({
    id: `teacher-${Date.now()}`,
    name: teacher.name,
    username: teacher.username,
    password: teacher.password,
    subject: teacher.subject,
    role: teacher.role || 'teacher',
    permissions: teacher.permissions ? teacher.permissions.split(',').map((item) => item.trim()).filter(Boolean) : []
  });

  audit('add', `Professor criado pelo administrador: ${teacher.name}`);
  persistState();
  return { success: true };
}

function removeTeacher(teacherId) {
  const teacherIndex = data.teachers.findIndex((teacher) => teacher.id === teacherId);
  if (teacherIndex === -1) {
    return { success: false, message: 'Professor não encontrado.' };
  }

  const removedTeacher = data.teachers.splice(teacherIndex, 1)[0];
  data.classes = data.classes.map((item) => (item.teacherId === teacherId ? { ...item, teacherId: '' } : item));
  data.subjects = data.subjects.map((item) => (item.teacherId === teacherId ? { ...item, teacherId: '' } : item));
  data.schedules = data.schedules.filter((item) => item.teacherId !== teacherId);

  audit('remove', `Professor removido pelo administrador: ${removedTeacher.name}`);
  persistState();
  return { success: true };
}

function addClass(newClass) {
  if (!newClass.name || !newClass.level || !newClass.room) {
    return { success: false, message: 'Preencha os campos da turma.' };
  }

  data.classes.unshift({
    id: `class-${Date.now()}`,
    name: newClass.name,
    level: newClass.level,
    room: newClass.room,
    teacherId: newClass.teacherId || ''
  });

  audit('add', `Turma criada: ${newClass.name}`);
  persistState();
  return { success: true };
}

function removeClass(classId) {
  const classIndex = data.classes.findIndex((item) => item.id === classId);
  if (classIndex === -1) {
    return { success: false, message: 'Turma não encontrada.' };
  }

  const removedClass = data.classes.splice(classIndex, 1)[0];
  data.schedules = data.schedules.filter((item) => item.classId !== classId);
  audit('remove', `Turma removida: ${removedClass.name}`);
  persistState();
  return { success: true };
}

function addSubject(subject) {
  if (!subject.name) {
    return { success: false, message: 'Informe o nome da disciplina.' };
  }

  data.subjects.unshift({
    id: `subject-${Date.now()}`,
    name: subject.name,
    teacherId: subject.teacherId || ''
  });

  audit('add', `Disciplina criada: ${subject.name}`);
  persistState();
  return { success: true };
}

function removeSubject(subjectId) {
  const subjectIndex = data.subjects.findIndex((item) => item.id === subjectId);
  if (subjectIndex === -1) {
    return { success: false, message: 'Disciplina não encontrada.' };
  }

  const removedSubject = data.subjects.splice(subjectIndex, 1)[0];
  data.schedules = data.schedules.filter((item) => item.subjectId !== subjectId);
  audit('remove', `Disciplina removida: ${removedSubject.name}`);
  persistState();
  return { success: true };
}

function addSchedule(schedule) {
  if (!schedule.classId || !schedule.subjectId || !schedule.teacherId || !schedule.day || !schedule.time) {
    return { success: false, message: 'Preencha todos os campos do horário.' };
  }

  data.schedules.unshift({
    id: `schedule-${Date.now()}`,
    classId: schedule.classId,
    subjectId: schedule.subjectId,
    teacherId: schedule.teacherId,
    day: schedule.day,
    time: schedule.time
  });

  audit('add', `Horário criado para a turma ${schedule.classId}`);
  persistState();
  return { success: true };
}

function removeSchedule(scheduleId) {
  const scheduleIndex = data.schedules.findIndex((item) => item.id === scheduleId);
  if (scheduleIndex === -1) {
    return { success: false, message: 'Horário não encontrado.' };
  }

  const removedSchedule = data.schedules.splice(scheduleIndex, 1)[0];
  audit('remove', `Horário removido: ${removedSchedule.day} ${removedSchedule.time}`);
  persistState();
  return { success: true };
}

function addNotice(notice) {
  if (!notice.title || !notice.message) {
    return { success: false, message: 'Preencha título e mensagem do aviso.' };
  }

  data.notices.unshift({
    id: `notice-${Date.now()}`,
    title: notice.title,
    message: notice.message,
    audience: notice.audience || 'all',
    createdAt: new Date().toISOString()
  });

  audit('add', `Aviso publicado: ${notice.title}`);
  persistState();
  return { success: true };
}

function removeNotice(noticeId) {
  const noticeIndex = data.notices.findIndex((item) => item.id === noticeId);
  if (noticeIndex === -1) {
    return { success: false, message: 'Aviso não encontrado.' };
  }

  const removedNotice = data.notices.splice(noticeIndex, 1)[0];
  audit('remove', `Aviso removido: ${removedNotice.title}`);
  persistState();
  return { success: true };
}

function addPayment(payment) {
  if (!payment.studentId || !payment.amount || !payment.dueDate) {
    return { success: false, message: 'Preencha os campos do pagamento.' };
  }

  if (!getStudentById(payment.studentId)) {
    return { success: false, message: 'Aluno não encontrado.' };
  }

  data.payments.unshift({
    id: `payment-${Date.now()}`,
    studentId: payment.studentId,
    amount: Number(payment.amount),
    status: payment.status || 'Pendente',
    dueDate: payment.dueDate
  });

  audit('add', `Pagamento registado para ${payment.studentId}`);
  persistState();
  return { success: true };
}

function removePayment(paymentId) {
  const paymentIndex = data.payments.findIndex((item) => item.id === paymentId);
  if (paymentIndex === -1) {
    return { success: false, message: 'Pagamento não encontrado.' };
  }

  const removedPayment = data.payments.splice(paymentIndex, 1)[0];
  audit('remove', `Pagamento removido: ${removedPayment.id}`);
  persistState();
  return { success: true };
}

function approveStudentRequest(requestId) {
  const requestIndex = data.pendingStudents.findIndex((request) => request.id === requestId);
  if (requestIndex === -1) {
    return false;
  }

  const request = data.pendingStudents[requestIndex];
  data.students.push({
    id: request.id,
    name: request.name,
    password: request.password,
    approved: true,
    cardId: request.cardId,
    qrCode: request.cardId,
    guardian: request.guardian,
    gradeReport: [],
    absences: 0,
    balance: 0,
    schedule: [],
    notices: [
      { date: new Date().toLocaleDateString('pt-BR'), text: 'Conta aprovada pelo administrador. Bem-vindo ao sistema.' }
    ],
    notifications: [],
    attendance: []
  });

  data.pendingStudents.splice(requestIndex, 1);
  audit('approve', `Cadastro de aluno aprovado: ${request.name}`);
  persistState();
  return true;
}

function approveGuardianRequest(requestId) {
  const requestIndex = data.pendingGuardians.findIndex((request) => request.id === requestId);
  if (requestIndex === -1) {
    return false;
  }

  const request = data.pendingGuardians[requestIndex];
  data.guardians.push({
    id: request.id,
    studentId: request.studentId,
    name: request.name,
    phone: request.phone,
    approved: true
  });

  data.pendingGuardians.splice(requestIndex, 1);
  audit('approve', `Acesso de encarregado aprovado: ${request.name}`);
  persistState();
  return true;
}

function studentLogin(request) {
  const student = getStudentLogin(request.name, request.cardId, request.password);
  if (!student) {
    return { success: false, message: 'Credenciais inválidas ou conta não aprovada.' };
  }

  setCurrentSession({ type: 'student', userId: student.id, name: student.name });
  audit('login', `Aluno conectado: ${student.name}`);
  return { success: true };
}

function guardianLogin(request) {
  const guardian = getGuardianLogin(
    request.studentId,
    request.studentName,
    request.studentPassword,
    request.name,
    request.phone
  );

  if (!guardian) {
    return { success: false, message: 'Dados inválidos ou acesso não aprovado.' };
  }

  setCurrentSession({ type: 'guardian', userId: guardian.id, studentId: guardian.studentId, name: guardian.name });
  audit('login', `Encarregado conectado: ${guardian.name}`);
  return { success: true };
}

function adminLogin(request) {
  const admin = getAdminByCredentials(request.username, request.password);
  if (!admin) {
    return { success: false, message: 'Usuário ou senha inválidos.' };
  }

  setCurrentSession({ type: 'admin', userId: admin.id, username: admin.username, name: admin.name });
  audit('login', `Administrador conectado: ${admin.name}`);
  return { success: true };
}

function renderAuthStatus() {
  const statusElement = document.getElementById('authStatus');
  if (!statusElement) {
    return;
  }

  const session = getCurrentSession();
  if (!session) {
    statusElement.classList.add('hidden');
    return;
  }

  const profileLabel = session.type === 'admin' ? 'Administrador' : session.type === 'student' ? 'Aluno' : 'Encarregado';
  const portalPage = session.type === 'admin' ? 'dashboard.html' : session.type === 'student' ? 'student.html' : 'guardian.html';

  statusElement.classList.remove('hidden');
  statusElement.innerHTML = `
    <div class="status-bar">
      <div>
        <strong>Você está logado como ${profileLabel}</strong>
        <p>${session.name || profileLabel}</p>
      </div>
      <div class="status-actions">
        <a class="button button-secondary" href="${portalPage}">Ir ao portal</a>
        <button class="button button-secondary" id="logoutCurrentSession">Sair</button>
      </div>
    </div>
  `;

  const logoutButton = document.getElementById('logoutCurrentSession');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      clearCurrentSession();
      window.location.reload();
    });
  }
}

function initAuthForms() {
  const studentLoginForm = document.getElementById('studentLoginForm');
  const studentRegisterForm = document.getElementById('studentRegisterForm');
  const guardianLoginForm = document.getElementById('guardianLoginForm');
  const guardianRequestForm = document.getElementById('guardianRequestForm');
  const adminLoginForm = document.getElementById('adminLoginForm');

  if (studentLoginForm) {
    studentLoginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const result = studentLogin({
        name: document.getElementById('studentLoginName').value,
        cardId: document.getElementById('studentLoginCard').value,
        password: document.getElementById('studentLoginPassword').value
      });
      const message = document.getElementById('studentLoginMessage');
      if (result.success) {
        showMessage(message, 'Login de aluno realizado com sucesso.', 'success');
        setTimeout(() => (window.location.href = 'student.html'), 500);
      } else {
        showMessage(message, result.message, 'error');
      }
    });
  }

  if (studentRegisterForm) {
    studentRegisterForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const result = registerStudentRequest({
        name: document.getElementById('studentRegisterName').value,
        password: document.getElementById('studentRegisterPassword').value,
        cardId: document.getElementById('studentRegisterCard').value,
        guardian: document.getElementById('studentRegisterGuardian').value,
        guardianPhone: document.getElementById('studentRegisterGuardianPhone').value
      });
      const message = document.getElementById('studentRegisterMessage');
      if (result.success) {
        showMessage(message, 'Solicitação enviada. Aguarde aprovação do administrador.', 'success');
        studentRegisterForm.reset();
      } else {
        showMessage(message, result.message, 'error');
      }
    });
  }

  if (guardianLoginForm) {
    guardianLoginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const result = guardianLogin({
        studentId: document.getElementById('guardianLoginStudentId').value,
        studentName: document.getElementById('guardianLoginStudentName').value,
        studentPassword: document.getElementById('guardianLoginStudentPassword').value,
        name: document.getElementById('guardianLoginName').value,
        phone: document.getElementById('guardianLoginPhone').value
      });
      const message = document.getElementById('guardianLoginMessage');
      if (result.success) {
        showMessage(message, 'Login de encarregado realizado com sucesso.', 'success');
        setTimeout(() => (window.location.href = 'guardian.html'), 500);
      } else {
        showMessage(message, result.message, 'error');
      }
    });
  }

  if (guardianRequestForm) {
    guardianRequestForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const result = registerGuardianRequest({
        studentId: document.getElementById('guardianRequestStudentId').value,
        studentName: document.getElementById('guardianRequestStudentName').value,
        studentPassword: document.getElementById('guardianRequestStudentPassword').value,
        name: document.getElementById('guardianRequestName').value,
        phone: document.getElementById('guardianRequestPhone').value
      });
      const message = document.getElementById('guardianRequestMessage');
      if (result.success) {
        showMessage(message, 'Solicitação enviada. Aguarde aprovação do administrador.', 'success');
        guardianRequestForm.reset();
      } else {
        showMessage(message, result.message, 'error');
      }
    });
  }

  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const result = adminLogin({
        username: document.getElementById('adminLoginUsername').value,
        password: document.getElementById('adminLoginPassword').value
      });
      const message = document.getElementById('adminLoginMessage');
      if (result.success) {
        showMessage(message, 'Login do administrador realizado com sucesso.', 'success');
        setTimeout(() => (window.location.href = 'dashboard.html'), 500);
      } else {
        showMessage(message, result.message, 'error');
      }
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  renderAuthStatus();
  initAuthTabs();
  initFormToggles();
  initAuthForms();
});
