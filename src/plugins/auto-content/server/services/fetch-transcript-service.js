"use strict";

const fetch = require("node-fetch");

module.exports = ({ strapi }) => {
  const getTranscript = async (url, start, end) => {
    const start_num = parseInt(start);
    const end_num = parseInt(end);

    try {
      const response = await fetch(
        `https://itell-api.learlab.vanderbilt.edu/generate/transcript`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: url,
            start_time: start_num,
            end_time: (end_num ? end_num : null)
          }),
        }
      );
      const result = await response.json();
      return result.transcript;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    getTranscript,
  };
};
