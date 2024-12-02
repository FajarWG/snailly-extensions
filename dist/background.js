const h=async e=>{if(!self.ai||!self.ai.languageModel)return;const o=`You are an advanced AI model trained for sentiment and content analysis. Your task is to classify the overall sentiment and type of content on a website as either "Positive" or "Negative" based on the following criteria:
  
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
  "${e}"`;try{const{available:t,defaultTemperature:n,defaultTopK:c,maxTopK:r}=await ai.languageModel.capabilities();let s;if(t!=="no"){const i=await ai.languageModel.create();s=await i.prompt(o),i&&(i.destroy(),console.log("Session destroyed."))}if(console.log("Response from AI Model:",s),s.toLowerCase()==="negative"){const i="https://snailly-block.netlify.app/";chrome.tabs.update(sender.tab.id,{url:i}),console.log(`Prediction: Negative. Redirected to ${i}`)}else console.log("Prediction: Positive. No redirection.")}catch(t){console.error("Error during AI processing:",t.message)}};chrome.runtime.onInstalled.addListener(()=>{console.log("Chrome Extension is installed!"),u(),chrome.storage.onChanged.addListener((e,o)=>{o==="local"&&e.token&&u()})});const g="https://snailly.unikom.ac.id";let d;chrome.storage.local.get(["token"],e=>{d=e.token});function u(){chrome.storage.local.get(["token"],e=>{if(!e.token){console.error("You need to log in to use this extension");return}console.log("Pengguna sudah login. Token ditemukan:",e.token),chrome.tabs.onActivated.addListener(o=>{chrome.tabs.query({active:!0,currentWindow:!0},t=>{const n=t[0];console.log("Current Tab URL:",n.url),p(n)})}),chrome.tabs.onUpdated.addListener((o,t,n)=>{t.status==="complete"&&chrome.tabs.query({active:!0,currentWindow:!0},c=>{const r=c[0];console.log("Current Tab URL:",r.url),p(r)})}),chrome.runtime.onMessage.addListener(async(o,t,n)=>{if(o.type==="extractedText"){const c=o.text.split(" ").slice(0,100).join(" ");try{const r=await h(c);if(!r.ok)throw new Error(`HTTP error! Status: ${r.status}`);if(r==="negative"){const s="https://snailly-block.netlify.app/";chrome.tabs.update(t.tab.id,{url:s}),console.log(`Prediction: Dangerous. Redirected to ${s}`)}else console.log("Prediction: Safe.");n({success:!0,prediction})}catch(r){console.error("Error during prediction:",r.message),n({success:!1,error:r.message})}return!0}})})}const m=async e=>{chrome.storage.local.get(["user"],async o=>{console.log("User Data:",e);const t={childId:o.user.id,parentId:o.user.parentsId,url:e,web_title:e.split("//")[1].split("/")[0].split(".")[1],web_description:"",detail_url:""};try{const n=await fetch(g+"/log",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${d}`},body:JSON.stringify(t)})}catch(n){console.error("Error inserting history:",n.message)}})},p=async e=>{const o="https://snailly-block.netlify.app/";if(!e||!e.url){console.error("No current tab URL found.");return}try{const t=await fetch(g+"/classified-url/dangerous-website",{method:"GET",headers:{"Content-Type":"application/json",Authorization:`Bearer ${d}`}});if(!t.ok)throw new Error(`HTTP error! Status: ${t.status}`);const c=(await t.json()).data.filter(a=>a.FINAL_label==="berbahaya").map(a=>a.url),r=a=>a.replace(/^https?:\/\/(www\.)?/,"").split("/")[0],s=c.map(r),i=e.url,l=r(i);if(console.log("Dangerous List:",s),console.log("Current Domain:",l),console.log("Check Link:",s.includes(l)),s.includes(l)){const a=await m(e.url);chrome.tabs.update(e.id,{url:o}),console.log(`Redirected from ${e.url} to ${o}`),console.log("Send History:",a)}else console.log(`URL not in dangerous list. Extracting text from: ${e.url}`),f(e.id)}catch(t){console.error("Error checking URL:",t.message)}},f=e=>{chrome.scripting.executeScript({target:{tabId:e},files:["content.js"]})};
