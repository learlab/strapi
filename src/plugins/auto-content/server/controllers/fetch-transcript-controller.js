module.exports = ({ strapi }) => {
  const fetchTranscriptService = strapi.plugins["auto-content"].service(
    "fetchTranscriptService",
  );

  const fetchTranscript = async (ctx) => {
    const url = ctx.request.body.url;
    const startTime = ctx.request.body.startTime;
    const endTime = ctx.request.body.endTime;

    if (url) {
      try {
        return fetchTranscriptService.getTranscript(url, startTime, endTime);
      } catch (err) {
        console.log(err);
        ctx.throw(500, err);
      }
    }

    return ctx.throw(400, "URL is missing.");
  };

  return {
    fetchTranscript,
  };
};
