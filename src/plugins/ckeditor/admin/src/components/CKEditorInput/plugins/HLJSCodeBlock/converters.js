import {
  rawSnippetTextToModelDocumentFragment,
  getPropertyAssociation,
  domCodeToModel,
} from "./utils";

import hljs from "highlight.js";

export function modelToViewCodeBlockInsertion(
  model,
  languageDefs,
  useLabels = false,
) {
  // Language CSS classes:
  //
  //		{
  //			php: 'language-php',
  //			python: 'language-python',
  //			javascript: 'js',
  //			...
  //		}
  const languagesToClasses = getPropertyAssociation(
    languageDefs,
    "language",
    "class",
  );

  // Language labels:
  //
  //		{
  //			php: 'PHP',
  //			python: 'Python',
  //			javascript: 'JavaScript',
  //			...
  //		}
  const languagesToLabels = getPropertyAssociation(
    languageDefs,
    "language",
    "label",
  );

  return (evt, data, conversionApi) => {
    const { writer, mapper, consumable } = conversionApi;

    if (!consumable.consume(data.item, "insert")) {
      return;
    }
    const codeBlockLanguage = data.item.getAttribute("language");
    const targetViewPosition = mapper.toViewPosition(
      model.createPositionBefore(data.item),
    );
    const preAttributes = {};

    // Attributes added only in the editing view.
    if (useLabels) {
      preAttributes["data-language"] = languagesToLabels[codeBlockLanguage];
      preAttributes.spellcheck = "false";
    }

    const pre = writer.createContainerElement("pre", preAttributes);
    const code = writer.createContainerElement("code", {
      class: languagesToClasses[codeBlockLanguage] || null,
    });

    writer.insert(writer.createPositionAt(pre, 0), code);
    writer.insert(targetViewPosition, pre);
    mapper.bindElements(data.item, code);
  };
}

export function modelToDataViewSoftBreakInsertion(model) {
  return (evt, data, conversionApi) => {
    if (data.item.parent.name !== "hljsCodeBlock") {
      return;
    }

    const { writer, mapper, consumable } = conversionApi;

    if (!consumable.consume(data.item, "insert")) {
      return;
    }

    const position = mapper.toViewPosition(
      model.createPositionBefore(data.item),
    );

    writer.insert(position, writer.createText("\n"));
  };
}

export function dataViewToModelCodeBlockInsertion(editingView, languageDefs) {
  // Language names associated with CSS classes:
  //
  //		{
  //			'language-php': 'php',
  //			'language-python': 'python',
  //			js: 'javascript',
  //			...
  //		}
  /*{
    language-c: "c"
    language-cpp: "cpp"
    language-cs: "cs"
    language-css: "css"
    language-diff: "diff"
    language-html: "html"
  } */
  const classesToLanguages = getPropertyAssociation(
    languageDefs,
    "class",
    "language",
  );
  const defaultLanguageName = languageDefs[0].language;

  return (evt, data, conversionApi) => {
    const viewItem = data.viewItem;
    const viewChild = viewItem.getChild(0);

    if (!viewChild || !viewChild.is("element", "code")) {
      return;
    }

    const { consumable, writer } = conversionApi;

    if (
      !consumable.test(viewItem, {
        name: true,
      }) ||
      !consumable.test(viewChild, {
        name: true,
      })
    ) {
      return;
    }

    const codeBlock = writer.createElement("hljsCodeBlock");
    const viewChildClasses = [...viewChild.getClassNames()];
    if (!viewChildClasses.length) {
      viewChildClasses.push("");
    }
    for (const className of viewChildClasses) {
      const language = classesToLanguages[className];

      if (language) {
        writer.setAttribute("language", language, codeBlock);
        break;
      }
    }
    if (!codeBlock.hasAttribute("language")) {
      writer.setAttribute("language", defaultLanguageName, codeBlock);
    }

    // HTML elements are invalid content for `<code>`.
    // Read only text nodes.
    const textData = [...editingView.createRangeIn(viewChild)]
      .filter((current) => current.type === "text")
      .map(({ item }) => item.data)
      .join("");

    const res = hljs.highlight(codeBlock.getAttribute("language"), textData);
    const dom = new DOMParser().parseFromString(
      "<div>" + res.value + "</div>",
      "text/xml",
    );
    // const fragment = rawSnippetTextToModelDocumentFragment(writer, textData);
    const fragment = domCodeToModel(dom, writer);
    writer.append(fragment, codeBlock);
    // writer.append(viewChild, codeBlock)

    // Let's try to insert code block.
    if (!conversionApi.safeInsert(codeBlock, data.modelCursor)) {
      return;
    }

    consumable.consume(viewItem, {
      name: true,
    });
    consumable.consume(viewChild, {
      name: true,
    });

    conversionApi.updateConversionResult(codeBlock, data);
  };
}
