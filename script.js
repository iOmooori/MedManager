// =====================
// データ管理
// =====================
function loadData() {
  const raw = localStorage.getItem('medmanager');
  return raw ? JSON.parse(raw) : {};
}

function saveData(data) {
  localStorage.setItem('medmanager', JSON.stringify(data));
}

function loadHospitals() {
  const raw = localStorage.getItem('medmanager_hospitals');
  return raw ? JSON.parse(raw) : [];
}

function saveHospitals(hospitals) {
  localStorage.setItem('medmanager_hospitals', JSON.stringify(hospitals));
}

// =====================
// ページ管理
// =====================
let currentPage = 'home';

function showHome() {
  currentPage = 'home';
  document.getElementById('pending-area').classList.remove('hidden');
  document.getElementById('input-area').classList.remove('hidden');
  document.getElementById('admission-area').classList.remove('hidden');
  document.getElementById('register-area').classList.remove('hidden');
  document.getElementById('patient-list-area').classList.add('hidden');
  document.getElementById('patient-detail-area').classList.add('hidden');
  document.getElementById('hospital-master-area').classList.add('hidden');
  document.getElementById('btn-patient-list').classList.remove('hidden');
  document.getElementById('btn-hospital-master').classList.remove('hidden');
  document.getElementById('btn-back-to-list').classList.add('hidden');
  renderPending();
  updatePatientSelects();
  updateHospitalSelects();
  updateDrugSuggestions();
}

function showPatientList() {
  currentPage = 'list';
  document.getElementById('pending-area').classList.add('hidden');
  document.getElementById('input-area').classList.add('hidden');
  document.getElementById('admission-area').classList.add('hidden');
  document.getElementById('register-area').classList.add('hidden');
  document.getElementById('patient-list-area').classList.remove('hidden');
  document.getElementById('patient-detail-area').classList.add('hidden');
  document.getElementById('hospital-master-area').classList.add('hidden');
  document.getElementById('btn-patient-list').classList.add('hidden');
  document.getElementById('btn-hospital-master').classList.add('hidden');
  document.getElementById('btn-back-to-list').classList.add('hidden');
  renderPatientList();
}

function showPatientDetail(patientId) {
  currentPage = 'detail';
  currentPatientId = patientId;
  document.getElementById('pending-area').classList.add('hidden');
  document.getElementById('input-area').classList.add('hidden');
  document.getElementById('admission-area').classList.add('hidden');
  document.getElementById('register-area').classList.add('hidden');
  document.getElementById('patient-list-area').classList.add('hidden');
  document.getElementById('patient-detail-area').classList.remove('hidden');
  document.getElementById('hospital-master-area').classList.add('hidden');
  document.getElementById('btn-patient-list').classList.add('hidden');
  document.getElementById('btn-hospital-master').classList.add('hidden');
  document.getElementById('btn-back-to-list').classList.remove('hidden');
  document.getElementById('detail-patient-id').textContent = `患者番号：${patientId}`;
  renderPatientDetail(patientId);
}

function showHospitalMaster() {
  currentPage = 'hospital';
  document.getElementById('pending-area').classList.add('hidden');
  document.getElementById('input-area').classList.add('hidden');
  document.getElementById('admission-area').classList.add('hidden');
  document.getElementById('register-area').classList.add('hidden');
  document.getElementById('patient-list-area').classList.add('hidden');
  document.getElementById('patient-detail-area').classList.add('hidden');
  document.getElementById('hospital-master-area').classList.remove('hidden');
  document.getElementById('btn-patient-list').classList.add('hidden');
  document.getElementById('btn-hospital-master').classList.add('hidden');
  document.getElementById('btn-back-to-list').classList.add('hidden');
  renderHospitalList();
}

