// content.js
// Monitors <input>, <textarea>, and contenteditable fields on the page.
// Displays a badge when forbidden words are detected.

(async function() {
  const defaultBlocked = ["forbidden", "malicious", "harmful"];

  async function getBlocked() {
    return new Promise(resolve => {
      chrome.storage.sync.get({ blockedWords: defaultBlocked, mode: 'warn' }, items => {
        resolve(items);
      });
    });
  }

  function showBadge(el, text) {
    removeBadge(el);
    const badge = document.createElement('span');
    badge.className = 'ps-badge';
    badge.textContent = text;
    Object.assign(badge.style, {
      position: 'absolute',
      background: 'rgba(200,40,40,0.95)',
      color: 'white',
      padding: '2px 6px',
      borderRadius: '4px',
      fontSize: '12px',
      zIndex: 999999
    });
    const rect = el.getBoundingClientRect();
    badge.style.top = (window.scrollY + rect.top - 6) + 'px';
    badge.style.left = (window.scrollX + rect.left + rect.width - 6) + 'px';
    badge.dataset.psFor = getElementId(el);
    document.body.appendChild(badge);
    window.addEventListener('resize', () => updateBadgePosition(el, badge));
    window.addEventListener('scroll', () => updateBadgePosition(el, badge));
  }

  function updateBadgePosition(el, badge) {
    if (!document.body.contains(badge)) return;
    const rect = el.getBoundingClientRect();
    badge.style.top = (window.scrollY + rect.top - 6) + 'px';
    badge.style.left = (window.scrollX + rect.left + rect.width - 6) + 'px';
  }

  function removeBadge(el) {
    const id = getElementId(el);
    document.querySelectorAll('.ps-badge').forEach(b => { if (b.dataset.psFor === id) b.remove(); });
  }

  function getElementId(el) {
    if (!el.__psid) el.__psid = 'ps_' + Math.random().toString(36).slice(2,9);
    return el.__psid;
  }

  function findForbidden(text, forbiddenList) {
    if (!text) return null;
    const lower = text.toLowerCase();
    for (const w of forbiddenList) {
      const token = w.trim().toLowerCase();
      if (!token) continue;
      if (lower.includes(token)) return token;
    }
    return null;
  }

  async function attachTo(el) {
    if (el.__ps_attached) return; el.__ps_attached = true;

    const meta = await getBlocked();
    const forbidden = meta.blockedWords || defaultBlocked;
    const mode = meta.mode || 'warn';

    function handler() {
      const text = el.value ?? el.innerText ?? '';
      const bad = findForbidden(text, forbidden);
      if (bad) {
        showBadge(el, 'Blocked');
        el.style.outline = '2px solid rgba(200,40,40,0.8)';
      } else {
        removeBadge(el);
        el.style.outline = '';
      }
    }

    el.addEventListener('input', handler);
    el.addEventListener('blur', handler);

    const form = el.form;
    if (form) {
      form.addEventListener('submit', e => {
        const text = el.value ?? el.innerText ?? '';
        const bad = findForbidden(text, forbidden);
        if (bad && mode === 'block') {
          e.preventDefault();
          e.stopPropagation();
          showBadge(el, 'Blocked');
          alert('Submission blocked: forbidden word found — ' + bad);
        }
      }, true);
    }

    handler();
  }

  function observe() {
    const selectors = 'input[type=text], textarea, [contenteditable="true"]';
    document.querySelectorAll(selectors).forEach(attachTo);

    const mo = new MutationObserver(muts => {
      for (const m of muts) {
        for (const node of m.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          if (node.matches && node.matches('input[type=text], textarea, [contenteditable="true"]')) attachTo(node);
          node.querySelectorAll && node.querySelectorAll(selectors).forEach(attachTo);
        }
      }
    });
    mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
  }

  try { observe(); } catch (err) { console.error('PromptShield observe error', err); }

})();
