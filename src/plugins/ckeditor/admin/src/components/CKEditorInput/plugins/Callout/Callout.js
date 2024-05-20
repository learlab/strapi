import CalloutEditing from './CalloutEditing.js';
import CalloutUI from './CalloutUI.js';

const Plugin = window.CKEditor5.core.Plugin;
export default class Callout extends Plugin {
    static get requires() {
        return [ CalloutEditing, CalloutUI ];
    }

    static get pluginName() {
        return 'Callout';
    }
}
