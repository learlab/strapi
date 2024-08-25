import SyntaxEditing from "./syntaxEditing.js";

const Plugin = window.CKEditor5.core.Plugin;

export default class Syntax extends Plugin {
  static get requires() {
    return [SyntaxEditing];
  }

  init() {}
}
