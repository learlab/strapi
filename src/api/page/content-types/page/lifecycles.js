module.exports = { 
    afterCreate: async (event) => {
        const { result, params } = event;
        const entry = await strapi.entityService.findOne('api::page.page', result.id, {populate: "*"});
        const module = await strapi.entityService.findOne('api::chapter.chapter', entry.chapter.id, {populate: "module"});

        const payload = entry.Content.map(item => ({
            Slug: item.Slug,
            Chunk: item.CleanText,
            TextTitle: entry.text.Title,
            ModuleTitle: module.module.Title,
            ChapterTitle: entry.chapter.Title,
          }));

        strapi.service('api::page.page').generateEmbedding(payload);

        console.log(payload);
    },

    afterUpdate: async (event) => {
        const { result, params } = event;
        const entry = await strapi.entityService.findOne('api::page.page', result.id, {populate: "*"});
        const module = await strapi.entityService.findOne('api::chapter.chapter', entry.chapter.id, {populate: "module"});

        const payload = entry.Content.map(item => ({
            Slug: item.Slug,
            Chunk: item.CleanText,
            TextTitle: entry.text.Title,
            ModuleTitle: module.module.Title,
            ChapterTitle: entry.chapter.Title,
          }));

        strapi.service('api::page.page').generateEmbedding(payload);

        console.log(payload);
    },
  };