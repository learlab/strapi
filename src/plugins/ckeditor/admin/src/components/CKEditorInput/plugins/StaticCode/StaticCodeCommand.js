const Command = window.CKEditor5.core.Command;

export default class InsertStaticCodeCommand extends Command {
    execute(language) {
        this.editor.model.change( writer => {
            this.editor.model.insertObject( createStaticCode( writer, language ) );
        } );
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const allowedIn = model.schema.findAllowedParent( selection.getFirstPosition(), 'StaticCode' );

        this.isEnabled = allowedIn !== null;
    }
}

function createStaticCode( writer, language ) {
    const StaticCode = writer.createElement( 'StaticCode' );
    const StaticCodeAttributes = writer.createElement( 'StaticCodeAttributes' );
    const StaticCodeContent = writer.createElement( 'StaticCodeContent' );

    writer.appendText('Attributes:', StaticCode);
    writer.append( StaticCodeAttributes, StaticCode );
    writer.append( StaticCodeContent, StaticCode );

    writer.appendElement( 'codeBlock', {language: `${language.toLowerCase()}`}, StaticCodeContent );

    return StaticCode;
}
