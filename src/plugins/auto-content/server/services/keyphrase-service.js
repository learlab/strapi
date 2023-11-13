"use strict";

const fetch = require("node-fetch");

module.exports = ({ strapi }) => {
  const extractKeyPhrase = async (text) => {
    const ctx = strapi.requestContext.get();
    console.log(ctx);
    try {
      // prompt is based on formatting from parse-gpt-mc notebook
      const prompt = [
        {
          role: "user",
          content:
            'Extract five keywords from the passage below. A keyword can be more than one word, but is usually less than three words. They should be helpful in understanding students the contents of the passage. Provide your response as with each keyword on a newline without bullet points. \n\nPassage: ' + text,
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
            max_tokens: 100,
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
