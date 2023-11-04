"use strict";
import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import { remove } from "unist-util-remove"
import { toText } from 'hast-util-to-text'
import { isElement } from "hast-util-is-element"

function removeTables() {
    return (tree) =>
        remove(tree, { cascade: true }, (node) => {
            return isElement(node, "table")
        }) || undefined
}

function rehypeText(options) {
    const self = this
    const settings = { ...self.data('settings'), ...options }

    self.compiler = compiler

    function compiler(tree) {
        return toText(tree, settings)
    }
}

module.exports = ({ strapi }) => {
  const cleanText = async (html) => {
    unified()
    .use(rehypeParse)
    .use(removeTables)
    .use(rehypeText)
    .processSync(html)
    .toString()
  };
  
  return {
    cleanText,
  };
};
