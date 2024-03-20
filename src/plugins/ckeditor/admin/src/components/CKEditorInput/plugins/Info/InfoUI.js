import './Info.css';
import FormView from './InfoView';

const Plugin = window.CKEditor5.core.Plugin;
const ButtonView = window.CKEditor5.ui.ButtonView;
const ContextualBalloon = window.CKEditor5.ui.ContextualBalloon;
const clickOutsideHandler = window.CKEditor5.ui.clickOutsideHandler;

export default class InfoUI extends Plugin {
  static get requires() {
    return [ ContextualBalloon];
  }

  init() {
    console.log( 'InfoUI#init() got called' );

    const editor = this.editor;
    const t = editor.t;

    this._balloon = this.editor.plugins.get( ContextualBalloon );
    this.formView = this._createFormView();

    // The "Info" button must be registered among the UI components of the editor
    // to be displayed in the toolbar.
    editor.ui.componentFactory.add( 'Info', locale => {
      // The state of the button will be bound to the widget command.
      const command = editor.commands.get( 'insertInfo' );

      // The button will be an instance of ButtonView.
      const buttonView = new ButtonView( locale );

      buttonView.set( {
        // The t() function helps localize the editor. All strings enclosed in t() can be
        // translated and change when the language of the editor changes.
        label: t( 'Blue Box' ),
        withText: true,
        tooltip: true
      } );

      // Bind the state of the button to the command.
      buttonView.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

      // Execute the command when the button is clicked (executed).
      this.listenTo( buttonView, 'execute', () => {

        editor.execute( 'insertInfo' )
      } );

      this.listenTo( buttonView, 'execute', () => {
        this._showUI();
      } );

      return buttonView;
    } );
  }

  _createFormView() {
    const editor = this.editor;
    const formView = new FormView( editor.locale );

    this.listenTo( formView, 'submit', () => {
      const InfoTitle = formView.InfoTitle.fieldView.element.value;
      editor.model.change( writer => {
        const Info = writer.createElement( 'Info' , {title: InfoTitle});
        const h3 = writer.createElement( 'heading3');
        const InfoContent = writer.createElement( 'InfoContent');

        writer.append(h3, Info );
        writer.appendText( InfoTitle, h3 );
        writer.append(InfoContent, Info)
        writer.appendElement( 'paragraph', InfoContent );

        this.editor.model.insertObject(Info);
      } );
      this._hideUI();
    } );

    this.listenTo( formView, 'cancel', () => {
      this._hideUI();
    } );

    // Hide the form view when clicking outside the balloon.
    clickOutsideHandler( {
      emitter: formView,
      activator: () => this._balloon.visibleView === formView,
      contextElements: [ this._balloon.view.element ],
      callback: () => this._hideUI()
    } );

    return formView;
  }

  _hideUI() {
    this.formView.InfoTitle.fieldView.value = '';
    this.formView.element.reset();

    this._balloon.remove( this.formView );

    // Focus the editing view after closing the form view.
    this.editor.editing.view.focus();
  }

  _getBalloonPositionData() {
    const view = this.editor.editing.view;
    const viewDocument = view.document;
    let target = null;

    // Set a target position by converting view selection range to DOM.
    target = () => view.domConverter.viewRangeToDom(
        viewDocument.selection.getFirstRange()
    );

    return {
      target
    };
  }

  _showUI() {
    this._balloon.add( {
      view: this.formView,
      position: this._getBalloonPositionData()
    } );

    this.formView.focus();
  }
}
