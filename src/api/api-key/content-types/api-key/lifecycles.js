const { createAPIKey } = require('./api-key-crud');
const { deleteAPIKey } = require('./api-key-crud');

module.exports = { 
    afterCreate: async (event) => {
        const { result, params } = event;
        createAPIKey(result);
    },

    beforeDelete: async (event) => {
        const { result, params } = event;
        await deleteAPIKey(params.where.id);
    },

    beforeDeleteMany: async (event) => {
        const { result, params } = event;
        for (let id of params.where["$and"][0].id["$in"]) {
            await deleteAPIKey(id);
        }
    }
  };