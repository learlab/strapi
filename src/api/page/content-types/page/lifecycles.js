const { generatePageEmbeddings } = require('./embeddings');

module.exports = { 
    afterCreate: async (event) => {
        const { result, params } = event;
        generatePageEmbeddings(result);
    },

    afterUpdate: async (event) => {
        const { result, params } = event;
        generatePageEmbeddings(result);
    },
  };