import { promptModel } from "./prompt";

const redirectionUrl = "https://snailly-block.netlify.app/";

chrome.runtime.onInstalled.addListener(() => {
  console.log("Chrome Extension is installed!");

  checkLoginStatus();

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && changes.token) {
      checkLoginStatus();
    }
  });
});

let token;
chrome.storage.local.get(["token"], (result) => {
  token = result.token;
});

function checkLoginStatus() {
  chrome.storage.local.get(["token"], (result) => {
    if (!result.token) {
      console.error("You need to log in to use this extension");

      return;
    }

    console.log("User Already Logged In");

    // Listen for Active Tab Changes
    chrome.tabs.onActivated.addListener((activeInfo) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];

        console.log("Current Tab URL:", currentTab.url);

        if (currentTab.url.includes("snailly-block.netlify.app")) {
          return;
        } else {
          injectContentScript(currentTab.id);
        }
      });
    });

    // Listen for Tab Updates
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === "complete") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const currentTab = tabs[0];
          console.log("Current Tab:", tabs);
          console.log("Current Tab URL:", currentTab.url);

          if (currentTab.url.includes("snailly-block.netlify.app")) {
            return;
          } else {
            injectContentScript(currentTab.id);
          }
        });
      }
    });

    // Handle Messages from Content Script
    chrome.runtime.onMessage.addListener(
      async (message, sender, sendResponse) => {
        if (message.type === "extractedText") {
          const textSnippet = message.text.split(" ").slice(0, 100).join(" ");

          console.log("Text Snippet:", textSnippet);

          try {
            const response = await promptModel(textSnippet);

            console.log("Response from AI Model:", response);

            if (response.toLowerCase() === "negative") {
              updateDangerousWebsites();

              chrome.tabs.update(sender.tab.id, { url: redirectionUrl });
              console.log(
                `Prediction: Dangerous. Redirected to ${redirectionUrl}`
              );
            } else {
              updateSafeWebsites();
              console.log("Prediction: Safe.");
            }
          } catch (error) {
            console.error("Error during prediction:", error.message);
          }

          return true;
        }
      }
    );
  });
}

const injectContentScript = (tabId) => {
  chrome.scripting.executeScript({
    target: { tabId },
    files: ["content.js"],
  });
};

function updateDangerousWebsites() {
  chrome.storage.local.get(["totalDangerousWebsites"], (result) => {
    let newCount = (result.totalDangerousWebsites || 0) + 1;
    chrome.storage.local.set({ totalDangerousWebsites: newCount }, () => {
      console.log("Total Dangerous Websites updated to: " + newCount);
    });
  });
}

function updateSafeWebsites() {
  chrome.storage.local.get(["totalSafeWebsites"], (result) => {
    let newCount = (result.totalSafeWebsites || 0) + 1;
    chrome.storage.local.set({ totalSafeWebsites: newCount }, () => {
      console.log("Total Safe Websites updated to: " + newCount);
    });
  });
}
