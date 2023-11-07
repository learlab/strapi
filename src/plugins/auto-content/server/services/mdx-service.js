"use strict";

// const unified = require("unified");
// const rehypeParse = require("rehype-parse");
// const rehypeRewrite = require("rehype-rewrite");
// const rehypeRemark = require("rehype-remark");
// const remarkStringify = require("remark-stringify");

var TurndownService = require('turndown')
var turndownPluginGfm = require('joplin-turndown-plugin-gfm')

var turndownService = new TurndownService()

// Use the GitHub Flavored Markdown plugin
var gfm = turndownPluginGfm.gfm
turndownService.use(gfm)

// Preserve MDX Components
turndownService.keep([
  'keyterm',
  'exercise',
  'image',
  'steps',
  'youtubevideo',
  'accordion',
  'info',
  'callout',
  'warning',
  'columns',
  'column',
  'tabs',
  'caption',
  'blockquote'
])

// Add rewrite rules
turndownService.addRule('strikethrough', {
  filter: ['del', 's', 'strike'],
  replacement: function (content) {
    return '~' + content + '~'
  }
})

module.exports = ({ strapi }) => {
  const mdx = async (html) => {
    return turndownService.turndown(html)
  };

  return {
    mdx,
  };
};

// module.exports = ({ strapi }) => {
//   const mdx = async (html) => {
//     return await unified()
//       .use(rehypeParse)
//       .use(rehypeRewrite, (node, index, parent) => {
//         if (node.tagName == 'div' && node.properties.className?.includes('coding-time')) {
//           node.tagName = 'codingTime'
//           node.properties = null
//           node.children = null
//         }
//       })
//       .use(rehypeRemark)
//       .use(remarkStringify)
//       .process(html)
//   };

//   return {
//     mdx,
//   };
// };
