module.exports = {
  // accessible only from admin UI
  type: "admin",
  routes: [
    {
      method: "POST",
      path: "/fetch-transcript",
      handler: "transcriptGenerator.fetchTranscript",
      config: { policies: [] },
    },
  ],
};
