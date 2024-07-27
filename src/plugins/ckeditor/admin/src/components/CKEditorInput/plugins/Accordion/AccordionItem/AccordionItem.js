import AccordionItemEditing from './AccordionItemEditing.js';
import AccordionItemUI from './AccordionItemUI.js';

const Plugin = window.CKEditor5.core.Plugin;
export default class AccordionItem extends Plugin {
    static get requires() {
        return [ AccordionItemEditing, AccordionItemUI ];
    }

    static get pluginName() {
        return 'AccordionItem';
    }
}
