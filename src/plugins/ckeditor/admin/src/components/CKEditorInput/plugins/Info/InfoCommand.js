const Command = window.CKEditor5.core.Command;

export default class InsertInfoCommand extends Command {
    execute() {
        this.editor.model.change( writer => {
            // Insert <simpleBox>*</simpleBox> at the current selection position
            // in a way that will result in creating a valid model structure.
            this.editor.model.insertObject( createInfo( writer ) );

        } );
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const allowedIn = model.schema.findAllowedParent( selection.getFirstPosition(), 'Info' );

        this.isEnabled = allowedIn !== null;
    }
}

function createInfo(writer) {
    const Info = writer.createElement( 'Info' , {title: "[Temp Title]"});
    const InfoContent = writer.createElement( 'InfoContent');

    const h3 = writer.createElement( 'heading3');

    writer.append(h3, Info );
    writer.appendText( "[Temp Title]", h3 );
    writer.append(InfoContent, Info);
    // There must be at least one paragraph for the description to be editable.
    // See https://github.com/ckeditor/ckeditor5/issues/1464.
    writer.appendElement( 'paragraph', InfoContent );
    return Info;
}