const pageText = document.body.innerText;

console.log("Extracted Text:", pageText);

chrome.runtime.sendMessage({ type: "extractedText", text: pageText });
