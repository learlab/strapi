import InfoEditing from './InfoEditing.js';
import InfoUI from './InfoUI.js';

const Plugin = window.CKEditor5.core.Plugin;
export default class Info extends Plugin {
  static get requires() {
    return [ InfoEditing, InfoUI ];
  }

  static get pluginName() {
    return 'Info';
  }
}
