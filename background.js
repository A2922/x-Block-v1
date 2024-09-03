// Function to block downloads and notify content script
function blockDownload(downloadItem) {
    // Cancel the download
    chrome.downloads.cancel(downloadItem.id, () => {
      console.log(`Download blocked: ${downloadItem.filename}`);
  
      // Send a message to the content script to show the block message
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'showBlockMessage' });
        }
      });
    });
  }
  
  // Listen for download events
  chrome.downloads.onCreated.addListener((downloadItem) => {
    // Check if blocking is enabled
    chrome.storage.sync.get('blockDownloads', ({ blockDownloads }) => {
      if (blockDownloads) {
        blockDownload(downloadItem);
      }
    });
  });
  
  // Listen for messages related to copy blocking
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "updateCopyBlocking") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "updateCopyBlocking", state: request.state });
      });
    }
  });
  