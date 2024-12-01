chrome.runtime.onInstalled.addListener(() => {
  console.log("Chrome Extension is installed!");
});

chrome.tabs.onActivated.addListener((activeInfo, tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"],
  });
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
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"],
  });

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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "extractedText") {
    console.log("Received Text from Page:", message.text);

    const text = message.text.split(" ").slice(0, 100).join(" ");

    // Menyimpan teks di storage Chrome (opsional)
    chrome.storage.local.set({ extractedText: text }, () => {
      console.log("Text saved to local storage.");
    });
  }
});
