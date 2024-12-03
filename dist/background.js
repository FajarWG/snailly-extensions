const c=async e=>{const{available:t}=await ai.languageModel.capabilities();t==="no"&&(console.log("AI model not available."),await ai.languageModel.create({monitor(n){n.addEventListener("downloadprogress",o=>{console.log(`Downloaded ${o.loaded} of ${o.total} bytes.`)})}}));const a=`You are an advanced AI model trained for sentiment and content analysis. Your task is to classify the overall sentiment and type of content on a website as either "Positive" or "Negative" based on the following criteria:
  
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
  "${e}"`;try{const{available:n}=await ai.languageModel.capabilities();let o;if(n!=="no"){const s=await ai.languageModel.create();o=await s.prompt(a),s&&(s.destroy(),console.log("Session destroyed."))}return o}catch(n){console.error("Error during AI processing:",n.message)}},d=()=>{chrome.storage.local.get(["totalDangerousWebsites"],e=>{const t=(e.totalDangerousWebsites||0)+1;chrome.storage.local.set({totalDangerousWebsites:t},()=>{console.log("Total Dangerous Websites updated to:",t)})})},u=()=>{chrome.storage.local.get(["totalSafeWebsites"],e=>{const t=(e.totalSafeWebsites||0)+1;chrome.storage.local.set({totalSafeWebsites:t},()=>{console.log("Total Safe Websites updated to:",t)})})},l=e=>{chrome.scripting.executeScript({target:{tabId:e},files:["content.js"]})},g=()=>new Promise(e=>{chrome.storage.local.get(["token"],t=>{e(t.token||null)})}),i=async()=>{if(!await g()){console.error("You need to log in to use this extension");return}console.log("User Already Logged In"),chrome.tabs.onActivated.addListener(p),chrome.tabs.onUpdated.addListener(m)},p=e=>{chrome.tabs.query({active:!0,currentWindow:!0},t=>{const a=t[0];a.url.includes("snailly-block.netlify.app")||l(a.id)})},m=(e,t,a)=>{t.status==="complete"&&chrome.tabs.query({active:!0,currentWindow:!0},n=>{const o=n[0];o.url.includes("snailly-block.netlify.app")||l(o.id)})},r="https://snailly-block.netlify.app/";chrome.runtime.onInstalled.addListener(()=>{console.log("Chrome Extension is installed!"),i(),chrome.storage.onChanged.addListener((e,t)=>{t==="local"&&e.token&&i()})});chrome.runtime.onMessage.addListener(async(e,t,a)=>{if(e.type==="extractedText"){const n=e.text.split(" ").slice(0,150).join(" ");console.log("Text Snippet:",n);try{const o=await c(n);console.log("Response from AI Model:",o),o.toLowerCase()==="negative"?(d(),chrome.tabs.update(t.tab.id,{url:r}),console.log(`Prediction: Dangerous. Redirected to ${r}`)):(u(),console.log("Prediction: Safe."))}catch(o){console.error("Error during prediction:",o.message)}return!0}});
