const dashboardElements = {
  kpiGrid: document.getElementById('kpiGrid'),
  moduleGrid: document.getElementById('moduleGrid'),
  dashboardStatus: document.getElementById('dashboardStatus'),
  generalNotices: document.getElementById('generalNotices'),
  calendarEvents: document.getElementById('calendarEvents'),
  pendingRequests: document.getElementById('pendingRequests'),
  auditLog: document.getElementById('auditLog'),
  pendingStudentsCount: document.getElementById('pendingStudentsCount'),
  pendingGuardiansCount: document.getElementById('pendingGuardiansCount'),
  activeStudentsCount: document.getElementById('activeStudentsCount'),
  activeGuardiansCount: document.getElementById('activeGuardiansCount'),
  adminLogoutButton: document.getElementById('adminLogoutButton'),
  adminGate: document.getElementById('adminGate'),
  adminContent: document.getElementById('adminContent'),
  dashboardPasswordForm: document.getElementById('dashboardPasswordForm'),
  dashboardPasswordInput: document.getElementById('dashboardPassword'),
  dashboardPasswordMessage: document.getElementById('dashboardPasswordMessage'),
  studentList: document.getElementById('studentList'),
  guardianList: document.getElementById('guardianList'),
  moduleDetail: document.getElementById('moduleDetail')
};
let selectedModuleCategory = null;

const dashboardData = {
  kpis: [
    { label: 'Alunos presentes', value: '174', icon: '👤' },
    { label: 'Alunos ausentes', value: '28', icon: '🚫' },
    { label: 'Receita do dia', value: 'R$ 4.620', icon: '💰' },
    { label: 'Mensalidades atrasadas', value: '12', icon: '⏳' },
    { label: 'Eventos do dia', value: '3', icon: '📅' }
  ],
  modules: [
    {
      category: 'Gestão Académica',
      items: [
        'Cadastro de alunos',
        'Cadastro de professores',
        'Cadastro de turmas',
        'Disciplinas',
        'Horários',
        'Lançamento de notas',
        'Controle de faltas',
        'Boletins'
      ]
    },
    {
      category: 'Gestão Financeira',
      items: [
        'Mensalidades',
        'Multas por atraso',
        'Recibos',
        'Relatórios financeiros',
        'Confirmação de pagamentos'
      ]
    },
    {
      category: 'Cartão Inteligente',
      items: [
        'Registro de entrada/saída',
        'Presença automática',
        'Pagamentos na cantina',
        'Biblioteca',
        'Identificação na secretaria'
      ]
    },
    {
      category: 'Biblioteca',
      items: ['Cadastro de livros', 'Empréstimos', 'Devoluções', 'Multas']
    },
    {
      category: 'Cantina',
      items: ['Produtos', 'Compras com cartão', 'Saldo do cartão', 'Extrato']
    },
    {
      category: 'Relatórios',
      items: ['Frequência', 'Desempenho', 'Financeiro', 'Estatísticas']
    }
  ],
  notices: [
    'Reunião de direção às 10h',
    'Visita dos encarregados na sexta-feira',
    'Entrega de boletins no final do mês'
  ],
  events: [
    'Prova de Matemática - 2ª feira',
    'Palestra de orientação profissional - 4ª feira',
    'Reunião de responsáveis - 6ª feira'
  ]
};

function validateAdminPassword(password) {
  if (!password) {
    return false;
  }
  return data.admins.some((admin) => admin.password === password);
}

function renderKPIs() {
  dashboardElements.kpiGrid.innerHTML = dashboardData.kpis
    .map(
      (item) => `
      <div class="kpi-card">
        <span class="kpi-icon">${item.icon}</span>
        <strong>${item.value}</strong>
        <p>${item.label}</p>
      </div>
    `
    )
    .join('');
}

function renderModules() {
  dashboardElements.moduleGrid.innerHTML = dashboardData.modules
    .map(
      (module) => `
      <div class="module-card card" data-module="${module.category}">
        <h3>${module.category}</h3>
        <p class="module-intro">${module.items.slice(0, 3).join(', ')}${module.items.length > 3 ? '...' : ''}</p>
        <button class="button button-secondary module-select" data-module="${module.category}">Ver detalhes</button>
      </div>
    `
    )
    .join('');
  if (!selectedModuleCategory && dashboardData.modules.length) {
    selectedModuleCategory = dashboardData.modules[0].category;
  }
  renderModuleDetail();
}

