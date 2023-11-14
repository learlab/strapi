module.exports = ({ strapi }) => {
  const keyPhraseService =
    strapi.plugins["auto-content"].service("keyPhraseService");

  const extractKeyPhrase = async (ctx) => {
    const text = ctx.request.body.text;

    if (text && text.length > 0) {
      try {
        return keyPhraseService.extractKeyPhrase(text);
      } catch (err) {
        console.log(err);
        ctx.throw(500, err);
      }
    }
    return ctx.throw(
      400,
      "Text is missing."
    );
  };

  return {
    extractKeyPhrase,
  };
};
