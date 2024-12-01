const { promptModel } = require("./prompt");

chrome.runtime.onInstalled.addListener(() => {
  console.log("Chrome Extension is installed!");
});

const BASE_URL = "https://snailly.unikom.ac.id";
let token;
chrome.storage.local.get(["token"], (result) => {
  token = result.token;
});

// Redirect or Predict Dangerous URL
const handleUrlCheck = async (currentTab) => {
  const redirectionUrl = "https://www.vitejs.dev/";

  if (!currentTab || !currentTab.url) {
    console.error("No current tab URL found.");
    return;
  }

  try {
    // Step 1: Fetch the list of dangerous websites

    const response = await fetch(
      BASE_URL + "/classified-url/dangerous-website",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();

    const dangerousListRaw = responseData.data
      .filter((item) => item.FINAL_label === "berbahaya")
      .map((item) => item.url);

    const extractDomain = (url) => {
      return url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]; // Hapus protokol dan "www."
    };

    const dangerousList = dangerousListRaw.map(extractDomain);

    const currentUrl = currentTab.url;
    const currentDomain = extractDomain(currentUrl);

    console.log("Dangerous List:", dangerousList);
    console.log("Current Domain:", currentDomain);
    console.log("Check Link:", dangerousList.includes(currentDomain));

    if (dangerousList.includes(currentDomain)) {
      chrome.tabs.update(currentTab.id, { url: redirectionUrl });
      console.log(`Redirected from ${currentTab.url} to ${redirectionUrl}`);
    } else {
      console.log(
        `URL not in dangerous list. Extracting text from: ${currentTab.url}`
      );

      injectContentScript(currentTab.id);
    }
  } catch (error) {
    console.error("Error checking URL:", error.message);
  }
};

// Inject Content Script into a Tab
const injectContentScript = (tabId) => {
  chrome.scripting.executeScript({
    target: { tabId },
    files: ["content.js"],
  });
};

// Listen for Active Tab Changes
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    console.log("Current Tab URL:", currentTab.url);

    handleUrlCheck(currentTab);
  });
});

// Listen for Tab Updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      console.log("Current Tab URL:", currentTab.url);

      handleUrlCheck(currentTab);
    });
  }
});

// Handle Messages from Content Script
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === "extractedText") {
    // console.log("Received Text from Page:", message.text);

    const textSnippet = message.text.split(" ").slice(0, 100).join(" ");

    try {
      // Step 4: Predict Dangerous Status with Extracted Text

      const response = await promptModel(textSnippet);

      // const response = await fetch(BASE_URL + "/check-dangerous", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify({ text: textSnippet, url: sender.tab.url }),
      // });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      if (response === "negative") {
        const redirectionUrl = "https://www.vitejs.dev/";
        chrome.tabs.update(sender.tab.id, { url: redirectionUrl });
        console.log(`Prediction: Dangerous. Redirected to ${redirectionUrl}`);
      } else {
        console.log("Prediction: Safe.");
      }

      sendResponse({ success: true, prediction });
    } catch (error) {
      console.error("Error during prediction:", error.message);
      sendResponse({ success: false, error: error.message });
    }

    // Keep connection open for async response
    return true;
  }
});
