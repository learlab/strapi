"use strict";

const unified = require("unified");
const rehypeParse = require("rehype-parse");
const rehypeRewrite = require("rehype-rewrite");
const rehypeRemark = require("rehype-remark");
const remarkStringify = require("remark-stringify");

module.exports = ({ strapi }) => {
  const mdx = async (html) => {
    return await unified()
      .use(rehypeParse)
      .use(rehypeRewrite, (node, index, parent) => {
        if (node.tagName == 'div' && node.properties.className?.includes('coding-time')) {
          node.tagName = 'codingTime'
          node.properties = null
          node.children = null
        }
      })
      .use(rehypeRemark)
      .use(remarkStringify)
      .process(html)
  };

  return {
    mdx,
  };
};
