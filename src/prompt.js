export const promptModel = async (content) => {
  const { available } = await ai.languageModel.capabilities();

  if (available === "no") {
    console.log("AI model not available.");
    await ai.languageModel.create({
      monitor(m) {
        m.addEventListener("downloadprogress", (e) => {
          console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
        });
      },
    });
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
  "${content}"`;

  try {
    const { available } = await ai.languageModel.capabilities();

    let fullResponse;
    if (available !== "no") {
      const session = await ai.languageModel.create();

      fullResponse = await session.prompt(promptTemplate);

      if (session) {
        session.destroy();
        console.log("Session destroyed.");
      }
    }

    return fullResponse;
  } catch (error) {
    console.error("Error during AI processing:", error.message);
  }
};
