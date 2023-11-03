module.exports = {
  // accessible only from admin UI
  type: "admin",
  routes: [
    {
      method: "POST",
      path: "/generate-question",
      handler: "contentGenerator.generateQuestion",
      config: { policies: [] },
    },
  ],
};
