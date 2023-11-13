"use strict";

const fetch = require("node-fetch");

module.exports = ({ strapi }) => {
  const getTranscript = async (url, start, end) => {
    const start_num = parseInt(start);
    const end_num = parseInt(end);

    const payload = JSON.stringify({
      url: url,
      start_time: start_num,
      end_time: end_num,
    });

    try {
      const response = await fetch(
        `https://itell-api.learlab.vanderbilt.edu/generate/transcript`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: payload,
        }
      );
      const res = await response.json();
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    getTranscript,
  };
};
