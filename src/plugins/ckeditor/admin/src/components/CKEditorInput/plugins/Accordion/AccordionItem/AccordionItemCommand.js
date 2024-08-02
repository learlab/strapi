const Command = window.CKEditor5.core.Command;

export default class InsertAccordionItemCommand extends Command {
    execute() {
        this.editor.model.change( writer => {
            this.editor.model.insertObject( createAccordionItem( writer ) );
        } );
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const allowedIn = model.schema.findAllowedParent( selection.getFirstPosition(), 'AccordionItem' );

        this.isEnabled = allowedIn !== null;
    }
}

function createAccordionItem( writer ) {
    const AccordionItem = writer.createElement( 'AccordionItem' );
    const AccordionItemTitle = writer.createElement( 'AccordionItemTitle' );
    const AccordionItemContent = writer.createElement( 'AccordionItemContent' );

    writer.append( AccordionItemTitle, AccordionItem );
    writer.append( AccordionItemContent, AccordionItem );

    writer.appendElement( 'paragraph', AccordionItemContent );

    return AccordionItem;
}