function renderNotices() {
  dashboardElements.generalNotices.innerHTML = dashboardData.notices
    .map((notice) => `<li>${notice}</li>`)
    .join('');
  dashboardElements.calendarEvents.innerHTML = dashboardData.events
    .map((event) => `<li>${event}</li>`)
    .join('');
}

function renderDashboardStatus() {
  const approvedStudents = data.students.filter((student) => student.approved).length;
  const approvedGuardians = data.guardians.filter((guardian) => guardian.approved).length;

  dashboardElements.dashboardStatus.innerHTML = `
    <strong>Administração segura</strong>
    <p>Monitorize solicitações, aprove cadastros e acompanhe o uso do sistema em tempo real.</p>
    <p class="subtle">Alunos aprovados: ${approvedStudents} · Encarregados aprovados: ${approvedGuardians}</p>
  `;
}

function renderPendingRequests() {
  const studentRequests = data.pendingStudents;
  const guardianRequests = data.pendingGuardians;

  if (!dashboardElements.pendingRequests) {
    return;
  }

  if (!studentRequests.length && !guardianRequests.length) {
    dashboardElements.pendingRequests.innerHTML = '<p class="note">Nenhuma solicitação pendente no momento.</p>';
    return;
  }

  const studentMarkup = studentRequests
    .map(
      (request) => `
        <div class="pending-card">
          <strong>Aluno: ${request.name}</strong>
          <p>ID: ${request.id}</p>
          <p>Responsável: ${request.guardian} • ${request.guardianPhone}</p>
          <button class="button button-primary approve-button" data-type="student" data-id="${request.id}">Aprovar cadastro</button>
        </div>
      `
    )
    .join('');

  const guardianMarkup = guardianRequests
    .map(
      (request) => `
        <div class="pending-card">
          <strong>Encarregado: ${request.name}</strong>
          <p>Aluno: ${request.studentId}</p>
          <p>Telefone: ${request.phone}</p>
          <button class="button button-primary approve-button" data-type="guardian" data-id="${request.id}">Aprovar acesso</button>
        </div>
      `
    )
    .join('');

  dashboardElements.pendingRequests.innerHTML = `${studentMarkup}${guardianMarkup}`;
  dashboardElements.pendingStudentsCount.textContent = studentRequests.length;
  dashboardElements.pendingGuardiansCount.textContent = guardianRequests.length;
}

function renderActiveUsers() {
  dashboardElements.activeStudentsCount.textContent = data.students.filter((student) => student.approved).length;
  dashboardElements.activeGuardiansCount.textContent = data.guardians.filter((guardian) => guardian.approved).length;
}

function renderStudentList() {
  const approvedStudents = data.students.filter((student) => student.approved);
  if (!approvedStudents.length) {
    dashboardElements.studentList.innerHTML = '<p class="note">Ainda não há alunos aprovados.</p>';
    return;
  }

  dashboardElements.studentList.innerHTML = approvedStudents
    .slice(0, 6)
    .map(
      (student) => `
        <div class="list-item">
          <strong>${student.name}</strong>
          <p>${student.guardian} • ${student.cardId}</p>
          <p class="subtle">Faltas: ${student.absences} • Saldo: ${formatCurrency(student.balance)}</p>
        </div>
      `
    )
    .join('');
}

function renderGuardianList() {
  const approvedGuardians = data.guardians.filter((guardian) => guardian.approved);
  if (!approvedGuardians.length) {
    dashboardElements.guardianList.innerHTML = '<p class="note">Ainda não há encarregados aprovados.</p>';
    return;
  }

  dashboardElements.guardianList.innerHTML = approvedGuardians
    .slice(0, 6)
    .map(
      (guardian) => `
        <div class="list-item">
          <strong>${guardian.name}</strong>
          <p>Aluno: ${guardian.studentId}</p>
          <p class="subtle">Telefone: ${guardian.phone}</p>
        </div>
      `
    )
    .join('');
}

