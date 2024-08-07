"use strict";
const { ApplicationError } = require("@strapi/utils/dist/errors");
const yup = require("yup");

function validateKeyPhraseField(event) {
  const { data } = event.params;
  const schema = yup.array().of(yup.string());
  const keyphrase_string = data.KeyPhrase ? data.KeyPhrase : "[]";
  try {
    schema.validateSync(keyphrase_string);
  } catch (ValidationError) {
    throw new ApplicationError(
      `Header: ${data.Header}\nKeyphrase Parsing Error: ${keyphrase_string}`,
    );
  }
}

module.exports = {
  validateKeyPhraseField,
};
