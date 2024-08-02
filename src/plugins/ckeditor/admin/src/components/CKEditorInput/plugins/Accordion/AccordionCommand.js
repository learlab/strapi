const Command = window.CKEditor5.core.Command;

export default class InsertAccordionCommand extends Command {
    execute() {
        this.editor.model.change( writer => {
            this.editor.model.insertObject( createAccordion( writer ) );
        } );
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const allowedIn = model.schema.findAllowedParent( selection.getFirstPosition(), 'Accordion' );

        this.isEnabled = allowedIn !== null;
    }
}

function createAccordion( writer ) {
    const Accordion = writer.createElement( 'Accordion' );
    const AccordionContent = writer.createElement( 'AccordionContent' );



    writer.append( AccordionContent, Accordion );

    writer.appendElement( "paragraph", AccordionContent );
    return Accordion;
}
