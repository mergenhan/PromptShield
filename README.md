# PromptShield

A lightweight Chrome extension that helps protect against unsafe or unwanted text prompts.  
It monitors text inputs and textareas on web pages and warns (or blocks) the user when forbidden words are detected.  
The extension allows users to manage their blocked words list and choose between **warn** or **block** modes.

## Features
- **Real-time detection** of forbidden words in text inputs, textareas, and contenteditable fields.  
- **Two modes**:
  - **Warn**: highlight and notify the user.
  - **Block**: prevent form submission if blocked content is detected.
- **Popup UI**: quickly add or remove blocked words and change mode.  
- **Options page**: bulk manage forbidden words.  
- **Storage sync**: settings are synced across Chrome if logged in.  

## Installation
1. Clone or download this repository.  
2. Open Chrome and go to `chrome://extensions`.  
3. Enable **Developer mode** in the top-right corner.  
4. Click **Load unpacked** and select the project folder.  
5. The extension will now be available in your browser toolbar.

## Development Notes
- Built with **Manifest V3**.  
- Uses `chrome.storage.sync` for persistent data.  
- The extension injects a content script to monitor inputs.  
