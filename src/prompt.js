export const promptModel = async (textSnippet) => {
  if (!self.ai || !self.ai.languageModel) {
    return;
  }

  const promptTemplate = `You are an advanced AI model trained for sentiment and content analysis. Your task is to classify the overall sentiment and type of content on a website as either "Positive" or "Negative" based on the following criteria:
  
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
  "${textSnippet}"`;

  let fullResponse = "";

  try {
    // if (!session) {
    //   await updateSession();
    //   updateStats();
    // }

    // Kirim permintaan dengan streaming
    // const stream = await session.promptStreaming(promptTemplate);

    // for await (const chunk of stream) {
    //   fullResponse = chunk.trim(); // Simpan jawaban terakhir dari stream
    // }

    const { available, defaultTemperature, defaultTopK, maxTopK } =
      await ai.languageModel.capabilities();

    let fullResponse;
    if (available !== "no") {
      const session = await ai.languageModel.create();

      fullResponse = await session.prompt(promptTemplate);

      if (session) {
        session.destroy();
        console.log("Session destroyed.");
      }
    }

    console.log("Response from AI Model:", fullResponse);

    // Validasi jawaban fullResponse lowercase
    if (fullResponse.toLowerCase() === "negative") {
      const redirectionUrl = "https://snailly-block.netlify.app/";
      chrome.tabs.update(sender.tab.id, { url: redirectionUrl });
      console.log(`Prediction: Negative. Redirected to ${redirectionUrl}`);
    } else {
      console.log("Prediction: Positive. No redirection.");
    }
  } catch (error) {
    console.error("Error during AI processing:", error.message);
  }
};