// =====================
// 病院マスタ
// =====================
function renderHospitalList() {
  const hospitals = loadHospitals();
  const ul = document.getElementById('hospital-list');
  ul.innerHTML = '';

  if (hospitals.length === 0) {
    ul.innerHTML = '<li>登録なし</li>';
    return;
  }

  hospitals.forEach((name, index) => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = name;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '削除';
    deleteBtn.className = 'btn-delete-hospital';
    deleteBtn.addEventListener('click', () => {
      const ok = confirm(`「${name}」を削除しますか？`);
      if (!ok) return;
      const h = loadHospitals();
      h.splice(index, 1);
      saveHospitals(h);
      renderHospitalList();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    ul.appendChild(li);
  });
}

document.getElementById('btn-add-hospital').addEventListener('click', () => {
  const name = document.getElementById('input-new-hospital').value.trim();
  if (!name) { alert('病院名を入力してください'); return; }
  const hospitals = loadHospitals();
  if (hospitals.includes(name)) { alert('その病院名はすでに登録されています'); return; }
  hospitals.push(name);
  hospitals.sort();
  saveHospitals(hospitals);
  document.getElementById('input-new-hospital').value = '';
  renderHospitalList();
});

function updateHospitalSelects() {
  const hospitals = loadHospitals();
  ['select-hospital'].forEach(selectId => {
    const select = document.getElementById(selectId);
    if (!select) return;
    const current = select.value;
    select.innerHTML = '<option value="">--- 選択してください ---</option>';
    hospitals.forEach(name => {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      select.appendChild(opt);
    });
    if (current) select.value = current;
  });
}

// =====================
// 患者番号セレクトを更新
// =====================
function updatePatientSelects() {
  const data = loadData();
  ['select-patient', 'select-admission-patient'].forEach(selectId => {
    const select = document.getElementById(selectId);
    if (!select) return;
    const current = select.value;
    select.innerHTML = '<option value="">--- 選択してください ---</option>';
    Object.keys(data).forEach(id => {
      const opt = document.createElement('option');
      opt.value = id;
      opt.textContent = `患者番号：${id}`;
      select.appendChild(opt);
    });
    if (current) select.value = current;
  });
}

// =====================
// 薬品名セレクトを更新
// =====================
function updateDrugSelects(patientId) {
  const data = loadData();
  const meds = patientId && data[patientId] ? data[patientId].currentMeds : [];
  ['select-drug-stop', 'select-drug-dose', 'select-drug-switch-before'].forEach(selectId => {
    const select = document.getElementById(selectId);
    if (!select) return;
    select.innerHTML = '<option value="">--- 選択してください ---</option>';
    meds.forEach(med => {
      const opt = document.createElement('option');
      opt.value = med.name;
      opt.textContent = med.name;
      select.appendChild(opt);
    });
  });
}

document.getElementById('select-patient').addEventListener('change', function() {
  updateDrugSelects(this.value);
});

// 全患者共通の薬リストを作る（「追加」の入力候補用）
function updateDrugSuggestions() {
  const data = loadData();
  const allDrugs = new Set(); // Setは重複を自動で除いてくれる箱

  Object.values(data).forEach(patient => {
    patient.history.forEach(record => {
      if (record.drug) allDrugs.add(record.drug);
      if (record.drugAfter) allDrugs.add(record.drugAfter);
    });
    patient.currentMeds.forEach(med => allDrugs.add(med.name));
  });

  const datalist = document.getElementById('drug-suggestions');
  datalist.innerHTML = '';
  allDrugs.forEach(drug => {
    const opt = document.createElement('option');
    opt.value = drug;
    datalist.appendChild(opt);
  });
}

// =====================
// 患者一覧
// =====================
function renderPatientList() {
  const data = loadData();
  const ul = document.getElementById('patient-list');
  const leftUl = document.getElementById('left-patient-list');
  ul.innerHTML = '';
  leftUl.innerHTML = '';

  const activeIds = Object.keys(data).filter(id => !data[id].isLeft);
  const leftIds = Object.keys(data).filter(id => data[id].isLeft);

  if (activeIds.length === 0) {
    ul.innerHTML = '<li>登録された患者なし</li>';
  }

  activeIds.forEach(patientId => {
    const patient = data[patientId];
    const hasPending = patient.checklist && patient.checklist.some(item => !item.done);
    const isAdmitted = checkIsAdmitted(patient);

    const li = document.createElement('li');

    const left = document.createElement('span');
    if (isAdmitted) {
      const label = document.createElement('span');
      label.className = 'admitted-label';
      label.textContent = '入院中';
      left.appendChild(label);
    }
    left.appendChild(document.createTextNode(`患者番号：${patientId}`));
    li.appendChild(left);

    if (hasPending) {
      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = '!';
      li.appendChild(badge);
    }
    li.addEventListener('click', () => showPatientDetail(patientId));
    ul.appendChild(li);
  });

    if (leftIds.length === 0) {
      leftUl.innerHTML = '<li>退居した患者なし</li>';
    } else {
      leftIds.forEach(patientId => {
        const li = document.createElement('li');
        const patient = data[patientId];
        li.textContent = `患者番号：${patientId}　（退居日：${patient.leftDate || '不明'}）`;
        li.addEventListener('click', () => showPatientDetail(patientId));
        leftUl.appendChild(li);
      });
    }
  }

document.getElementById('btn-toggle-left').addEventListener('click', () => {
  const list = document.getElementById('left-patient-list');
  const btn = document.getElementById('btn-toggle-left');
  const isHidden = list.classList.contains('hidden');
  list.classList.toggle('hidden');
  btn.textContent = isHidden ? '▼ 退居した患者一覧' : '▶ 退居した患者一覧';
});

document.getElementById('btn-leave-patient').addEventListener('click', () => {
  document.getElementById('leave-patient-id').textContent = currentPatientId;
  document.getElementById('leave-date').value = new Date().toISOString().split('T')[0];
  document.getElementById('leave-overlay').classList.remove('hidden');
});

document.getElementById('btn-leave-confirm').addEventListener('click', () => {
  const dateVal = document.getElementById('leave-date').value;
  if (!dateVal) { alert('退居日を入力してください'); return; }

  const data = loadData();
  data[currentPatientId].isLeft = true;
  data[currentPatientId].leftDate = convertDateForDisplay(dateVal);
  saveData(data);

  document.getElementById('leave-overlay').classList.add('hidden');
  showPatientList();
});

document.getElementById('btn-leave-cancel').addEventListener('click', () => {
  document.getElementById('leave-overlay').classList.add('hidden');
});

// 入退院履歴の一番新しい記録が「入院」かどうか判定
function checkIsAdmitted(patient) {
  const admissions = patient.admissions || [];
  if (admissions.length === 0) return false;
  const latest = admissions[admissions.length - 1];
  return latest.kind === '入院';
}

// =====================
// 新規患者登録
// =====================
function addMedRow() {
  const hospitals = loadHospitals();
  const container = document.getElementById('new-med-list');
  const row = document.createElement('div');
  row.className = 'med-row';

  const drugInput = document.createElement('input');
  drugInput.type = 'text';
  drugInput.placeholder = '薬品名（例）ロキソニン60mg';
  drugInput.setAttribute('list', 'drug-suggestions'); // ← これ追加

  const hospitalSelect = document.createElement('select');
  hospitalSelect.innerHTML = '<option value="">病院（任意）</option>';
  hospitals.forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    hospitalSelect.appendChild(opt);
  });

  const noteInput = document.createElement('input');
  noteInput.type = 'text';
  noteInput.placeholder = '備考（任意）';

  const removeBtn = document.createElement('button');
  removeBtn.textContent = '×';
  removeBtn.className = 'btn-remove-med';
  removeBtn.addEventListener('click', () => container.removeChild(row));

  row.appendChild(drugInput);
  row.appendChild(hospitalSelect);
  row.appendChild(noteInput);
  row.appendChild(removeBtn);
  container.appendChild(row);
}

