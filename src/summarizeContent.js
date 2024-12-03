const pageContent = document.body.innerText;
chrome.runtime.sendMessage(
  { type: "summarize", content: pageContent },
  (response) => {
    if (response?.success) {
      alert("Summarization complete! Check the extension popup for results.");
    } else {
      alert("Summarization failed. Please try again.");
    }
  }
);
