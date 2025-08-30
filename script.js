// script.js
const ACCESS_CODE = '387700';
let isVerified = false;
let buttons = [];

window.onload = loadButtons;

function showModal() {
  document.getElementById('adminModal').classList.add('active');
}

function hideModal() {
  document.getElementById('adminModal').classList.remove('active');
  document.getElementById('codeInput').value = '';
}

function checkCode() {
  const code = document.getElementById('codeInput').value.trim();
  if (code === ACCESS_CODE) {
    isVerified = true;
    document.getElementById('addSection').classList.remove('hidden');
    hideModal();
    refreshButtons();
  } else {
    alert('Incorrect code.');
  }
}

function logout() {
  isVerified = false;
  document.getElementById('addSection').classList.add('hidden');
  refreshButtons();
}

function addButton() {
  const text = document.getElementById('buttonText').value.trim();
  const url = document.getElementById('buttonUrl').value.trim();
  if (!text || !url) { alert('Both fields are required.'); return; }
  try { new URL(url); } catch { alert('Invalid URL.'); return; }
  buttons.push({ id: Date.now(), text, url });
  saveButtons();
  refreshButtons();
  document.getElementById('buttonText').value = '';
  document.getElementById('buttonUrl').value = '';
}

function deleteButton(id) {
  if (!isVerified) { alert('Admin login required.'); return; }
  if (!confirm('Delete this link?')) return;
  buttons = buttons.filter(b => b.id !== id);
  saveButtons();
  refreshButtons();
}

function refreshButtons() {
  const container = document.getElementById('buttonsContainer');
  if (buttons.length === 0) {
    container.innerHTML = '<p>No links added yet.</p>';
    return;
  }
  container.innerHTML = buttons.map(b =>
    `<div class="button-container">
      <a href="${b.url}" target="_blank" class="link-button">${b.text}</a>
      ${isVerified ? `<button class="btn-danger delete-btn" onclick="deleteButton(${b.id})">Delete</button>` : ''}
    </div>`
  ).join('');
}

function saveButtons() {
  localStorage.setItem('inarchLinks', JSON.stringify(buttons));
}

function loadButtons() {
  const saved = localStorage.getItem('inarchLinks');
  if (saved) buttons = JSON.parse(saved);
  refreshButtons();
}