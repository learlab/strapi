"use strict";

var TurndownService = require("joplin-turndown");
var turndownPluginGfm = require("joplin-turndown-plugin-gfm");

var turndownService = new TurndownService({
  codeBlockStyle: "fenced",
});

// Use the GitHub Flavored Markdown plugin
var gfm = turndownPluginGfm.gfm;
turndownService.use(gfm);

// Utility function to construct JSX attributes from HTML DOM
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
//rule for coding sandboxes
turndownService.addRule("static code", {
  filter: function (node) {
    return (
      node.nodeName === "SECTION" &&
      node.getAttribute('class') === 'StaticCode'
    );
  },
  replacement: function (content, node, options) {
    const attributes = node.querySelector('p');;

    const codeBlock = node.querySelector('pre code');
    const language = codeBlock.className.split('-')[1];

    const codeContent = codeBlock.textContent.trim()

    return `\`\`\`${language} ${attributes.textContent.trim()}\n${codeContent}\n\`\`\``;
  },
});

// Info
turndownService.addRule("InfoRule", {
  filter: function (node) {
    return node.nodeName === "SECTION" && node.getAttribute("class") === "Info";
  },
  replacement: function (content, node) {
    const titles = Array.from(node.querySelectorAll("h1"));
    const title = titles.map((h1) => h1.textContent.trim()).join(" <br/>\n");

    const paragraphs = Array.from(node.querySelectorAll("p"));
    const paragraphContent = paragraphs
      .map((p) => p.textContent.trim())
      .join(" <br/>\n");
    return `<Info title="${title}">\n${paragraphContent}\n</Info>\n`;
  },
});

// Warnings
turndownService.addRule("WarningRule", {
  filter: function (node) {
    return (
      node.nodeName === "SECTION" && node.getAttribute("class") === "Warning"
    );
  },
  replacement: function (content, node) {
    const paragraphs = Array.from(node.querySelectorAll("p"));
    const paragraphContent = paragraphs
      .map((p) => p.textContent.trim())
      .join(" <br/>\n");
    return `<Warning>\n${paragraphContent}\n</Warning>`;
  },
});

// Callouts
turndownService.addRule("CalloutRule", {
  filter: function (node) {
    return (
      node.nodeName === "SECTION" && node.getAttribute("class") === "Callout"
    );
  },
  replacement: function (content, node) {
    const paragraphs = Array.from(node.querySelectorAll("p"));
    const paragraphContent = paragraphs
      .map((p) => p.textContent.trim())
      .join(" <br/>\n");
    return `<Callout>\n${paragraphContent}\n</Callout>`;
  },
});

// Accordions
/* DataModel
  <div class="accordion accordion-items-stay-open" data-accordion-id="">
    <div class="accordion-item">
        <div class="accordion-header">
            <a class="accordion-button" href="#">
                Accordion Title
            </a>
        </div>
        <div class="accordion-collapse collapse show">
            <div class="accordion-body">
                <p>Accordion Content</p>
            </div>
        </div>
    </div>
  </div>
*/
/* MDX Export
  <Accordion value="first" className="prose dark:prose-invert">
    <AccordionItem value="1" title="Accordion Title">
        <p>Accordion Content</p>
    </AccordionItem>
  </Accordion>
*/
turndownService.addRule("AccordionRule", {
  filter: function (node) {
    return node.nodeName === "DIV" && node.classList.contains("accordion");
  },
  replacement: function (content, node) {
    const itemsDataModel = Array.from(node.querySelectorAll(".accordion-item"));
    let itemsJsxString = "";
    let count = 0;
    itemsDataModel.map((item) => {
      // Get simple textContent from header. Otherwise, we would need to handle the href in the data model.
      const title = item.querySelector(".accordion-header").textContent.trim();

      // Get innerHtml from body. This has not been thoroughly tested, but is intended
      // to preserve e.g., lists, linebreaks that would be lost with .textContent.
      const content = item.querySelector(".accordion-body").innerHTML;

      itemsJsxString += `<AccordionItem value="${(count += 1)}" title="${title}">\n${content}\n</AccordionItem>\n`;
    });
    return `<Accordion value="first" className="prose dark:prose-invert">\n${itemsJsxString}</Accordion>\n`;
  },
});

// Images
turndownService.addRule("image", {
  filter: function (node, options) {
    return (
      node.nodeName === "FIGURE" &&
      node.getAttribute("class").startsWith("image")
    );
  },

  replacement: function (content, node, options) {
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

// Converts linebreaks
// TODO: Explain why this is needed.
turndownService.addRule("convertLineBreaks", {
  filter: "br",
  replacement: function (content) {
    return "<br/>";
  },
});

// Interactive Coding Sandboxes (REPLs)
turndownService.addRule("code", {
  filter: function (node) {
    return (
      node.nodeName === "SECTION" &&
      node.getAttribute("class") === "CodingSandbox"
    );
  },
  replacement: function (content, node, options) {
    const codeBlock = node.querySelector("pre code");
    const language = codeBlock.className.split("-")[1];

    const codeContent = codeBlock.textContent.trim();

    if (language === "python") {
      return `<Notebook code = {\`${codeContent}\`}/>\n`;
    } else if (language === "javascript") {
      return `<Sandbox code = {\`${codeContent}\`}/>\n`;
    }
  },
});

module.exports = ({ strapi }) => {
  const mdx = async (html) => {
    if (!html) return null;
    return turndownService.turndown(html);
  };

  return {
    mdx,
  };
};