document.getElementById('btn-add-med-row').addEventListener('click', addMedRow);

document.getElementById('btn-register-patient').addEventListener('click', () => {
  const id = document.getElementById('input-new-patient-id').value.trim();
  if (!id) { alert('患者番号を入力してください'); return; }

  const data = loadData();
  if (data[id]) { alert('その患者番号はすでに登録されています'); return; }

  // 薬の行を収集
  const rows = document.querySelectorAll('#new-med-list .med-row');
  const meds = [];
  rows.forEach(row => {
    const inputs = row.querySelectorAll('input');
    const select = row.querySelector('select');
    const name = inputs[0].value.trim();
    if (!name) return;
    meds.push({
      name,
      hospital: select.value,
      note: inputs[1].value.trim()
    });
  });

  data[id] = { history: [], checklist: [], currentMeds: meds, admissions: [] };
  saveData(data);

  // フォームリセット
  document.getElementById('input-new-patient-id').value = '';
  document.getElementById('new-med-list').innerHTML = '';

  updatePatientSelects();
  alert(`患者番号 ${id} を登録しました`);
});

// =====================
// 変更内容ボタンの選択
// =====================
let selectedType = null;

document.querySelectorAll('.type-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedType = btn.dataset.type;

    document.getElementById('group-drug').classList.toggle('hidden', selectedType !== '追加');
    document.getElementById('group-drug-stop').classList.toggle('hidden', selectedType !== '中止');
    document.getElementById('group-drug-dose').classList.toggle('hidden', selectedType !== '用量変更');
    document.getElementById('group-drug-switch').classList.toggle('hidden', selectedType !== '薬品切替');
    document.getElementById('group-hospital').classList.toggle('hidden', selectedType !== '追加');
    document.getElementById('group-reason').classList.toggle('hidden', selectedType === '薬品切替');
    document.getElementById('group-dose').classList.toggle('hidden', selectedType !== '用量変更');

    const patientId = document.getElementById('select-patient').value;
    if (patientId) updateDrugSelects(patientId);
    updateHospitalSelects();
  });
});

