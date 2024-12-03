export const injectContentScript = (tabId) => {
  chrome.scripting.executeScript({
    target: { tabId },
    files: ["content.js"],
  });
};
