"use strict";

var TurndownService = require("joplin-turndown");
var turndownPluginGfm = require("joplin-turndown-plugin-gfm");
// Overrides the escape() method, enlarging it.

const originalEscape = TurndownService.prototype.escape;
TurndownService.prototype.escape = function escape(string) {
  string = originalEscape(string);

  // Escape "$" so they are not interpreted by NextJS as inline math
  // Uses a negative lookahead and negative look behind
  // This leaves "$$" unescaped, to allow for MathJax inline math ("$$...$$")
  //string = string.replace(/\$(?!\$)(?<!\$\$)(?<!\\\$)/g, "$");

  return string;
};

var turndownService = new TurndownService({
  codeBlockStyle: "fenced",
});

// Use the GitHub Flavored Markdown plugin
var gfm = turndownPluginGfm.gfm;
turndownService.use(gfm);

// MDX Components in iTELL
// TODO: add support for nested components (steps, columns, accordion, tabs)
// TODO: add support for multimedia (image, video, coding time)
const componentNames = [
  "Definition",
  "Keyterm",
  // 'Exercise', // <div class="exercise">...</div>
  // 'Image', // <img alt="">...</img>
  // 'Steps', // <div class="steps">...<ul>...</ul></div>
  // 'YoutubeVideo', // VideoChunk only
  // 'Accordion', // <details>...</details> (single element only)
  "Info",
  "Callout",
  "Warning",
  // 'Columns', // <div class="columns">...</div>
  // 'Column', // <div class="column">...</div>
  // 'Tabs', // <div class="tabs">...<div class="tabs-header|body">...</div>
  // 'TabsHeader', // <div class="tabs-header">...</div>
  // 'TabsBody', // <div class="tabs-body">...</div>
  // 'TabPanel', // <div class="tab-panel">...</div>
  // 'TextOverImage', // <img class="text-over-image">...</img>
  "Caption",
  "Blockquote",
  // 'CodeRepl',
  // 'CodingTime'
];

// construct component name map to handle case insensitivity in HTML DOM
const componentNameMap = Object.fromEntries(
  componentNames.map((compName) => [compName.toUpperCase(), compName])
);

// utility function to construct JSX attributes from HTML DOM
function stringifyAttributes(element, separator = " ") {
  var attrStr = Array.from(element.attributes)
    .filter((attr) => attr.specified && attr.name !== "class")
    .map((attr) => `${attr.name}="${attr.value}"`)
    .join(separator);
  if (attrStr.length > 0) {
    attrStr = separator + attrStr;
  }
  return attrStr;
}

// Rule for elements that consist of attributes and content only
turndownService.addRule("styles", {
  filter: function (node, options) {
    return ["INFO", "WARNING", "CALLOUT", "BLOCKQUOTE", "DEFINITION"].includes(node.nodeName);
  },

  replacement: function (content, node, options) {
    const tag = componentNameMap[node.nodeName];
    var attrStr = stringifyAttributes(node, " ");
    console.log(`<${tag}${attrStr}>${content}</${tag}>`);
    return `<${tag}${attrStr}>${content}</${tag}>`;
  },
});

// Rule for images
turndownService.addRule("image", {
  filter: function (node, options) {
    return (
      node.nodeName === "FIGURE" &&
      node.getAttribute("class").startsWith("image")
    );
  },

  replacement: function (content, node, options) {
    console.log(content);
    const tag = "Image";
    let firstImg = null;
    let figcaption = null;

    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i];
      if (child.nodeName === "IMG") firstImg = child;
      if (child.nodeName === "FIGCAPTION") figcaption = child.textContent;
    }

    var attrStr = stringifyAttributes(firstImg, "\n  ");

    return `<${tag}${attrStr}>\n${figcaption}\n</${tag}>`;
  },
});

//rule for python notebook chunks
turndownService.addRule("code", {
  filter: 'pre',
  replacement: function (content, node, options) {
    const tag = componentNameMap[node.nodeName];
    var attrStr = stringifyAttributes(node, " ");
    //console.log(`<${tag}${attrStr}>${content}</${tag}>`);

    return content;
  },
});

//rule for python notebook chunks
turndownService.addRule("python", {
  filter: 'code',
  replacement: function (content, node, options) {
    content = content.replace("\t", "\\t");
    content = content.replace("\n", "\\n");
    return `<Notebook code = ['${content}']/>`;
  },
});

// turndownService.addRule("dollar", {
//   filter: function (content, node, options) {
//     return node.nodeType === 3;
//   },
//   replacement: function (content, node, options) {
//     // replace $ with \$ unless it's $$
//     // $$ is used for MathJax
//     return content.replace(/\$/g, "XXX");
//   },
// });

module.exports = ({ strapi }) => {
  const mdx = async (html) => {
    if (!html) return null;
    return turndownService.turndown(html);
  };

  return {
    mdx,
  };
};
