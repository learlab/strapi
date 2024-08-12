/**
 * Checks if a provided element is an accordion widget.
 */
export function isAccordionWidget(element) {
  return element.hasClass("ckeditor5-accordion__widget");
}

/**
 * Gets the selected accordion widget.
 */
export function getSelectedAccordionWidget(selection) {
  const accordion = selection.focus
    ?.getAncestors()
    .reverse()
    .find((node) => node.is("element") && isAccordionWidget(node));
  return accordion?.is("element") ? accordion : null;
}

/**
 * Gets the selected accordion item model element.
 */
export function getSelectedAccordionItemModelElement(selection) {
  return selection.getFirstPosition()?.findAncestor("AccordionItem");
}

/**
 * Gets the selected accordion model element.
 */
export function getSelectedAccordionModelElement(selection) {
  return selection.getFirstPosition()?.findAncestor("AccordionBlock");
}

/**
 * Creates a `<accordionItem>` model element with the necessary child elements.
 */
export function createAccordionItem(writer, isOpen = true) {
  const accordionItem = writer.createElement("AccordionItem");
  const accordionItemHeader = writer.createElement("AccordionItemHeader");
  const accordionItemButton = writer.createElement("AccordionItemButton", {
    AccordionButtonCollapsed: isOpen ? "false" : "true",
  });
  const accordionCollapse = writer.createElement("AccordionCollapse", {
    AccordionCollapseShow: isOpen ? "true" : "false",
  });
  const accordionItemContent = writer.createElement("AccordionItemContent");

  writer.append(accordionItemHeader, accordionItem);
  writer.append(accordionItemButton, accordionItemHeader);
  writer.append(accordionCollapse, accordionItem);
  writer.append(accordionItemContent, accordionCollapse);

  // The accordionItemContent text content will automatically be wrapped in a
  // `<p>`.
  writer.appendElement("paragraph", accordionItemContent);

  return {
    accordionItem,
    accordionItemHeader,
    accordionItemButton,
    accordionCollapse,
    accordionItemContent,
  };
}

export function isAccordionItemOpen(accordionItem) {
  let isOpen = false;
  [...accordionItem.getChildren()].forEach((node) => {
    if (node.is("element", "AccordionCollapse")) {
      // If the second item is open, assume someone ran the "open all"
      // command earlier, and make sure any new accordion items are
      // open as well.
      isOpen = node.getAttribute("AccordionCollapseShow") === "true";
    }
  });
  return isOpen;
}

/**
 * Opens or collapses an accordion item.
 */
export function setAccordionItemIsOpen(accordionItem, writer, isOpen) {
  [...accordionItem.getChildren()].forEach((node) => {
    if (node.is("element", "AccordionItemHeader")) {
      [...node.getChildren()].forEach((node) => {
        if (node.is("element", "AccordionButton")) {
          writer.setAttribute(
            "AccordionItemButtonCollapsed",
            isOpen ? "false" : "true",
            node
          );
        }
      });
    } else if (node.is("element", "AccordionCollapse")) {
      writer.setAttribute(
        "AccordionCollapseShow",
        isOpen ? "true" : "false",
        node
      );
    }
  });
}
