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

  // Update the Fields
  const cleanText = await strapi
    .service("plugin::auto-content.cleanTextService")
    .cleanText(data.Text);

  const mdx = await strapi
    .service("plugin::auto-content.mdxService")
    .mdx(data.Text);

  const md = await strapi
    .service("plugin::auto-content.mdService")
    .md(data.Text);
  
  event.params.data.CleanText = cleanText;
  event.params.data.MDX = mdx;
  event.params.data.MD = md;

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
