const e=document.body.innerText;console.log("Extracted Text:",e);chrome.runtime.sendMessage({type:"extractedText",text:e});
