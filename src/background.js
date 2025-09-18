// background.js
// Handles initialization and simple messaging.

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['blockedWords','mode'], items => {
    if (!items.blockedWords) chrome.storage.sync.set({ blockedWords: ['forbidden'] });
    if (!items.mode) chrome.storage.sync.set({ mode: 'warn' });
  });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.action === 'getBlocked') {
    chrome.storage.sync.get(['blockedWords','mode'], items => sendResponse(items));
    return true;
  }
  if (msg?.action === 'notify') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: msg.title || 'PromptShield',
      message: msg.message || ''
    });
  }
});