import StaticCodeEditing from './StaticCodeEditing.js';
import StaticCodeUI from './StaticCodeUI.js';

const Plugin = window.CKEditor5.core.Plugin;
export default class StaticCode extends Plugin {
    static get requires() {
        return [ StaticCodeEditing, StaticCodeUI ];
    }

    static get pluginName() {
        return 'StaticCode';
    }
}
