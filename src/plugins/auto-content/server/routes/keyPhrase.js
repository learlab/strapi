module.exports = {
  // accessible only from admin UI
  type: "admin",
  routes: [
    {
      method: "POST",
      path: "/extract-keyphrase",
      handler: "keyPhraseGenerator.extractKeyPhrase",
      config: { policies: [] },
    },
  ],
};
