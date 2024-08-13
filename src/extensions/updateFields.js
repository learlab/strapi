"use strict";
var slugify = require("slugify");
// const { validateKeyPhraseField } = require('./validations');
const fieldSuffixes = require("./fieldSuffixes");

async function slugPipeline(chunkName, databaseID, chunkTypeSuffix) {
  if (chunkName) {
    //removes all special characters from the chunk before slugging it
    const slug = slugify(chunkName, { remove: /[*+~.()'"!:@]/g });
    return `${slug}-${databaseID.toString()}${chunkTypeSuffix}`;
  } else {
    return "";
  }
}

async function generateSlugAfterCreate(event) {
  const { result, model } = event;

  const databaseID = result.id;
  const fieldSuffixVars = fieldSuffixes[model.singularName];

  const chunkName = result[fieldSuffixVars["fieldName"]];
  const chunkTypeSuffix = fieldSuffixVars["suffix"];

  result.Slug = await slugPipeline(chunkName, databaseID, chunkTypeSuffix);

  await strapi.query(String(model.uid)).update({
    where: { id: databaseID },
    data: result,
  });
}

async function generateSlugBeforeUpdate(event) {
  const { model } = event;
  const { data } = event.params;

  const databaseID = data.id;
  const fieldSuffixVars = fieldSuffixes[model.singularName];

  const chunkName = data[fieldSuffixVars["fieldName"]];
  const chunkTypeSuffix = fieldSuffixVars["suffix"];

  const slug = await slugPipeline(chunkName, databaseID, chunkTypeSuffix);
  event.params.data.Slug = slug;

  return event;
}

async function generateChunkFields(event) {
  const { data } = event.params;

  let pageSlug;
  let pageID;

  // Database entry needs to exist before the parent page can be located
  // Database will not exist on "beforeCreate"
  if (event.action === "beforeUpdate") {
    // Finds the page that contains the current component
    // Uses the underlying knex connection to interact directly with the DB.
    pageID = await strapi.db
      .connection("pages_components")
      .where({ component_id: data.id })
      .pluck("entity_id")
      .then((arr) => arr[0]); // entity_id is unique; only one value in this array
  }
  if (pageID) {
    // Using the pageID, find the Slug of the parent page.
    const page = await strapi.entityService.findOne("api::page.page", pageID, {
      fields: ["Slug"],
    });
    pageSlug = page.Slug;
  } else {
    // TODO: Handle the case where the chunk is being created.
    // Probably need to set a field on the chunk to store the page slug.
    // Strapi does not make the page available in the Chunk's event object.
    pageSlug = "placeholder-page-slug-until-chunk-is-updated";
  }

  // Update the Fields
  const cleanText = await strapi
    .service("plugin::auto-content.cleanTextService")
    .cleanText(data.Text);

  const mdx = await strapi
    .service("plugin::auto-content.mdxService")
    .mdx(pageSlug, data.Text);

  event.params.data.CleanText = cleanText;
  event.params.data.MDX = mdx;

  return event;
}

async function generateVideoFields(event) {
  const { data } = event.params;

  const transcript = await strapi
    .service("plugin::auto-content.fetchTranscriptService")
    .getTranscript(data.URL, data.StartTime, data.EndTime);

  var mdx = "<YoutubeVideo\n" + `src=${data.URL}\n`;

  if (data.Title) mdx += `title="${data.Title}"`;

  if (data.Description) mdx += `\n>\n${data.Description}`;
  else mdx += ">";

  mdx += "\n</YoutubeVideo>";

  event.params.data.CleanText = transcript;
  event.params.data.MDX = mdx;

  return event;
}

module.exports = {
  generateSlugAfterCreate,
  generateSlugBeforeUpdate,
  generateChunkFields,
  generateVideoFields,
};
