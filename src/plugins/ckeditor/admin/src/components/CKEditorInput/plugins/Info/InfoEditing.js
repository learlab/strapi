import InsertInfoCommand from "./InfoCommand.js";

const Plugin = window.CKEditor5.core.Plugin;
const Widget = window.CKEditor5.widget.Widget;
const toWidget = window.CKEditor5.widget.toWidget;
const toWidgetEditable = window.CKEditor5.widget.toWidgetEditable;

export default class InfoEditing extends Plugin {
  static get requires() {
    return [ Widget ];
  }

  init() {

    this._defineSchema();
    this._defineConverters();

    this.editor.commands.add( 'insertInfo', new InsertInfoCommand( this.editor ) );
  }

  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.register( 'Info', {
      // Behaves like a self-contained block object (e.g. a block image)
      // allowed in places where other blocks are allowed (e.g. directly in the root).
      inheritAllFrom: '$blockObject'
    } );

    schema.register( 'InfoTitle', {
      // Cannot be split or left by the caret.
      isLimit: true,

      allowIn: 'Info',

      // Allow content which is allowed in blocks (i.e. text with attributes).
      allowContentOf: '$block'
    } );

    schema.register( 'InfoContent', {
      // Cannot be split or left by the caret.
      isLimit: true,

      allowIn: 'Info',

      // Allow content which is allowed in the root (e.g. paragraphs).
      allowContentOf: '$block'
    } );

    schema.addChildCheck( ( context, childDefinition ) => {
      if ( (context.endsWith( 'InfoContent' )||context.endsWith( 'InfoTitle' )) && childDefinition.name == 'Info' ) {
        return false;
      }
    } );
  }

  _defineConverters() {
    const conversion = this.editor.conversion;

    // <simpleBox> converters
    conversion.for( 'upcast' ).elementToElement( {
      model: 'Info',
      view: {
        name: 'section',
        classes: 'Info'
      }
    } );
    conversion.for( 'dataDowncast' ).elementToElement( {
      model: 'Info',
      view: {
        name: 'section',
        classes: 'Info'
      }
    } );
    conversion.for( 'editingDowncast' ).elementToElement( {
      model: 'Info',
      view: ( modelElement, { writer: viewWriter } ) => {
        const section = viewWriter.createContainerElement( 'section', { class: 'Callout' } );

        return toWidget( section, viewWriter, { label: 'info widget' } );
      }
    } );

    // <simpleBoxTitle> converters
    conversion.for( 'upcast' ).elementToElement( {
      model: 'InfoTitle',
      view: {
        name: 'h1',
      }
    } );
    conversion.for( 'dataDowncast' ).elementToElement( {
      model: 'InfoTitle',
      view: {
        name: 'h1',
      }
    } );
    conversion.for( 'editingDowncast' ).elementToElement( {
      model: 'InfoTitle',
      view: ( modelElement, { writer: viewWriter } ) => {
        // Note: You use a more specialized createEditableElement() method here.
        const h1 = viewWriter.createEditableElement( 'h1');

        return toWidgetEditable( h1, viewWriter );
      }
    } );

    // <simpleBoxDescription> converters
    conversion.for( 'upcast' ).elementToElement( {
      model: 'InfoContent',
      view: {
        name: 'div',
      }
    } );
    conversion.for( 'dataDowncast' ).elementToElement( {
      model: 'InfoContent',
      view: {
        name: 'div',
      }
    } );
    conversion.for( 'editingDowncast' ).elementToElement( {
      model: 'InfoContent',
      view: ( modelElement, { writer: viewWriter } ) => {
        // Note: You use a more specialized createEditableElement() method here.
        const div = viewWriter.createEditableElement( 'div' );

        return toWidgetEditable( div, viewWriter );
      }
    } );
  }
}