// =====================
// 患者詳細
// =====================
let currentPatientId = null;

function renderPatientDetail(patientId) {
  const data = loadData();
  const patient = data[patientId];

  // 現在の服用薬（病院ごとにグループ化して表示）
  const medsContainer = document.getElementById('current-meds');
  medsContainer.innerHTML = '';

  if (!patient.currentMeds || patient.currentMeds.length === 0) {
    medsContainer.innerHTML = '<p>登録なし</p>';
  } else {
    // 病院ごとにグループ化
    const groups = {};
    patient.currentMeds.forEach(med => {
      const key = med.hospital || '病院未登録';
      if (!groups[key]) groups[key] = [];
      groups[key].push(med);
    });

    // 病院名でソートして表示
    Object.keys(groups).sort().forEach(hospitalName => {
      const groupDiv = document.createElement('div');
      groupDiv.className = 'med-hospital-group';

      const label = document.createElement('div');
      label.className = 'med-hospital-label';
      label.textContent = hospitalName;
      groupDiv.appendChild(label);

      groups[hospitalName].forEach(med => {
        const card = document.createElement('div');
        card.className = 'med-card';

        const nameDiv = document.createElement('div');
        nameDiv.className = 'med-name';
        nameDiv.textContent = med.name;
        card.appendChild(nameDiv);

        if (med.note) {
          const noteDiv = document.createElement('div');
          noteDiv.className = 'med-note';
          noteDiv.textContent = `備考：${med.note}`;
          card.appendChild(noteDiv);
        }

        groupDiv.appendChild(card);
      });

      medsContainer.appendChild(groupDiv);
    });
  }

  // 処方変更履歴
  const historyList = document.getElementById('history-list');
  historyList.innerHTML = '';
  patient.history.slice().reverse().forEach((record, revIndex) => {
    const realIndex = patient.history.length - 1 - revIndex;
    const li = document.createElement('li');
    const typeClass = {
      '追加': 'history-add',
      '中止': 'history-stop',
      '用量変更': 'history-change',
      '薬品切替': 'history-change'
    };
    li.className = typeClass[record.type] || '';

    let text = `${record.date}　${record.type}　`;
    if (record.type === '薬品切替') {
      text += `${record.drugBefore} → ${record.drugAfter}`;
    } else {
      text += record.drug;
      if (record.type === '用量変更') text += `　→ ${record.doseAfter}`;
      if (record.hospital) text += `　(${record.hospital})`;
      if (record.reason) text += `　理由：${record.reason}`;
    }

    const span = document.createElement('span');
    span.textContent = text;

    const actions = document.createElement('div');
    actions.className = 'history-actions';

    const editBtn = document.createElement('button');
    editBtn.textContent = '編集';
    editBtn.className = 'btn-edit';
    editBtn.addEventListener('click', () => openEditOverlay(patientId, realIndex));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '削除';
    deleteBtn.className = 'btn-delete';
    deleteBtn.addEventListener('click', () => {
      const ok = confirm(`この履歴を削除しますか？\n「${text}」`);
      if (!ok) return;
      const d = loadData();
      d[patientId].history.splice(realIndex, 1);
      d[patientId].currentMeds = recalcCurrentMeds(d[patientId].history, d[patientId].currentMeds);
      saveData(d);
      renderPatientDetail(patientId);
    });

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    li.appendChild(span);
    li.appendChild(actions);
    historyList.appendChild(li);
  });

  renderAdmissionList(patientId);
  renderChecklist(patientId);
}

