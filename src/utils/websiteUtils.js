export const updateDangerousWebsites = () => {
  chrome.storage.local.get(["totalDangerousWebsites"], (result) => {
    const newCount = (result.totalDangerousWebsites || 0) + 1;
    chrome.storage.local.set({ totalDangerousWebsites: newCount }, () => {
      console.log("Total Dangerous Websites updated to:", newCount);
    });
  });
};

export const updateSafeWebsites = () => {
  chrome.storage.local.get(["totalSafeWebsites"], (result) => {
    const newCount = (result.totalSafeWebsites || 0) + 1;
    chrome.storage.local.set({ totalSafeWebsites: newCount }, () => {
      console.log("Total Safe Websites updated to:", newCount);
    });
  });
};
