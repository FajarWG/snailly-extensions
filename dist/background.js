const u=async t=>{if(!self.ai||!self.ai.languageModel)return;const e=`You are an advanced AI model trained for sentiment and content analysis. Your task is to classify the overall sentiment and type of content on a website as either "Positive" or "Negative" based on the following criteria:
  
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
  "${t}"`;try{const{available:o,defaultTemperature:r,defaultTopK:s,maxTopK:n}=await ai.languageModel.capabilities();let a;if(o!=="no"){const i=await ai.languageModel.create();a=await i.prompt(e),i&&(i.destroy(),console.log("Session destroyed."))}return a}catch(o){console.error("Error during AI processing:",o.message)}};chrome.runtime.onInstalled.addListener(()=>{console.log("Chrome Extension is installed!"),l(),chrome.storage.onChanged.addListener((t,e)=>{e==="local"&&t.token&&l()})});chrome.storage.local.get(["token"],t=>{t.token});function l(){chrome.storage.local.get(["token"],t=>{if(!t.token){console.error("You need to log in to use this extension");return}console.log("User Already Logged In"),chrome.tabs.onActivated.addListener(e=>{chrome.tabs.query({active:!0,currentWindow:!0},o=>{const r=o[0];console.log("Current Tab URL:",r.url),!r.url.includes("snailly-block.netlify.app")&&c(r.id)})}),chrome.tabs.onUpdated.addListener((e,o,r)=>{o.status==="complete"&&chrome.tabs.query({active:!0,currentWindow:!0},s=>{const n=s[0];console.log("Current Tab:",s),console.log("Current Tab URL:",n.url),!n.url.includes("snailly-block.netlify.app")&&c(n.id)})}),chrome.runtime.onMessage.addListener(async(e,o,r)=>{if(e.type==="extractedText"){const s=e.text.split(" ").slice(0,100).join(" ");console.log("Text Snippet:",s);try{const n=await u(s);console.log("Response from AI Model:",n);const a="https://snailly-block.netlify.app/";n.toLowerCase()==="negative"?(d(),chrome.tabs.update(o.tab.id,{url:a}),console.log(`Prediction: Dangerous. Redirected to ${a}`)):(g(),console.log("Prediction: Safe."))}catch(n){console.error("Error during prediction:",n.message)}return!0}})})}const c=t=>{chrome.scripting.executeScript({target:{tabId:t},files:["content.js"]})};function d(){chrome.storage.local.get(["totalDangerousWebsites"],t=>{let e=(t.totalDangerousWebsites||0)+1;chrome.storage.local.set({totalDangerousWebsites:e},()=>{console.log("Total Dangerous Websites updated to: "+e)})})}function g(){chrome.storage.local.get(["totalSafeWebsites"],t=>{let e=(t.totalSafeWebsites||0)+1;chrome.storage.local.set({totalSafeWebsites:e},()=>{console.log("Total Safe Websites updated to: "+e)})})}
