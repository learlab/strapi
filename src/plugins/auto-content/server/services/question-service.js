"use strict";

const fetch = require("node-fetch");

module.exports = ({ strapi }) => {
  const generateQuestion = async (text) => {
    try {
      // prompt is based on formatting from parse-gpt-mc notebook
      const prompt = [
        {
          role: "user",
          content:
            'Generate a question and a short answer based on the passage below. The answer should be one sentence long. Provide your response as a properly formatted JSON object with the following schema: {"question": `a question based on the passage.`, "answer": `a correct short answer to the question. The answer should be one sentence long.`}\n\nPassage: ' + text,
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
