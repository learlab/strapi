"use strict";

const fetch = require("node-fetch");

module.exports = ({ strapi }) => {
  const generateQuestion = async (text) => {
    const ctx = strapi.requestContext.get();
    console.log(ctx);
    try {
      const prompt = [
        {
          role: "user",
          content:
            "Write a question about the following text:\n\n" + text + "\n\nQ:",
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
    generateQuestion,
  };
};
