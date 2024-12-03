import { promptModel } from "./utils/prompt";
import { summarizeModel } from "./utils/summarize";

import {
  updateDangerousWebsites,
  updateSafeWebsites,
} from "./utils/websiteUtils";
import { checkLoginStatus, getToken } from "./utils/storageUtils";

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

// Handle Messages from Content Script
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === "extractedText") {
    const textSnippet = message.text.split(" ").slice(0, 150).join(" ");
    console.log("Text Snippet:", textSnippet);

    try {
      const response = await promptModel(textSnippet);
      console.log("Response from AI Model:", response);

      if (response.toLowerCase().includes("negative")) {
        updateDangerousWebsites();
        chrome.tabs.update(sender.tab.id, { url: redirectionUrl });
        console.log(`Prediction: Dangerous. Redirected to ${redirectionUrl}`);
      } else {
        updateSafeWebsites();
        console.log("Prediction: Safe.");
      }
    } catch (error) {
      console.error("Error during prediction:", error.message);
    }

    return true;
  } else if (message.type === "summarize") {
    try {
      const summary = await summarizeModel(message.content);
      chrome.storage.local.set({ lastSummary: summary }, () => {
        sendResponse({ success: true });
      });
    } catch (error) {
      console.error("Summarization error:", error.message);
      sendResponse({ success: false, error: error.message });
    }
    return true;
  }
});
