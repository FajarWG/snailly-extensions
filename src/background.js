import { promptModel } from "./prompt";

chrome.runtime.onInstalled.addListener(() => {
  console.log("Chrome Extension is installed!");

  checkLoginStatus();

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && changes.token) {
      // Jika token berubah, cek apakah token sudah ada
      checkLoginStatus();
    }
  });
});

const BASE_URL = "https://snailly.unikom.ac.id";
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

    console.log("Pengguna sudah login. Token ditemukan:", result.token);

    // Listen for Active Tab Changes
    chrome.tabs.onActivated.addListener((activeInfo) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];

        console.log("Current Tab URL:", currentTab.url);

        if (currentTab.url.includes("snailly-block.netlify.app")) {
          return;
        } else {
          handleUrlCheck(currentTab);
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
            handleUrlCheck(currentTab);
          }
        });
      }
    });

    // Handle Messages from Content Script
    chrome.runtime.onMessage.addListener(
      async (message, sender, sendResponse) => {
        if (message.type === "extractedText") {
          // console.log("Received Text from Page:", message.text);

          const textSnippet = message.text.split(" ").slice(0, 100).join(" ");

          console.log("Text Snippet:", textSnippet);

          try {
            const response = await promptModel(textSnippet);

            console.log("Response from AI Model:", response);

            const redirectionUrl = "https://snailly-block.netlify.app/";

            if (response.toLowerCase() === "negative") {
              updateDangerousWebsites();

              chrome.tabs.update(sender.tab.id, { url: redirectionUrl });
              console.log(
                `Prediction: Dangerous. Redirected to ${redirectionUrl}`
              );
            } else {
              console.log("Prediction: Safe.");
            }
          } catch (error) {
            console.error("Error during prediction:", error.message);
          }

          // Keep connection open for async response
          return true;
        }
      }
    );
  });
}

// const insertHistory = async (url) => {
//   chrome.storage.local.get(["user"], async (result) => {
//     console.log("User Data:", url);
//     const logData = {
//       childId: result.user.id,
//       parentId: result.user.parentsId,
//       url: url,
//       web_title: url.split("//")[1].split("/")[0].split(".")[1],
//       web_description: "",
//       detail_url: "",
//     };
//     try {
//       const response = await fetch(BASE_URL + "/log", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(logData),
//       });
//     } catch (error) {
//       console.error("Error inserting history:", error.message);
//     }
//   });
// };

const handleUrlCheck = async (currentTab) => {
  const redirectionUrl = "https://snailly-block.netlify.app/";

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
      // const sendHistory = await insertHistory(currentTab.url);
      updateDangerousWebsites();

      chrome.tabs.update(currentTab.id, { url: redirectionUrl });

      console.log(`Redirected from ${currentTab.url} to ${redirectionUrl}`);
      console.log("Send History:", sendHistory);
    } else {
      updateSafeWebsites();
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

// Fungsi untuk memperbarui jumlah website berbahaya
function updateDangerousWebsites() {
  chrome.storage.local.get(["totalDangerousWebsites"], (result) => {
    // Jika belum ada, set ke 0, jika ada tambah 1
    let newCount = (result.totalDangerousWebsites || 0) + 1;
    chrome.storage.local.set({ totalDangerousWebsites: newCount }, () => {
      console.log("Total Dangerous Websites updated to: " + newCount);
    });
  });
}

// Fungsi untuk memperbarui jumlah website aman
function updateSafeWebsites() {
  chrome.storage.local.get(["totalSafeWebsites"], (result) => {
    // Jika belum ada, set ke 0, jika ada tambah 1
    let newCount = (result.totalSafeWebsites || 0) + 1;
    chrome.storage.local.set({ totalSafeWebsites: newCount }, () => {
      console.log("Total Safe Websites updated to: " + newCount);
    });
  });
}
