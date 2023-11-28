module.exports = [
  {
    method: "GET",
    path: "/check",
    handler: "githubPublish.check",
    config: { policies: [] },
  },
  {
    method: "POST",
    path: "/publish",
    handler: "githubPublish.publish",
    config: { policies: [] },
  },
  {
    method: "POST",
    path: "/getTexts",
    handler: "githubPublish.getTexts",
    config: { policies: [] },
  },
];
