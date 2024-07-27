import './CodingSandbox.css';

const Plugin = window.CKEditor5.core.Plugin;
const ButtonView = window.CKEditor5.ui.ButtonView;
const ui = window.CKEditor5.ui
const utils = window.CKEditor5.utils

export default class CodingSandboxUI extends Plugin {
    init() {
        console.log('CodingSandboxUI#init() got called');

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
        const normalizedLanguageDefs = ["python", "javascript"];

        // to be displayed in the toolbar.
        editor.ui.componentFactory.add('CodingSandbox', locale => {
            const dropdownView = ui.createDropdown( locale);
            const command = editor.commands.get( 'insertCodingSandbox' );

            dropdownView.set({
                label: "Coding Sandbox",
                tooltip: true,
                withText: true,
            });

            dropdownView.buttonView.set( {
                label: t( 'Coding Sandbox' ),
                tooltip: true,
                isToggleable: true,
                withText: true,
            } );

            // splitButtonView.bind( 'isOn' ).to( command, 'value', value => !!value );
            //
            // splitButtonView.on( 'execute', () => {
            //     editor.execute( 'insertCodingSandbox');
            // } );

            dropdownView.on( 'execute', evt => {
                editor.execute( 'insertCodingSandbox', (evt.source).label);
            //     editor.execute( 'codeBlock', {
            //         language: ( evt.source as any )._codeBlockLanguage,
            //         forceValue: true
            // } );
            //
            //     editor.editing.view.focus();
            } );

            dropdownView.class = 'ck-code-block-dropdown';
            dropdownView.bind( 'isEnabled' ).to( command );

            ui.addListToDropdown( dropdownView, items);

            return dropdownView;
        });
    }
}
