export const summarizeModel = async (content) => {
  console.log("Sudah masuk summarize model");
  console.log("Content", content);
  chrome.storage.local.set({ lastSummary: "In progress" }, () => {
    console.log("Summary in progress...");
  });
  try {
    const canSummarize = await ai.summarizer.capabilities();
    console.log("Summarizer capabilities:", canSummarize);
    let summarizer;
    if (canSummarize && canSummarize.available !== "no") {
      if (canSummarize.available === "readily") {
        summarizer = await ai.summarizer.create();
      } else {
        console.log(
          "The summarizer is not immediately available. It will be ready in a few moments. Please wait..."
        );

        summarizer = await ai.summarizer.create();
        summarizer.addEventListener("downloadprogress", (e) => {
          console.log(e.loaded, e.total);
        });
        await summarizer.ready;
      }
    }
  } catch (error) {
    chrome.storage.local.set({
      lastSummary: "Error model Summarize Not Available",
    });
    console.error("Error model Summarize Not Available:", error.message);
  }

  try {
    summarizer = await ai.summarizer.create();
    const result = await summarizer.summarize(content);
    console.log(result);

    return result;
  } catch (error) {
    console.error("Error during AI processing:", error.message);
  }
};
