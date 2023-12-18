"use strict";

async function generatePageEmbeddings(ctx) {
  const entry = await strapi.entityService.findOne("api::page.page", ctx.id, {
    populate: "*",
  });

  var chapter = null;
  const chapter_id = entry.chapter ? entry.chapter.id : null;
  if (chapter_id) {
    chapter = await strapi.entityService.findOne(
      "api::chapter.chapter",
      chapter_id,
      { populate: "module" }
    );
  }

  const payload = entry.Content.map((item) => ({
    text_slug: entry.text.slug,
    module_slug: chapter.module ? chapter.module.slug : null,
    chapter_slug: chapter ? chapter.slug : null,
    page_slug: entry.slug,
    chunk_slug: item.Slug,
    content: item.CleanText,
  }));

  payload.map((item) =>
    strapi.service("api::page.page").generateEmbedding(item)
  );
}

module.exports = {
  generatePageEmbeddings,
};
