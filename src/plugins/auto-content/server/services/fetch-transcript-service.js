"use strict";

const fetch = require("node-fetch");

module.exports = ({ strapi }) => {
  const getTranscript = async (url, start, end) => {
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
            start_time: start,
            end_time: (end ? end : null)
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
