let isCopyBlocked = false;

// Function to display warning messages
function displayWarning(message) {
  const warningDiv = document.createElement('div');
  warningDiv.style.position = 'fixed';
  warningDiv.style.top = '50%';
  warningDiv.style.left = '50%';
  warningDiv.style.transform = 'translate(-50%, -50%)';
  warningDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  warningDiv.style.color = 'white';
  warningDiv.style.padding = '20px';
  warningDiv.style.borderRadius = '5px';
  warningDiv.style.zIndex = '9999';
  warningDiv.textContent = message;
  document.body.appendChild(warningDiv);

  setTimeout(() => {
    warningDiv.remove();
  }, 3000);
}

// Function to block copy, cut, and paste actions
function blockCopyPaste(e) {
  if (isCopyBlocked) {
    e.preventDefault();
    displayWarning('Copy and paste actions are blocked by the extension.');
  }
}

// Update listeners for copy blocking
function updateListeners() {
  document.removeEventListener('copy', blockCopyPaste, true);
  document.removeEventListener('cut', blockCopyPaste, true);
  document.removeEventListener('paste', blockCopyPaste, true);

  if (isCopyBlocked) {
    document.addEventListener('copy', blockCopyPaste, true);
    document.addEventListener('cut', blockCopyPaste, true);
    document.addEventListener('paste', blockCopyPaste, true);
  }
}

// Inject CSS to disable text selection
function injectCSS() {
  const existingStyle = document.getElementById('copy-blocker-style');
  if (existingStyle) {
    existingStyle.remove();
  }

  if (isCopyBlocked) {
    const style = document.createElement('style');
    style.id = 'copy-blocker-style';
    style.textContent = `
        * {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
        }
    `;
    document.head.appendChild(style);
  }
}

// Update copy blocking state
function updateCopyBlocking(state) {
  isCopyBlocked = state;
  updateListeners();
  injectCSS();
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'showBlockMessage') {
    displayWarning('Download blocked on this page!');
  } else if (message.action === "updateCopyBlocking") {
    updateCopyBlocking(message.state);
  }
});

// Initialize copy blocking state from storage
chrome.storage.local.get('isCopyBlocked', (data) => {
  updateCopyBlocking(data.isCopyBlocked || false);
});

// Reapply listeners on dynamic content changes
const observer = new MutationObserver(updateListeners);
observer.observe(document.body, { childList: true, subtree: true });
