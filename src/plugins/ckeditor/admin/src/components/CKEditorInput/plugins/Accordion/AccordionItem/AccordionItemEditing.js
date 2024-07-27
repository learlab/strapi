import InsertAccordionItemCommand from "./AccordionItemCommand.js";

const Plugin = window.CKEditor5.core.Plugin;
const Widget = window.CKEditor5.widget.Widget;
const toWidget = window.CKEditor5.widget.toWidget;
const toWidgetEditable = window.CKEditor5.widget.toWidgetEditable;

export default class AccordionItemEditing extends Plugin {
    static get requires() {
        return [ Widget ];
    }

    init() {

        this._defineSchema();
        this._defineConverters();

        this.editor.commands.add( 'insertAccordionItem', new InsertAccordionItemCommand( this.editor ) );
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register( 'AccordionItem', {
            // Behaves like a self-contained block object (e.g. a block image)
            // allowed in places where other blocks are allowed (e.g. directly in the root).
            // inheritAllFrom: '$Object',
            isObject: true,
            allowIn: 'AccordionContent',
        } );

        schema.register( 'AccordionItemTitle', {
            // Cannot be split or left by the caret.
            isLimit: true,

            allowIn: 'AccordionItem',

            // Allow content which is allowed in blocks (i.e. text with attributes).
            allowContentOf: '$block'
        } );

        schema.register( 'AccordionItemContent', {
            // Cannot be split or left by the caret.
            isLimit: true,

            allowIn: 'AccordionItem',

            // Allow content which is allowed in the root (e.g. paragraphs).
            allowContentOf: '$root'
        } );

        schema.addChildCheck( ( context, childDefinition ) => {
            if ( (context.endsWith( 'AccordionItemContent' )||context.endsWith( 'AccordionItemTitle' )) && childDefinition.name == 'simpleBox' ) {
                return false;
            }
        } );
    }

    _defineConverters() {
        const conversion = this.editor.conversion;

        // <simpleBox> converters
        conversion.for( 'upcast' ).elementToElement( {
            model: 'AccordionItem',
            view: {
                name: 'section',
                classes: 'AccordionItem'
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'AccordionItem',
            view: {
                name: 'section',
                classes: 'AccordionItem'
            }
        } );
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'AccordionItem',
            view: ( modelElement, { writer: viewWriter } ) => {
                const section = viewWriter.createContainerElement( 'section', { class: 'AccordionItem' } );

                return toWidget( section, viewWriter, { label: 'accordionItem widget' } );
            }
        } );

        // <simpleBoxTitle> converters
        conversion.for( 'upcast' ).elementToElement( {
            model: 'AccordionItemTitle',
            view: {
                name: 'h1',
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'AccordionItemTitle',
            view: {
                name: 'h1',
            }
        } );
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'AccordionItemTitle',
            view: ( modelElement, { writer: viewWriter } ) => {
                // Note: You use a more specialized createEditableElement() method here.
                const h1 = viewWriter.createEditableElement( 'h1');

                return toWidgetEditable( h1, viewWriter );
            }
        } );

        // <simpleBoxDescription> converters
        conversion.for( 'upcast' ).elementToElement( {
            model: 'AccordionItemContent',
            view: {
                name: 'div',
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'AccordionItemContent',
            view: {
                name: 'div',
            }
        } );
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'AccordionItemContent',
            view: ( modelElement, { writer: viewWriter } ) => {
                // Note: You use a more specialized createEditableElement() method here.
                const div = viewWriter.createEditableElement( 'div' );

                return toWidgetEditable( div, viewWriter );
            }
        } );
    }
}