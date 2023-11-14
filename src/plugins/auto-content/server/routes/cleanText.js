module.exports = {
  // accessible only from admin UI
  type: "admin",
  routes: [
    {
      method: "POST",
      path: "/clean-text",
      handler: "cleanTextGenerator.cleanText",
      config: { policies: [] },
    },
  ],
};
