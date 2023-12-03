'use strict';
const { ApplicationError } = require('@strapi/utils/dist/errors');

function validateKeyPhraseField(keyPhrases) {
    let failed;
    // Deal with empty fields
    if (!keyPhrases) {
        keyPhrases = "[]"
    }
    // Flag bad syntax
    try {
        const attemptedJSON = JSON.parse(keyPhrases);
        failed = false;
    } catch {
        failed = true;
    }
    // This needs to be outside of a try/catch block
    if (failed) {
        throw new ApplicationError("Please check your JSON array's syntax", { policy: 'JSON-validate' });
    }
}

module.exports = {
    validateKeyPhraseField,
};