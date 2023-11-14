"use strict";

var TurndownService = require('joplin-turndown')
var turndownPluginGfm = require('joplin-turndown-plugin-gfm')

var turndownService = new TurndownService()

// Use the GitHub Flavored Markdown plugin
var gfm = turndownPluginGfm.gfm
turndownService.use(gfm)

// MDX Components in iTELL
// TODO: add support for nested components (steps, columns, accordion, tabs)
// TODO: add support for multimedia (image, video, coding time)
const componentNames = [
  'Keyterm',
  // 'Exercise', // <div class="exercise">...</div>
  // 'Image', // <img alt="">...</img>
  // 'Steps', // <div class="steps">...<ul>...</ul></div>
  // 'YoutubeVideo', // VideoChunk only
  // 'Accordion', // <details>...</details> (single element only)
  'Info',
  'Callout',
  'Warning',
  // 'Columns', // <div class="columns">...</div>
  // 'Column', // <div class="column">...</div>
  // 'Tabs', // <div class="tabs">...<div class="tabs-header|body">...</div>
  // 'TabsHeader', // <div class="tabs-header">...</div>
  // 'TabsBody', // <div class="tabs-body">...</div>
  // 'TabPanel', // <div class="tab-panel">...</div>
  // 'TextOverImage', // <img class="text-over-image">...</img>
  'Caption',
  'Blockquote',
  // 'CodeRepl',
  // 'CodingTime'
]

// construct component name map to handle case insensitivity in HTML DOM
const componentNameMap = Object.fromEntries(
  componentNames.map(compName => [compName.toLowerCase(), compName])
);

// utility function to construct JSX attributes from HTML DOM
function stringifyAttributes(element) {
  return Array.from(element.attributes)
    .filter(attr => attr.specified && attr.name !== 'class')
    .map(attr => `${attr.name}="${attr.value}"`)
    .join(' ')
}

// function for elements that consist of attributes and content only
turndownService.addRule('styles', {
  filter: function (node, options) {
    return (
      ['info', 'warning', 'callout', 'keyterm', 'blockquote', 'caption']
        .includes(node.getAttribute('class'))
    )
  },

  replacement: function (content, node, options) {
    const tag = componentNameMap[node.getAttribute('class')]
    var attrStr = stringifyAttributes(node)
    if (attrStr.length > 0) {
      attrStr = ' ' + attrStr
    }
    return `<${tag}${attrStr}>${content}</${tag}>`
  }
})

module.exports = ({ strapi }) => {
  const mdx = async (html) => {
    if (!html) return null;
    return turndownService.turndown(html)
  };

  return {
    mdx,
  };
};