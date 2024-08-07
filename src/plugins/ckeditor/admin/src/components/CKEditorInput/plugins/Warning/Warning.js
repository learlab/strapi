import WarningEditing from "./WarningEditing.js";
import WarningUI from "./WarningUI.js";

const Plugin = window.CKEditor5.core.Plugin;
export default class Warning extends Plugin {
  static get requires() {
    return [WarningEditing, WarningUI];
  }

  static get pluginName() {
    return "Warning";
  }
}
