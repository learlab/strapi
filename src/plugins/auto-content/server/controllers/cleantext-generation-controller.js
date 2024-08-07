module.exports = ({ strapi }) => {
  const cleanTextService =
    strapi.plugins["auto-content"].service("cleanTextService");

  const cleanText = async (ctx) => {
    const text = ctx.request.body.text;

    if (text && text.length > 0) {
      try {
        return cleanTextService.cleanText(text);
      } catch (err) {
        console.log(err);
        ctx.throw(500, err);
      }
    }
    return ctx.throw(400, "Text is missing.");
  };

  return {
    cleanText,
  };
};
