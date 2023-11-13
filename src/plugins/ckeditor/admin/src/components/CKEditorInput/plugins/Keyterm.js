const Plugin = window.CKEditor5.core.Plugin;
const ButtonView = window.CKEditor5.ui.ButtonView;

export class Keyterm extends Plugin {
    init() {
        const editor = this.editor;

        editor.ui.componentFactory.add('keyterm', () => {
            // The button will be an instance of ButtonView.
            const button = new ButtonView();

            button.set({
                label: 'Keyterm',
                withText: true
            });

            //Execute a callback function when the button is clicked
            button.on('execute', () => {
                const keytermTemplate = `
                <div class="keyterm" style="gap: 10px">
                    <div class="term" style="border: 1px solid orange">
                        <p>Keyterm</p>
                    </div>
                    <div class="definition" style="border: 1px dotted blue">
                        <p>...Definition</p>
                    </div>
                </div>
                <p></p>`
                const fragment = editor.data.processor.toView(keytermTemplate)
                const modelFragment = editor.data.toModel(fragment)

                //Change the model using the model writer
                editor.model.change(writer => {

                    //Insert the text at the user's current position
                    editor.model.insertContent(modelFragment);
                });
            });

            return button;
        });
    }
}