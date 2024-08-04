import './StaticCode.css';

const Plugin = window.CKEditor5.core.Plugin;
const ui = window.CKEditor5.ui
const utils = window.CKEditor5.utils

export default class StaticCodeUI extends Plugin {
    init() {
        console.log('StaticCodeUI#init() got called');

        const editor = this.editor;
        const t = editor.t;
        const items = new utils.Collection();
        items.add({
            type: 'button',
            model: {
                withText: true,
                label: t('Python'),
                class: undefined
            }
        })

        items.add({
            type: 'button',
            model: {
                withText: true,
                label: t('JavaScript'),
                class: undefined
            }
        })
        // to be displayed in the toolbar.
        editor.ui.componentFactory.add('StaticCode', locale => {
            const dropdownView = ui.createDropdown( locale);
            const command = editor.commands.get( 'insertStaticCode' );

            dropdownView.set({
                label: "Static Code",
                tooltip: true,
                withText: true,
            });

            dropdownView.buttonView.set( {
                label: t( 'Static Code' ),
                tooltip: true,
                isToggleable: true,
                withText: true,
            } );

            dropdownView.on( 'execute', evt => {
                editor.execute( 'insertStaticCode', (evt.source).label);
            } );

            dropdownView.class = 'ck-code-block-dropdown';
            dropdownView.bind( 'isEnabled' ).to( command );

            ui.addListToDropdown( dropdownView, items);

            return dropdownView;
        });
    }
}
