const View = window.CKEditor5.ui.View;
const LabeledFieldView = window.CKEditor5.ui.LabeledFieldView;
const createLabeledInputText = window.CKEditor5.ui.createLabeledInputText;
const ButtonView = window.CKEditor5.ui.ButtonView;
const submitHandler = window.CKEditor5.ui.submitHandler;


const icons  = window.CKEditor5.core.icons;
export default class FormView extends View {
    constructor( locale ) {
        super( locale );
        this.InfoTitle = this._createInput( 'Add title' );

        // Create the save and cancel buttons.
        this.saveButtonView = this._createButton(
            'Save', icons.check, 'ck-button-save'
        );
        this.saveButtonView.type = 'submit';
        this.cancelButtonView = this._createButton(
            'Cancel', icons.cancel, 'ck-button-cancel'
        );
        // Delegate ButtonView#execute to FormView#cancel.
        this.cancelButtonView.delegate( 'execute' ).to( this, 'cancel' );

        this.cancelButtonView = this._createButton(
            'Cancel', icons.cancel, 'ck-button-cancel'
        );

        this.childViews = this.createCollection( [
            this.InfoTitle,
            this.saveButtonView,
            this.cancelButtonView
        ] );

        this.setTemplate( {
            tag: 'form',
            attributes: {
                class: [ 'ck', 'ck-abbr-form' ],
                tabindex: '-1'
            },
            children: this.childViews
        } );
    }

    render() {
        super.render();

        // Submit the form when the user clicked the save button
        // or pressed enter in the input.
        submitHandler( {
            view: this
        } );
    }

    focus() {
        this.childViews.first.focus();
    }

    _createInput( label ) {
        const labeledInput = new LabeledFieldView( this.locale, createLabeledInputText );

        labeledInput.label = label;

        return labeledInput;
    }

    _createButton( label, icon, className ) {
        const button = new ButtonView();

        button.set( {
            label,
            icon,
            tooltip: true,
            class: className
        } );

        return button;
    }

}