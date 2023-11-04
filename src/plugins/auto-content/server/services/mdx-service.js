"use strict";
import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeRewrite from 'rehype-rewrite';
import rehypeStringify from 'rehype-stringify';

module.exports = ({ strapi }) => {
  const cleanText = async (html) => {
    unified()
    .use(rehypeParse)
    .use(removeTables)
    .use(rehypeRewrite, {
      rewrite: (node, index, parent) => {
        if(node.tagName == 'div' && node.properties.className?.includes('coding-time')) {
          node.tagName = 'codingTime'
          node.properties = null
          node.children = null
        }
      }
    })
    .use(rehypeStringify)
    .processSync(html)
    .toString()
  };
  
  return {
    cleanText,
  };
};