function populateGuardianStudentOptions() {
  const select = document.getElementById('guardianAddStudent');
  if (!select) {
    return;
  }
  select.innerHTML = data.students
    .filter((student) => student.approved)
    .map((student) => `<option value="${student.id}">${student.name}</option>`)
    .join('');
}

function renderStudentManagementList() {
  const container = document.getElementById('studentManagementList');
  if (!container) {
    return;
  }

  const approvedStudents = data.students.filter((student) => student.approved);
  if (!approvedStudents.length) {
    container.innerHTML = '<p class="note">Nenhum aluno cadastrado.</p>';
    return;
  }

  container.innerHTML = approvedStudents
    .map(
      (student) => `
        <div class="pending-card">
          <strong>${student.name}</strong>
          <p>Cartão: ${student.cardId}</p>
          <p class="subtle">Encarregado: ${student.guardian}</p>
          <button class="button button-secondary remove-student-button" data-id="${student.id}">Remover aluno</button>
        </div>
      `
    )
    .join('');
}

function renderGuardianManagementList() {
  const container = document.getElementById('guardianManagementList');
  if (!container) {
    return;
  }

  const approvedGuardians = data.guardians.filter((guardian) => guardian.approved);
  if (!approvedGuardians.length) {
    container.innerHTML = '<p class="note">Nenhum encarregado cadastrado.</p>';
    return;
  }

  container.innerHTML = approvedGuardians
    .map(
      (guardian) => `
        <div class="pending-card">
          <strong>${guardian.name}</strong>
          <p>Aluno: ${guardian.studentId}</p>
          <p class="subtle">Telefone: ${guardian.phone}</p>
          <button class="button button-secondary remove-guardian-button" data-id="${guardian.id}">Remover encarregado</button>
        </div>
      `
    )
    .join('');
}

function renderManagementLists() {
  renderStudentManagementList();
  renderGuardianManagementList();
}

function renderModuleDetail() {
  const module = dashboardData.modules.find((item) => item.category === selectedModuleCategory) || dashboardData.modules[0];
  if (!module || !dashboardElements.moduleDetail) {
    return;
  }

  dashboardElements.moduleDetail.innerHTML = `
    <strong>${module.category}</strong>
    <p>${module.items.length} recursos disponíveis.</p>
    <ul class="list-reset module-detail-list">
      ${module.items.map((item) => `<li>${item}</li>`).join('')}
    </ul>
  `;
}

function handleModuleSelection(event) {
  const button = event.target.closest('.module-select');
  if (!button) {
    return;
  }

  const moduleName = button.dataset.module;
  selectedModuleCategory = moduleName;
  renderModuleDetail();
}

