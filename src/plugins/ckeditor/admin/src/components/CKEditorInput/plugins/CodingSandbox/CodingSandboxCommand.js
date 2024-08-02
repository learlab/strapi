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

    writer.append(CodingSandboxContent, CodingSandbox);
    writer.appendElement( 'codeBlock', {language: `${language.toLowerCase()}`}, CodingSandboxContent );
    return CodingSandbox;
}
