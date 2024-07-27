const Command = window.CKEditor5.core.Command;

export default class InsertCodingSandboxCommand extends Command {
    execute(language) {
        this.editor.model.change( writer => {
            // Insert <simpleBox>*</simpleBox> at the current selection position
            // in a way that will result in creating a valid model structure.
            this.editor.model.insertObject( createCodingSandbox( writer, language ) );

        } );
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const allowedIn = model.schema.findAllowedParent( selection.getFirstPosition(), 'Info' );

        this.isEnabled = allowedIn !== null;
    }
}

function createCodingSandbox(writer, language) {
    const CodingSandbox = writer.createElement( 'CodingSandbox');
    const CodingSandboxContent = writer.createElement( 'CodingSandboxContent');
    const header = writer.createElement( 'heading4');
    //
    writer.append( header, CodingSandbox );
    //
    // writer.append(header, CodingSandbox)
    writer.appendText(`${language} Sandbox:`, header)

    writer.append(CodingSandboxContent, CodingSandbox);
    // There must be at least one paragraph for the description to be editable.
    // See https://github.com/ckeditor/ckeditor5/issues/1464.
    writer.appendElement( 'codeBlock', {language: `${language.toLowerCase()}`}, CodingSandboxContent );
    return CodingSandbox;
}
