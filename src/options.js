// options.js

document.addEventListener('DOMContentLoaded', async () => {
  chrome.storage.sync.get({ blockedWords: [], mode: 'warn' }, items => {
    document.getElementById('words').value = (items.blockedWords || []).join(', ');
    document.getElementById('mode').value = items.mode || 'warn';
  });

  document.getElementById('save').addEventListener('click', () => {
    const raw = document.getElementById('words').value;
    const arr = raw.split(',').map(s => s.trim()).filter(Boolean);
    const mode = document.getElementById('mode').value;
    chrome.storage.sync.set({ blockedWords: arr, mode }, () => {
      alert('Saved');
    });
  });
});