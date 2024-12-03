export const injectContentScript = (tabId) => {
  chrome.scripting.executeScript({
    target: { tabId },
    files: ["content.js"],
  });
};

export const injectSummarizeScript = (tabId) => {
  chrome.scripting.executeScript({
    target: { tabId },
    files: ["summarizeContent.js"],
  });
};
