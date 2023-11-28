"use strict";

const fetch = require("node-fetch");

module.exports = ({ strapi }) => {
  const extractKeyPhrase = async (text) => {
    const ctx = strapi.requestContext.get();
    try {
      // prompt is based on formatting from parse-gpt-mc notebook
      const prompt = [
        {
          role: "user",
          content:
            'Extract up to 5 important keyphrases from the following passage. A keyphrase can be several words or just one word. The passage comes from an instructional text, so it is important that keyphrases help students understand the passage within the context of the text. The list of keyphrases should be formatted as a valid JSON array, with each keyphrase separated by a comma. \n\nPassage: ' + text + '\n\nKeyphrases: ',
        },
      ];
      const response = await fetch(
        `https://api.openai.com/v1/chat/completions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${strapi
              .plugin("auto-content")
              .config("API_TOKEN")}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: prompt,
            temperature: 0.7,
            max_tokens: 120,
          }),
        }
      );
      const res = await response.json();
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    extractKeyPhrase,
  };
};
