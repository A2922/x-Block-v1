document.addEventListener('DOMContentLoaded', () => {
    const downloadToggle = document.getElementById('toggleDownloadBlockingBtn');
    const copyToggle = document.getElementById('toggleCopyBlockingBtn');
  
    // Load the current toggle state for download blocking
    chrome.storage.sync.get('blockDownloads', ({ blockDownloads }) => {
      downloadToggle.textContent = blockDownloads ? 'Disable Download Blocking' : 'Enable Download Blocking';
    });
  
    // Load the current toggle state for copy blocking
    chrome.storage.local.get('isCopyBlocked', ({ isCopyBlocked }) => {
      copyToggle.textContent = isCopyBlocked ? 'Disable Copy Blocking' : 'Enable Copy Blocking';
    });
  
    // Update the state when the download toggle is clicked
    downloadToggle.addEventListener('click', () => {
      chrome.storage.sync.get('blockDownloads', ({ blockDownloads }) => {
        const newState = !blockDownloads;
        chrome.storage.sync.set({ blockDownloads: newState });
        downloadToggle.textContent = newState ? 'Disable Download Blocking' : 'Enable Download Blocking';
      });
    });
  
    // Update the state when the copy toggle is clicked
    copyToggle.addEventListener('click', () => {
      chrome.storage.local.get('isCopyBlocked', ({ isCopyBlocked }) => {
        const newState = !isCopyBlocked;
        chrome.storage.local.set({ isCopyBlocked: newState });
        chrome.runtime.sendMessage({ action: "updateCopyBlocking", state: newState });
        copyToggle.textContent = newState ? 'Disable Copy Blocking' : 'Enable Copy Blocking';
      });
    });
  });
  