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
            'Please generate a few important keyphrases from the following passage. The passage comes from an educational text, so it is important that the keyphrases are helpful for students. Provide a list of keyphrases in valid JSON format, like this: ["Keyphrase 1", "Keyphrase 2"] \n\n' + text + '\n\nKeyphrases: ',
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
