import InsertStaticCodeCommand from "./StaticCodeCommand.js";

const Plugin = window.CKEditor5.core.Plugin;
const Widget = window.CKEditor5.widget.Widget;
const toWidget = window.CKEditor5.widget.toWidget;
const toWidgetEditable = window.CKEditor5.widget.toWidgetEditable;

export default class StaticCodeEditing extends Plugin {
    static get requires() {
        return [ Widget ];
    }

    init() {

        this._defineSchema();
        this._defineConverters();

        this.editor.commands.add( 'insertStaticCode', new InsertStaticCodeCommand( this.editor ) );
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register( 'StaticCode', {
            // Behaves like a self-contained block object (e.g. a block image)
            // allowed in places where other blocks are allowed (e.g. directly in the root).
            inheritAllFrom: '$blockObject'
        } );

        schema.register( 'StaticCodeAttributes', {
            // Cannot be split or left by the caret.
            isLimit: true,

            allowIn: 'StaticCode',

            // Allow content which is allowed in blocks (i.e. text with attributes).
            allowContentOf: '$block'
        } );

        schema.register( 'StaticCodeContent', {
            // Cannot be split or left by the caret.
            isLimit: true,

            allowIn: 'StaticCode',
            allowChildren: ["codeBlock"],
        } );
    }

    _defineConverters() {
        const conversion = this.editor.conversion;

        // <simpleBox> converters
        conversion.for( 'upcast' ).elementToElement( {
            model: 'StaticCode',
            view: {
                name: 'section',
                classes: 'StaticCode'
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'StaticCode',
            view: {
                name: 'section',
                classes: 'StaticCode'
            }
        } );
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'StaticCode',
            view: ( modelElement, { writer: viewWriter } ) => {
                const section = viewWriter.createContainerElement( 'section', { class: 'StaticCode' } );

                return toWidget( section, viewWriter, { label: 'staticCode widget' } );
            }
        } );

        // <simpleBoxTitle> converters
        conversion.for( 'upcast' ).elementToElement( {
            model: 'StaticCodeAttributes',
            view: {
                name: 'p',
                classes: 'StaticAttributes'
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'StaticCodeAttributes',
            view: {
                name: 'p',
                classes: 'StaticAttributes'
            }
        } );
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'StaticCodeAttributes',
            view: ( modelElement, { writer: viewWriter } ) => {
                // Note: You use a more specialized createEditableElement() method here.
                const p = viewWriter.createEditableElement( 'p');

                return toWidgetEditable( p, viewWriter );
            }
        } );

        // <simpleBoxDescription> converters
        conversion.for( 'upcast' ).elementToElement( {
            model: 'StaticCodeContent',
            view: {
                name: 'div',
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'StaticCodeContent',
            view: {
                name: 'div',
            }
        } );
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'StaticCodeContent',
            view: ( modelElement, { writer: viewWriter } ) => {
                // Note: You use a more specialized createEditableElement() method here.
                const div = viewWriter.createEditableElement( 'div' );

                return toWidgetEditable( div, viewWriter );
            }
        } );
    }
}