function renderAuditLog() {
  if (!dashboardElements.auditLog) {
    return;
  }

  if (!data.logs.length) {
    dashboardElements.auditLog.innerHTML = '<p class="note">Nenhum evento registrado ainda.</p>';
    return;
  }

  dashboardElements.auditLog.innerHTML = data.logs
    .slice(0, 10)
    .map(
      (entry) => `
        <div class="log-row">
          <span class="log-time">${new Date(entry.timestamp).toLocaleString('pt-BR')}</span>
          <p>${entry.message}</p>
        </div>
      `
    )
    .join('');
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
      { date: new Date().toLocaleDateString('pt-BR'), text: 'Conta aprovada pelo administrador.' }
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

function handleApproveRequest(event) {
  const button = event.target.closest('.approve-button');
  if (!button) {
    return;
  }

  const requestType = button.dataset.type;
  const requestId = button.dataset.id;

  if (requestType === 'student' && approveStudentRequest(requestId)) {
    renderPendingRequests();
    renderActiveUsers();
    renderDashboardStatus();
    renderAuditLog();
  }

  if (requestType === 'guardian' && approveGuardianRequest(requestId)) {
    renderPendingRequests();
    renderActiveUsers();
    renderDashboardStatus();
    renderAuditLog();
  }
}

function lockDashboard() {
  dashboardElements.adminGate?.classList.remove('hidden');
  dashboardElements.adminContent?.classList.add('hidden');
  dashboardElements.adminLogoutButton?.classList.add('hidden');
}

function unlockDashboard() {
  dashboardElements.adminGate?.classList.add('hidden');
  dashboardElements.adminContent?.classList.remove('hidden');
  dashboardElements.adminLogoutButton?.classList.remove('hidden');
  dashboardElements.dashboardPasswordInput.value = '';
  if (dashboardElements.dashboardPasswordMessage) {
    dashboardElements.dashboardPasswordMessage.textContent = '';
    dashboardElements.dashboardPasswordMessage.classList.remove('error');
  }

  populateGuardianStudentOptions();
  renderDashboardStatus();
  renderKPIs();
  renderModules();
  renderNotices();
  renderPendingRequests();
  renderActiveUsers();
  renderStudentList();
  renderGuardianList();
  renderManagementLists();
  renderAuditLog();
}

function handlePasswordSubmit(event) {
  event.preventDefault();
  const password = dashboardElements.dashboardPasswordInput?.value;

  if (validateAdminPassword(password)) {
    setCurrentSession({ type: 'admin', authenticated: true, name: 'Administrador' });
    unlockDashboard();
    return;
  }

  if (dashboardElements.dashboardPasswordMessage) {
    dashboardElements.dashboardPasswordMessage.textContent = 'Senha incorreta. Tente novamente.';
    dashboardElements.dashboardPasswordMessage.classList.add('error');
  }
}

function handleAdminManagementAction(event) {
  const removeStudentButton = event.target.closest('.remove-student-button');
  const removeGuardianButton = event.target.closest('.remove-guardian-button');

  if (removeStudentButton) {
    const studentId = removeStudentButton.dataset.id;
    const result = removeStudent(studentId);
    if (result.success) {
      renderStudentList();
      renderStudentManagementList();
      renderGuardianList();
      renderGuardianManagementList();
      renderPendingRequests();
      renderActiveUsers();
      renderDashboardStatus();
      renderAuditLog();
    }
    return;
  }

  if (removeGuardianButton) {
    const guardianId = removeGuardianButton.dataset.id;
    const result = removeGuardian(guardianId);
    if (result.success) {
      renderGuardianList();
      renderGuardianManagementList();
      renderAuditLog();
    }
    return;
  }
}

function bindDashboardEvents() {
  dashboardElements.pendingRequests?.addEventListener('click', handleApproveRequest);
  dashboardElements.moduleGrid?.addEventListener('click', handleModuleSelection);
  dashboardElements.dashboardPasswordForm?.addEventListener('submit', handlePasswordSubmit);
  dashboardElements.adminLogoutButton?.addEventListener('click', () => {
    clearCurrentSession();
    lockDashboard();
    dashboardElements.dashboardPasswordInput?.focus();
  });

  document.getElementById('studentAddForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const result = addStudent({
      name: document.getElementById('studentAddName').value,
      cardId: document.getElementById('studentAddCard').value,
      password: document.getElementById('studentAddPassword').value,
      guardian: document.getElementById('studentAddGuardian').value,
      guardianPhone: document.getElementById('studentAddGuardianPhone').value
    });
    const message = document.getElementById('studentAddMessage');
    if (result.success) {
      showMessage(message, 'Aluno cadastrado com sucesso.', 'success');
      document.getElementById('studentAddForm').reset();
      populateGuardianStudentOptions();
      renderStudentList();
      renderStudentManagementList();
      renderActiveUsers();
      renderDashboardStatus();
    } else {
      showMessage(message, result.message, 'error');
    }
  });

  document.getElementById('guardianAddForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const result = addGuardian({
      studentId: document.getElementById('guardianAddStudent').value,
      name: document.getElementById('guardianAddName').value,
      phone: document.getElementById('guardianAddPhone').value
    });
    const message = document.getElementById('guardianAddMessage');
    if (result.success) {
      showMessage(message, 'Encarregado cadastrado com sucesso.', 'success');
      document.getElementById('guardianAddForm').reset();
      renderGuardianList();
      renderGuardianManagementList();
      renderDashboardStatus();
    } else {
      showMessage(message, result.message, 'error');
    }
  });

  document.getElementById('studentManagementList')?.addEventListener('click', handleAdminManagementAction);
  document.getElementById('guardianManagementList')?.addEventListener('click', handleAdminManagementAction);
}

window.addEventListener('DOMContentLoaded', () => {
  bindDashboardEvents();
  if (isAdminSession()) {
    unlockDashboard();
  } else {
    lockDashboard();
  }
});
