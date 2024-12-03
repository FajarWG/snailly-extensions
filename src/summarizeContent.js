let pageContent = document.body.innerText;
pageContent = pageContent.substring(0, 3850);
chrome.runtime.sendMessage(
  { type: "summarize", content: pageContent },
  (response) => {
    if (response?.success) {
      console.log(
        "Summarization complete! Check the extension popup for results."
      );
    } else {
      console.log("Summarization failed. Please try again.");
    }
  }
);