// 現在の服用薬を履歴から再計算
function recalcCurrentMeds(history, currentMeds) {
  const meds = [...currentMeds];
  history.forEach(record => {
    if (record.type === '追加') {
      if (!meds.find(m => m.name === record.drug)) {
        meds.push({ name: record.drug, hospital: record.hospital || '', note: '' });
      }
    } else if (record.type === '中止') {
      const idx = meds.findIndex(m => m.name === record.drug);
      if (idx !== -1) meds.splice(idx, 1);
    } else if (record.type === '薬品切替') {
      const idx = meds.findIndex(m => m.name === record.drugBefore);
      if (idx !== -1) meds.splice(idx, 1);
      if (!meds.find(m => m.name === record.drugAfter)) {
        meds.push({ name: record.drugAfter, hospital: '', note: '' });
      }
    }
  });
  return meds;
}

// =====================
// 編集ポップアップ
// =====================
let editTarget = null;

function openEditOverlay(patientId, index) {
  const data = loadData();
  const record = data[patientId].history[index];
  editTarget = { patientId, index };
  document.getElementById('edit-date').value = convertDateForInput(record.date);
  document.getElementById('edit-reason').value = record.reason || '';
  document.getElementById('edit-overlay').classList.remove('hidden');
}

function convertDateForInput(dateStr) {
  const parts = dateStr.split('/');
  if (parts.length !== 3) return '';
  return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
}

