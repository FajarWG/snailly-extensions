const c=async o=>{const{available:e}=await ai.languageModel.capabilities();e==="no"&&(console.log("AI model not available."),await ai.languageModel.create({monitor(t){t.addEventListener("downloadprogress",r=>{console.log(`Downloaded ${r.loaded} of ${r.total} bytes.`)})}}));const a=`You are an advanced AI model trained for sentiment and content analysis. Your task is to classify the overall sentiment and type of content on a website as either "Positive" or "Negative" based on the following criteria:
  
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
  "${o}"`;try{const{available:t}=await ai.languageModel.capabilities();let r;if(t!=="no"){const s=await ai.languageModel.create();r=await s.prompt(a),s&&(s.destroy(),console.log("Session destroyed."))}return r}catch(t){console.error("Error during AI processing:",t.message)}},m=async o=>{console.log("Sudah masuk summarize model"),console.log("Content",o),chrome.storage.local.set({lastSummary:"In progress"},()=>{console.log("Summary in progress...")});try{const e=await ai.summarizer.capabilities();console.log("Summarizer capabilities:",e);let a;e&&e.available!=="no"&&(e.available==="readily"?a=await ai.summarizer.create():(console.log("The summarizer is not immediately available. It will be ready in a few moments. Please wait..."),a=await ai.summarizer.create(),a.addEventListener("downloadprogress",t=>{console.log(t.loaded,t.total)}),await a.ready))}catch(e){chrome.storage.local.set({lastSummary:"Error model Summarize Not Available"}),console.error("Error model Summarize Not Available:",e.message)}try{const e=await summarizer.summarize(o);return console.log(e),e}catch(e){console.error("Error during AI processing:",e.message)}},d=()=>{chrome.storage.local.get(["totalDangerousWebsites"],o=>{const e=(o.totalDangerousWebsites||0)+1;chrome.storage.local.set({totalDangerousWebsites:e},()=>{console.log("Total Dangerous Websites updated to:",e)})})},u=()=>{chrome.storage.local.get(["totalSafeWebsites"],o=>{const e=(o.totalSafeWebsites||0)+1;chrome.storage.local.set({totalSafeWebsites:e},()=>{console.log("Total Safe Websites updated to:",e)})})},l=o=>{chrome.scripting.executeScript({target:{tabId:o},files:["content.js"]})},g=()=>new Promise(o=>{chrome.storage.local.get(["token"],e=>{o(e.token||null)})}),n=async()=>{if(!await g()){console.error("You need to log in to use this extension");return}console.log("User Already Logged In"),chrome.tabs.onActivated.addListener(p),chrome.tabs.onUpdated.addListener(h)},p=o=>{chrome.tabs.query({active:!0,currentWindow:!0},e=>{const a=e[0];a.url.includes("snailly-block.netlify.app")||l(a.id)})},h=(o,e,a)=>{e.status==="complete"&&chrome.tabs.query({active:!0,currentWindow:!0},t=>{const r=t[0];r.url.includes("snailly-block.netlify.app")||l(r.id)})},i="https://snailly-block.netlify.app/";chrome.runtime.onInstalled.addListener(()=>{console.log("Chrome Extension is installed!"),n(),chrome.storage.onChanged.addListener((o,e)=>{e==="local"&&o.token&&n()})});chrome.runtime.onMessage.addListener(async(o,e,a)=>{if(o.type==="extractedText"){const t=o.text.split(" ").slice(0,150).join(" ");console.log("Text Snippet:",t);try{const r=await c(t);console.log("Response from AI Model:",r),r.toLowerCase()==="negative"?(d(),chrome.tabs.update(e.tab.id,{url:i}),console.log(`Prediction: Dangerous. Redirected to ${i}`)):(u(),console.log("Prediction: Safe."))}catch(r){console.error("Error during prediction:",r.message)}return!0}else if(o.type==="summarize"){try{const t=await m(o.content);chrome.storage.local.set({lastSummary:t},()=>{a({success:!0})})}catch(t){console.error("Summarization error:",t.message),a({success:!1,error:t.message})}return!0}});
