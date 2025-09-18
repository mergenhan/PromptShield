// popup.js

async function getState() {
  return new Promise(resolve => chrome.storage.sync.get({ blockedWords: [], mode: 'warn' }, s => resolve(s)));
}

function render(words, mode) {
  const container = document.getElementById('words');
  container.innerHTML = '';
  for (const w of words) {
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = w;
    const rm = document.createElement('button');
    rm.textContent = 'x'; rm.style.marginLeft = '6px';
    rm.onclick = () => {
      const newWords = words.filter(x => x !== w);
      chrome.storage.sync.set({ blockedWords: newWords }, () => render(newWords, mode));
    };
    tag.appendChild(rm);
    container.appendChild(tag);
  }
  document.getElementById('mode').value = mode;
}

(async function(){
  const state = await getState();
  render(state.blockedWords || [], state.mode || 'warn');

  document.getElementById('add').addEventListener('click', () => {
    const v = document.getElementById('newword').value.trim();
    if (!v) return;
    const newWords = Array.from(new Set([...(state.blockedWords||[]), v]));
    chrome.storage.sync.set({ blockedWords: newWords }, () => {
      state.blockedWords = newWords; render(newWords, state.mode);
      document.getElementById('newword').value = '';
    });
  });

  document.getElementById('mode').addEventListener('change', (e) => {
    const m = e.target.value;
    state.mode = m;
    chrome.storage.sync.set({ mode: m });
  });

  document.getElementById('options').addEventListener('click', (e) => {
    e.preventDefault();
    if (chrome.runtime.openOptionsPage) chrome.runtime.openOptionsPage();
  });
})();