function convertDateForDisplay(dateStr) {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[0]}/${parseInt(parts[1])}/${parseInt(parts[2])}`;
}

document.getElementById('btn-edit-save').addEventListener('click', () => {
  if (!editTarget) return;
  const newDate = document.getElementById('edit-date').value;
  const newReason = document.getElementById('edit-reason').value.trim();
  if (!newDate) { alert('日付を入力してください'); return; }
  const d = loadData();
  const record = d[editTarget.patientId].history[editTarget.index];
  record.date = convertDateForDisplay(newDate);
  record.reason = newReason;
  saveData(d);
  document.getElementById('edit-overlay').classList.add('hidden');
  editTarget = null;
  renderPatientDetail(currentPatientId);
});

document.getElementById('btn-edit-cancel').addEventListener('click', () => {
  document.getElementById('edit-overlay').classList.add('hidden');
  editTarget = null;
});

// =====================
// チェックリスト
// =====================
function renderChecklist(patientId) {
  const data = loadData();
  const patient = data[patientId];
  const ul = document.getElementById('checklist');
  ul.innerHTML = '';

  const pending = patient.checklist.filter(item => !item.done);

  if (pending.length === 0) {
    ul.innerHTML = '<li>対応待ちなし</li>';
    return;
  }

  pending.forEach(item => {
    const li = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `check-${item.id}`;

    const label = document.createElement('label');
    label.htmlFor = `check-${item.id}`;
    label.textContent = item.text;

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = '確認完了';
    confirmBtn.style.marginLeft = 'auto';
    confirmBtn.style.fontSize = '12px';
    confirmBtn.style.padding = '4px 10px';
    confirmBtn.style.background = '#e0e0e0';
    confirmBtn.style.color = '#333';
    confirmBtn.disabled = true;

    checkbox.addEventListener('change', () => {
      confirmBtn.disabled = !checkbox.checked;
      confirmBtn.style.background = checkbox.checked ? '#4a90d9' : '#e0e0e0';
      confirmBtn.style.color = checkbox.checked ? 'white' : '#333';
    });

    confirmBtn.addEventListener('click', () => {
      const ok = confirm(`「${item.text}」\n\n確認済みにしますか？`);
      if (!ok) return;
      const d = loadData();
      const target = d[patientId].checklist.find(c => c.id === item.id);
      if (target) target.done = true;
      saveData(d);
      renderChecklist(patientId);
      renderPending();
      renderPatientList();
    });

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(confirmBtn);
    ul.appendChild(li);
  });
}

// =====================
// 対応待ちエリア
// =====================
function renderPending() {
  const data = loadData();
  const ul = document.getElementById('pending-list');
  ul.innerHTML = '';

  let hasAny = false;
  Object.keys(data).forEach(patientId => {
    const patient = data[patientId];
    const pending = patient.checklist.filter(item => !item.done);
    if (pending.length > 0) {
      hasAny = true;
      pending.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `患者番号 ${patientId}：${item.text}`;
        li.style.cursor = 'pointer';
        li.addEventListener('click', () => showPatientDetail(patientId));
        ul.appendChild(li);
      });
    }
  });

  if (!hasAny) {
    ul.innerHTML = '<li>対応待ちなし</li>';
  }
}

// =====================
// 入退院記録
// =====================
let selectedAdmissionKind = null;

document.querySelectorAll('.admission-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.admission-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedAdmissionKind = btn.dataset.kind;
  });
});

document.getElementById('input-admission-date').value = new Date().toISOString().split('T')[0];

document.getElementById('btn-admission-submit').addEventListener('click', () => {
  const patientId = document.getElementById('select-admission-patient').value;
  if (!patientId) { alert('患者番号を選択してください'); return; }
  if (!selectedAdmissionKind) { alert('入院・退院を選択してください'); return; }
  const dateVal = document.getElementById('input-admission-date').value;
  if (!dateVal) { alert('日付を入力してください'); return; }
  const note = document.getElementById('input-admission-note').value.trim();
  const d = loadData();
  if (!d[patientId].admissions) d[patientId].admissions = [];
  d[patientId].admissions.push({
    id: Date.now(),
    kind: selectedAdmissionKind,
    date: convertDateForDisplay(dateVal),
    note
  });
  saveData(d);
  resetAdmissionForm();
  alert(`患者番号 ${patientId} の${selectedAdmissionKind}を記録しました`);
});

function renderAdmissionList(patientId) {
  const data = loadData();
  const patient = data[patientId];
  const ul = document.getElementById('admission-list');
  ul.innerHTML = '';
  const admissions = patient.admissions || [];
  if (admissions.length === 0) {
    ul.innerHTML = '<li>記録なし</li>';
    return;
  }
  admissions.slice().reverse().forEach(record => {
    const li = document.createElement('li');
    li.className = record.kind === '入院' ? 'admission-in' : 'admission-out';
    li.textContent = `${record.date}　${record.kind}${record.note ? '　' + record.note : ''}`;
    ul.appendChild(li);
  });
}

function resetAdmissionForm() {
  document.getElementById('select-admission-patient').value = '';
  document.getElementById('input-admission-date').value = new Date().toISOString().split('T')[0];
  document.getElementById('input-admission-note').value = '';
  document.querySelectorAll('.admission-btn').forEach(b => b.classList.remove('selected'));
  selectedAdmissionKind = null;
}

// =====================
// 処方変更の入力処理
// =====================
let pendingRecord = null;

document.getElementById('btn-submit').addEventListener('click', () => {
  const patientId = document.getElementById('select-patient').value;
  if (!patientId) { alert('患者番号を選択してください'); return; }
  if (!selectedType) { alert('変更内容を選択してください'); return; }

  const today = new Date().toLocaleDateString('ja-JP');
  let record = { date: today, type: selectedType };

  if (selectedType === '追加') {
    const drug = document.getElementById('input-drug').value.trim();
    if (!drug) { alert('薬品名を入力してください'); return; }
    record.drug = drug;
    record.hospital = document.getElementById('select-hospital').value;
    record.reason = document.getElementById('input-reason').value.trim();

  } else if (selectedType === '中止') {
    const drug = document.getElementById('select-drug-stop').value;
    if (!drug) { alert('薬品名を選択してください'); return; }
    record.drug = drug;
    record.reason = document.getElementById('input-reason').value.trim();

  } else if (selectedType === '用量変更') {
    const drug = document.getElementById('select-drug-dose').value;
    if (!drug) { alert('薬品名を選択してください'); return; }
    record.drug = drug;
    record.doseBefore = drug;
    record.doseAfter = document.getElementById('input-dose-after').value.trim();
    record.reason = document.getElementById('input-reason').value.trim();
    if (!record.doseAfter) { alert('変更後の用量を入力してください'); return; }

  } else if (selectedType === '薬品切替') {
    const before = document.getElementById('select-drug-switch-before').value;
    const after  = document.getElementById('input-switch-after').value.trim();
    if (!before) { alert('変更前の薬品名を選択してください'); return; }
    if (!after)  { alert('変更後の薬品名を入力してください'); return; }
    record.drugBefore = before;
    record.drugAfter  = after;
  }

  if (selectedType === '追加') {
    const data = loadData();
    const history = data[patientId].history;
    const pastStop = history.find(h => h.drug === record.drug && h.type === '中止');
    if (pastStop) {
      pendingRecord = { patientId, record };
      document.getElementById('alert-message').textContent =
        `${pastStop.date} に ${record.drug} を中止した記録があります。\n理由：${pastStop.reason || 'なし'}\n\n再開して大丈夫ですか？`;
      document.getElementById('alert-overlay').classList.remove('hidden');
      return;
    }
  }

  saveRecord(patientId, record);
});

document.getElementById('btn-go-detail').addEventListener('click', () => {
  document.getElementById('alert-overlay').classList.add('hidden');
  if (pendingRecord) {
    saveRecord(pendingRecord.patientId, pendingRecord.record);
    showPatientDetail(pendingRecord.patientId);
    pendingRecord = null;
  }
});

document.getElementById('btn-record-anyway').addEventListener('click', () => {
  document.getElementById('alert-overlay').classList.add('hidden');
  if (pendingRecord) {
    saveRecord(pendingRecord.patientId, pendingRecord.record);
    pendingRecord = null;
  }
});

// =====================
// 記録を保存
// =====================
function saveRecord(patientId, record) {
  const data = loadData();
  const patient = data[patientId];
  patient.history.push(record);

  if (record.type === '追加') {
    if (!patient.currentMeds.find(m => m.name === record.drug)) {
      patient.currentMeds.push({
        name: record.drug,
        hospital: record.hospital || '',
        note: ''
      });
    }
  } else if (record.type === '中止') {
    patient.currentMeds = patient.currentMeds.filter(m => m.name !== record.drug);
    patient.checklist.push({
      id: Date.now(),
      text: `${record.drug} 中止（${record.reason || '理由なし'}）の確認`,
      done: false
    });
  } else if (record.type === '用量変更') {
    patient.checklist.push({
      id: Date.now(),
      text: `${record.drug} 用量変更（→${record.doseAfter}）の確認`,
      done: false
    });
  } else if (record.type === '薬品切替') {
    patient.currentMeds = patient.currentMeds.filter(m => m.name !== record.drugBefore);
    if (!patient.currentMeds.find(m => m.name === record.drugAfter)) {
      patient.currentMeds.push({ name: record.drugAfter, hospital: '', note: '' });
    }
    patient.checklist.push({
      id: Date.now(),
      text: `薬品切替（${record.drugBefore}→${record.drugAfter}）の確認`,
      done: false
    });
  }

  saveData(data);
  resetInputForm();
  renderPending();
  updatePatientSelects();
}

// =====================
// 入力フォームリセット
// =====================
function resetInputForm() {
  document.getElementById('select-patient').value = '';
  document.getElementById('input-drug').value = '';
  document.getElementById('input-reason').value = '';
  document.getElementById('input-dose-after').value = '';
  document.getElementById('input-switch-after').value = '';
  document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('selected'));
  selectedType = null;
  document.getElementById('group-drug').classList.remove('hidden');
  document.getElementById('group-drug-stop').classList.add('hidden');
  document.getElementById('group-drug-dose').classList.add('hidden');
  document.getElementById('group-drug-switch').classList.add('hidden');
  document.getElementById('group-hospital').classList.add('hidden');
  document.getElementById('group-reason').classList.add('hidden');
  document.getElementById('group-dose').classList.add('hidden');
}

// =====================
// ボタンイベント
// =====================
document.getElementById('btn-home').addEventListener('click', showHome);
document.getElementById('btn-patient-list').addEventListener('click', showPatientList);
document.getElementById('btn-back-to-list').addEventListener('click', showPatientList);
document.getElementById('btn-hospital-master').addEventListener('click', showHospitalMaster);

// =====================
// バックアップ（書き出し・読み込み）
// =====================
document.getElementById('btn-export').addEventListener('click', () => {
  const data = loadData();
  const hospitals = loadHospitals();
  const backup = { patients: data, hospitals: hospitals, exportDate: new Date().toLocaleString('ja-JP') };

  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `medmanager_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();

  URL.revokeObjectURL(url);
});

document.getElementById('btn-import').addEventListener('click', () => {
  document.getElementById('file-import').click();
});

document.getElementById('file-import').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const backup = JSON.parse(event.target.result);
      const ok = confirm(
        `バックアップデータを読み込みます。\n書き出し日時：${backup.exportDate || '不明'}\n\n現在のデータは上書きされます。よろしいですか？`
      );
      if (!ok) return;

      saveData(backup.patients || {});
      saveHospitals(backup.hospitals || []);

      alert('データを復元しました');
      showHome();
    } catch (err) {
      alert('ファイルの読み込みに失敗しました。正しいバックアップファイルか確認してください。');
    }
  };
  reader.readAsText(file);

  e.target.value = ''; // 同じファイルを連続で選べるようにリセット
});

// 起動時
showHome();