'use strict';

module.exports = {
  contentGenerator: require('./content-generation-controller'),
  cleanTextGenerator: require('./cleantext-generation-controller'),
  transcriptGenerator: require('./fetch-transcript-controller'),
};
