const t=document.body.innerText;chrome.runtime.sendMessage({type:"summarize",content:t},e=>{e!=null&&e.success?alert("Summarization complete! Check the extension popup for results."):alert("Summarization failed. Please try again.")});