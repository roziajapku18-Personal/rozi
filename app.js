// ===========================
// Data Storage (LocalStorage)
// ===========================
const DB = {
  employees: JSON.parse(localStorage.getItem('employees') || '[]'),
  attendance: JSON.parse(localStorage.getItem('attendance') || '[]'),

  save() {
    localStorage.setItem('employees', JSON.stringify(this.employees));
    localStorage.setItem('attendance', JSON.stringify(this.attendance));
  }
};

// ===========================
// Init Page Handler
// ===========================
function initPage(page) {
  if (page === 'employees') renderEmployees();
  if (page === 'attendance') renderAttendance();
  if (page === 'report') renderReport();
}

// ===========================
// EMPLOYEES PAGE
// ===========================
function renderEmployees() {
  const tbody = document.querySelector('#empTable tbody');
  const btnAdd = document.getElementById('btnAdd');
  const modal = document.getElementById('modal');
  const form = document.getElementById('empForm');
  const btnCancel = document.getElementById('btnCancel');

  let editingIndex = null;

  function refresh() {
    tbody.innerHTML = '';
    DB.employees.forEach((emp, i) => {
      const row = `
        <tr>
          <td>${i + 1}</td>
          <td>${emp.name}</td>
          <td>${emp.nik}</td>
          <td>${emp.role}</td>
          <td>
            <button class="btn ghost" onclick="editEmp(${i})">Edit</button>
            <button class="btn ghost" onclick="delEmp(${i})">Hapus</button>
          </td>
        </tr>`;
      tbody.innerHTML += row;
    });
  }

  window.editEmp = (i) => {
    editingIndex = i;
    const emp = DB.employees[i];
    form.name.value = emp.name;
    form.nik.value = emp.nik;
    form.role.value = emp.role;
    document.getElementById('modalTitle').textContent = 'Edit Karyawan';
    modal.classList.remove('hidden');
  };

  window.delEmp = (i) => {
    DB.employees.splice(i, 1);
    DB.save();
    refresh();
  };

  btnAdd.onclick = () => {
    editingIndex = null;
    form.reset();
    document.getElementById('modalTitle').textContent = 'Tambah Karyawan';
    modal.classList.remove('hidden');
  };

  btnCancel.onclick = () => modal.classList.add('hidden');

  form.onsubmit = (e) => {
    e.preventDefault();
    const data = {
      name: form.name.value,
      nik: form.nik.value,
      role: form.role.value
    };

    if (editingIndex === null) DB.employees.push(data);
    else DB.employees[editingIndex] = data;

    DB.save();
    modal.classList.add('hidden');
    refresh();
  };

  refresh();
}

// ===========================
// ATTENDANCE PAGE
// ===========================
function renderAttendance() {
  const tbody = document.querySelector('#attTable tbody');
  const btnTake = document.getElementById('btnTake');

  function refresh() {
    tbody.innerHTML = '';
    DB.attendance.forEach((a, i) => {
      const row = `
        <tr>
          <td>${i + 1}</td>
          <td>${a.name}</td>
          <td>${a.date}</td>
          <td>${a.time}</td>
          <td>${a.status}</td>
        </tr>`;
      tbody.innerHTML += row;
    });
  }

  btnTake.onclick = () => {
    if (DB.employees.length === 0) return alert('Belum ada karyawan!');

    const emp = DB.employees[Math.floor(Math.random() * DB.employees.length)];
    const now = new Date();

    DB.attendance.push({
      name: emp.name,
      date: now.toLocaleDateString('id-ID'),
      time: now.toLocaleTimeString('id-ID'),
      status: 'Hadir'
    });

    DB.save();
    refresh();
  };

  refresh();
}

// ===========================
// REPORT PAGE
// ===========================
function renderReport() {
  const tbody = document.querySelector('#reportTable tbody');
  const btnExport = document.getElementById('btnExport');

  function refresh() {
    tbody.innerHTML = '';

    const summary = {};

    DB.attendance.forEach((a) => {
      if (!summary[a.name]) summary[a.name] = { had: 0, izin: 0, alpha: 0 };
      summary[a.name].had++;
    });

    Object.keys(summary).forEach((name, i) => {
      const s = summary[name];
      tbody.innerHTML += `
        <tr>
          <td>${i + 1}</td>
          <td>${name}</td>
          <td>${s.had}</td>
          <td>${s.izin}</td>
          <td>${s.alpha}</td>
          <td>${s.had + s.izin + s.alpha}</td>
        </tr>`;
    });
  }

  btnExport.onclick = () => {
    alert('Export laporan berhasil (simulasi).');
  };

  refresh();
}