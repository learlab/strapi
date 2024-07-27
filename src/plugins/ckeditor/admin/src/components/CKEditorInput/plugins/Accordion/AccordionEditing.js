import InsertAccordionCommand from "./AccordionCommand.js";

const Plugin = window.CKEditor5.core.Plugin;
const Widget = window.CKEditor5.widget.Widget;
const toWidget = window.CKEditor5.widget.toWidget;
const toWidgetEditable = window.CKEditor5.widget.toWidgetEditable;

export default class AccordionEditing extends Plugin {
    static get requires() {
        return [ Widget ];
    }

    init() {

        this._defineSchema();
        this._defineConverters();

        this.editor.commands.add( 'insertAccordion', new InsertAccordionCommand( this.editor ) );
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register( 'Accordion', {
            // Behaves like a self-contained block object (e.g. a block image)
            // allowed in places where other blocks are allowed (e.g. directly in the root).
            inheritAllFrom: '$blockObject'
        } );

        schema.register( 'AccordionContent', {
            // Cannot be split or left by the caret.
            isLimit: true,

            allowIn: 'Accordion',

            // Allow content which is allowed in the root (e.g. paragraphs).
            allowContentOf: ['AccordionItem', 'paragraph']
        } );

        schema.addChildCheck( ( context, childDefinition ) => {
            if (context.endsWith( 'AccordionContent' ) && childDefinition.name == 'simpleBox' ) {
                return false;
            }
        } );
    }

    _defineConverters() {
        const conversion = this.editor.conversion;

        // <simpleBox> converters
        conversion.for( 'upcast' ).elementToElement( {
            model: 'Accordion',
            view: {
                name: 'section',
                classes: 'Accordion'
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'Accordion',
            view: {
                name: 'section',
                classes: 'Accordion'
            }
        } );
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'Accordion',
            view: ( modelElement, { writer: viewWriter } ) => {
                const section = viewWriter.createContainerElement( 'section', { class: 'Accordion' } );

                return toWidget( section, viewWriter, { label: 'accordion widget' } );
            }
        } );

        // <simpleBoxDescription> converters
        conversion.for( 'upcast' ).elementToElement( {
            model: 'AccordionContent',
            view: {
                name: 'div',
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'AccordionContent',
            view: {
                name: 'div',
            }
        } );
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'AccordionContent',
            view: ( modelElement, { writer: viewWriter } ) => {
                // Note: You use a more specialized createEditableElement() method here.
                const div = viewWriter.createEditableElement( 'div' );

                return toWidgetEditable( div, viewWriter );
            }
        } );
    }
}