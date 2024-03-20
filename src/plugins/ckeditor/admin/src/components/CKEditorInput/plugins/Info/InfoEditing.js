import InsertInfoCommand from "./InfoCommand";

const Plugin = window.CKEditor5.core.Plugin;
const Widget = window.CKEditor5.widget.Widget;
const toWidget = window.CKEditor5.widget.toWidget;
const toWidgetEditable = window.CKEditor5.widget.toWidgetEditable;


export default class InfoEditing extends Plugin {
    static get requires() {
        return [ Widget ];
    }
  init() {
    console.log( 'InfoEditing#init() got called' );

    this._defineSchema();
    this._defineConverters();
    this.editor.commands.add( 'insertInfo', new InsertInfoCommand( this.editor ) );
  }
  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.register( 'Info', {
      // Behaves like a self-contained block object (e.g. a block image)
      // allowed in places where other blocks are allowed (e.g. directly in the root).
        inheritAllFrom: '$blockObject',
        allowAttributes: [ 'title' ],
        allowChildren: '$text',
    });

    schema.register( 'InfoContent', {
      // Cannot be split or left by the caret.
        isLimit: true,
        allowIn: 'Info',
        allowContentOf: '$root'
    } );
  }

  _defineConverters() {
    const conversion = this.editor.conversion;

    conversion.for( 'dataDowncast' ).elementToElement( {
      model: {
          name: 'Info',
          attributes: [ 'title' ]
      },
        view: ( modelElement, { writer } ) => {
            return writer.createContainerElement(
                'section',  { class: 'Info', title: modelElement.getAttribute( 'title' )}
            );
      }
    } );
    conversion
      .for( 'editingDowncast' )
      .elementToElement( {
          model: {
              name: 'Info',
              attributes: [ 'title' ]
          },
          view: ( modelElement, { writer } ) => {
              const section = writer.createContainerElement( 'section', { class: 'Info' } );

              return toWidget( section, writer, { label: 'Info widget' } );
          }
      } );

    conversion
        .for( 'upcast' )
        .elementToElement( {
          view: {
            name: 'section',
            attributes: [ 'title' ],
            classes: 'Info'
          },
          model: ( viewElement, { writer } ) => {
            return writer.createElement( 'Info', { title: viewElement.getAttribute( 'title' ) } );
          }
        } );



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
          view: ( modelElement, { writer: writer } ) => {
              // Note: You use a more specialized createEditableElement() method here.
              const div = writer.createEditableElement( 'div' );

              return toWidgetEditable( div, writer );
          }
      } );

  }
}
