import HLJSCodeBlockEditing from "./hljscodeblockediting";
import HLJSCodeBlockUI from "./hljscodeblockui";
import Syntax from "./syntax";

const Plugin = window.CKEditor5.core.Plugin;

export default class HLJSCodeBlock extends Plugin {
  static get requires() {
    return [Syntax, HLJSCodeBlockEditing, HLJSCodeBlockUI];
  }

  static get pluginName() {
    return "HLJSCodeBlock";
  }
}
