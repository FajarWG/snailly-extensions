const m=async e=>{if(!self.ai||!self.ai.languageModel)return;const t=`You are an advanced AI model trained for sentiment and content analysis. Your task is to classify the overall sentiment and type of content on a website as either "Positive" or "Negative" based on the following criteria:
  
  Criteria for Classification:
  1. Positive:
  - Content promotes optimism, encouragement, positivity, or neutral and constructive topics.
  - Examples: educational content, inspirational stories, or problem-solving discussions.
  
  2. Negative:
  - Content includes disturbing, harmful, or inappropriate topics such as:
     - Violence, murder, or graphic harm.
     - Pornographic or explicit material.
     - Hate speech, bullying, or other toxic behaviors.
  - Overall tone is discouraging, alarming, or detrimental to well-being.
  
  Instructions:
  1. Analyze the text content thoroughly.
  2. Determine the overall sentiment and nature of the content.
  3. Based on the criteria above, classify the content strictly as either 'Positive' or 'Negative.'
  
  Response Format:
  Your response must be one word only: Positive or Negative.
  Input:
  "${e}"`;try{const{available:o,defaultTemperature:a,defaultTopK:s,maxTopK:n}=await ai.languageModel.capabilities();let r;if(o!=="no"){const i=await ai.languageModel.create();r=await i.prompt(t),i&&(i.destroy(),console.log("Session destroyed."))}return r}catch(o){console.error("Error during AI processing:",o.message)}};chrome.runtime.onInstalled.addListener(()=>{console.log("Chrome Extension is installed!"),u(),chrome.storage.onChanged.addListener((e,t)=>{t==="local"&&e.token&&u()})});const h="https://snailly.unikom.ac.id";let g;chrome.storage.local.get(["token"],e=>{g=e.token});function u(){chrome.storage.local.get(["token"],e=>{if(!e.token){console.error("You need to log in to use this extension");return}console.log("Pengguna sudah login. Token ditemukan:",e.token),chrome.tabs.onActivated.addListener(t=>{chrome.tabs.query({active:!0,currentWindow:!0},o=>{const a=o[0];console.log("Current Tab URL:",a.url),!a.url.includes("snailly-block.netlify.app")&&d(a)})}),chrome.tabs.onUpdated.addListener((t,o,a)=>{o.status==="complete"&&chrome.tabs.query({active:!0,currentWindow:!0},s=>{const n=s[0];console.log("Current Tab:",s),console.log("Current Tab URL:",n.url),!n.url.includes("snailly-block.netlify.app")&&d(n)})}),chrome.runtime.onMessage.addListener(async(t,o,a)=>{if(t.type==="extractedText"){const s=t.text.split(" ").slice(0,100).join(" ");console.log("Text Snippet:",s);try{const n=await m(s);console.log("Response from AI Model:",n);const r="https://snailly-block.netlify.app/";n.toLowerCase()==="negative"?(p(),chrome.tabs.update(o.tab.id,{url:r}),console.log(`Prediction: Dangerous. Redirected to ${r}`)):console.log("Prediction: Safe.")}catch(n){console.error("Error during prediction:",n.message)}return!0}})})}const d=async e=>{const t="https://snailly-block.netlify.app/";if(!e||!e.url){console.error("No current tab URL found.");return}try{const o=await fetch(h+"/classified-url/dangerous-website",{method:"GET",headers:{"Content-Type":"application/json",Authorization:`Bearer ${g}`}});if(!o.ok)throw new Error(`HTTP error! Status: ${o.status}`);const s=(await o.json()).data.filter(l=>l.FINAL_label==="berbahaya").map(l=>l.url),n=l=>l.replace(/^https?:\/\/(www\.)?/,"").split("/")[0],r=s.map(n),i=e.url,c=n(i);console.log("Dangerous List:",r),console.log("Current Domain:",c),console.log("Check Link:",r.includes(c)),r.includes(c)?(p(),chrome.tabs.update(e.id,{url:t}),console.log(`Redirected from ${e.url} to ${t}`),console.log("Send History:",sendHistory)):(b(),console.log(`URL not in dangerous list. Extracting text from: ${e.url}`),f(e.id))}catch(o){console.error("Error checking URL:",o.message)}},f=e=>{chrome.scripting.executeScript({target:{tabId:e},files:["content.js"]})};function p(){chrome.storage.local.get(["totalDangerousWebsites"],e=>{let t=(e.totalDangerousWebsites||0)+1;chrome.storage.local.set({totalDangerousWebsites:t},()=>{console.log("Total Dangerous Websites updated to: "+t)})})}function b(){chrome.storage.local.get(["totalSafeWebsites"],e=>{let t=(e.totalSafeWebsites||0)+1;chrome.storage.local.set({totalSafeWebsites:t},()=>{console.log("Total Safe Websites updated to: "+t)})})}
