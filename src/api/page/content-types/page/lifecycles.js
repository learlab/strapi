const { generatePageEmbeddings, deleteAllEmbeddings } = require('./embeddings');

module.exports = { 
    afterCreate: async (event) => {
        const { result, params } = event;
        generatePageEmbeddings(result);
    },

    afterUpdate: async (event) => {
        const { result, params } = event;
        generatePageEmbeddings(result);
    },

    beforeDelete: async (event) => {
        const { result, params } = event;
        await deleteAllEmbeddings(params.where.id);
    }
  };