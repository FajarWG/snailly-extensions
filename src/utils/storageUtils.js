import { injectContentScript } from "./tabUtils";

export const getToken = () =>
  new Promise((resolve) => {
    chrome.storage.local.get(["token"], (result) => {
      resolve(result.token || null);
    });
  });

export const checkLoginStatus = async () => {
  const token = await getToken();

  if (!token) {
    console.error("You need to log in to use this extension");
    return;
  }

  console.log("User Already Logged In");

  chrome.tabs.onActivated.addListener(handleTabActivation);
  chrome.tabs.onUpdated.addListener(handleTabUpdate);
};

const handleTabActivation = (activeInfo) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    if (!currentTab.url.includes("snailly-block.netlify.app")) {
      injectContentScript(currentTab.id);
    }
  });
};

const handleTabUpdate = (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (!currentTab.url.includes("snailly-block.netlify.app")) {
        injectContentScript(currentTab.id);
      }
    });
  }
};
