import AccordionEditing from "./AccordionEditing.js";
import AccordionUI from "./AccordionUI.js";

const Plugin = window.CKEditor5.core.Plugin;

export default class Accordion extends Plugin {
  static get requires() {
    return [AccordionEditing, AccordionUI];
  }

  static get pluginName() {
    return "Accordion";
  }
}
