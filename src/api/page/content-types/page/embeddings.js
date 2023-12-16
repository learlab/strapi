'use strict';

async function generatePageEmbeddings(ctx) {
    const entry = await strapi.entityService.findOne('api::page.page', ctx.id, {populate: "*"});
    const module = await strapi.entityService.findOne('api::chapter.chapter', entry.chapter.id, {populate: "module"});

    const payload = entry.Content.map(item => ({
        text_slug: entry.text.slug,
        module_slug: module.module.slug,
        chapter_slug: entry.chapter.slug,
        page_slug: entry.slug,
        chunk_slug: item.Slug,
        content: item.CleanText,
      }));

    payload.map(item => strapi.service('api::page.page').generateEmbedding(item));

}

module.exports = {
    generatePageEmbeddings,
};