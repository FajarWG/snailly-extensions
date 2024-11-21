chrome.runtime.onInstalled.addListener(() => {
  console.log("Chrome Extension is installed!");
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    console.log("Current Tab URL:", currentTab.url);

    const url = "https://www.vitejs.dev/";

    if (currentTab.url === "https://www.youtube.com/") {
      chrome.tabs.update(currentTab.id, { url });
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      console.log("Current Tab URL:", currentTab.url);

      const url = "https://www.vitejs.dev/";

      if (currentTab.url === "https://www.youtube.com/") {
        chrome.tabs.update(currentTab.id, { url });
      }
    });
  }
});
