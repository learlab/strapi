import CodingSandboxEditing from "./CodingSandboxEditing.js";
import CodingSandboxUI from "./CodingSandboxUI.js";

const Plugin = window.CKEditor5.core.Plugin;
export default class CodingSandbox extends Plugin {
  static get requires() {
    return [CodingSandboxEditing, CodingSandboxUI];
  }

  static get pluginName() {
    return "CodingSandbox";
  }
}
