const Plugin = window.CKEditor5.core.Plugin;
const ButtonView = window.CKEditor5.ui.ButtonView;
const Command = window.CKEditor5.core.Command;
const enablePlaceholder = window.CKEditor5.engine.enablePlaceholder;
const Widget = window.CKEditor5.widget.Widget;
const toWidget = window.CKEditor5.widget.toWidget;
const toWidgetEditable = window.CKEditor5.widget.toWidgetEditable;

export class CalloutCaption extends Plugin {
    static get pluginName() {
        return 'calloutCaption';
    }

    static get requires() {
        return [Widget];
    }

    constructor(editor) {
        super(editor);
    }

    init() {
        const editor = this.editor;
        const schema = editor.model.schema;
        const editingView = editor.editing.view;
        const t = editor.t; // translate

        editor.ui.componentFactory.add('toggleCalloutCaption', (locale) => {
            const command = editor.commands.get('toggleCalloutCaption');

            const buttonView = new ButtonView(locale);

            buttonView.set({
                label: t('Toggle Callout Title/Term'),
                withText: true,
                tooltip: true,
            });

            buttonView.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');

            buttonView.bind('label').to(command, 'value', value => value ? t('Toggle title/term off') : t('Toggle title/term on'));

            this.listenTo(buttonView, 'execute', () => {
                editor.execute('toggleCalloutCaption');

                const modelCaptionElement = getCaptionFromModelSelection(editor.model.document.selection);

                if (modelCaptionElement) {
                    const figcaptionElement = editor.editing.mapper.toViewElement(modelCaptionElement);

                    editingView.scrollToTheSelection();

                    editingView.change(writer => {
                        writer.addClass('callout__caption_highlighted', figcaptionElement);
                    });
                }

                editor.editing.view.focus();
            });

            return buttonView;
        });

        if ( !schema.isRegistered('caption') ) {
            schema.register( 'caption', {
                allowIn: 'callout',
                allowContentOf: '$block',
                isLimit: true,
            })
        } else {
            schema.extend( 'caption', {
                allowIn: 'callout'
            })
        }

        editor.commands.add(
            'toggleCalloutCaption',
            new ToggleCalloutCaptionCommand(this.editor)
        );

        this._setupConversion();
    }

    _setupConversion() {
        const editor = this.editor;
        const view = editor.editing.view;
        const t = editor.t;

        editor.conversion.for('upcast').elementToElement({
            view: element => { matchCalloutCaptionViewElement(element) },
            model: 'caption'
        });

        editor.conversion.for('dataDowncast').elementToElement({
            model: 'caption',
            view: (modelElement, { writer }) => {
                if (!modelElement.parent.is('element', 'callout')) {
                    return null;
                }
                return writer.createContainerElement('figcaption');
            }
        });

        editor.conversion.for('editingDowncast').elementToElement({
            model: 'caption',
            view: (modelElement, { writer }) => {
                if (!modelElement.parent.is('element', 'callout')) {
                    return null;
                }
                const figcaptionElement = writer.createEditableElement('figcaption');
                writer.setCustomProperty('calloutCaption', true, figcaptionElement);
                figcaptionElement.placeholder = t('Type title or keyterm');
                enablePlaceholder({
                    view,
                    element: figcaptionElement,
                    keepOnFocus: true,
                });
                return toWidgetEditable(figcaptionElement, writer);
            }
        });
    }
}

class ToggleCalloutCaptionCommand extends Command {

    refresh() {
        const editor = this.editor;
        const selection = editor.model.document.selection;
        const selectedElement = selection.getSelectedElement();

        if (!selectedElement) {
            const ancestorCaptionElement = getCaptionFromModelSelection(selection);
            this.isEnabled = !!ancestorCaptionElement;
            this.value = !!ancestorCaptionElement;
            return;
        }

        this.isEnabled = selectedElement.is('element', 'callout') || selectedElement.parent.is('element', 'callout');
        if (!this.isEnabled) {
            this.value = false;
        } else {    
            this.value = !!getCaptionFromCalloutModelElement(selectedElement);
        }
    }

    execute() {
        this.editor.model.change(writer => {
            if (this.value) {
                this._hideCalloutCaption(writer);
            } else {
                this._showCalloutCaption(writer);
            }
        });
    }

    _showCalloutCaption(writer) {
        const model = this.editor.model;
        const selection = model.document.selection;
        let selectedCallout = selection.getSelectedElement();
        
        const newCaptionElement = writer.createElement('caption');
        writer.append(newCaptionElement, selectedCallout);
        writer.setSelection(newCaptionElement, 'in');
    }

    _hideCalloutCaption(writer) {
        const model = this.editor.model;
        const selection = model.document.selection;
        let selectedCallout = selection.getSelectedElement();
        let captionElement;

        if (selectedCallout) {
            captionElement = getCaptionFromCalloutModelElement(selectedCallout);
        } else {
            captionElement = getCaptionFromModelSelection(selection);
            selectedCallout = captionElement.parent;
        }
        writer.setSelection(selectedCallout, 'on');
        writer.remove(captionElement);
    }
}


function getCaptionFromModelSelection(selection) {
    const captionElement = selection.getFirstPosition().findAncestor('caption');
    if (!captionElement) {
        return null;
    }

    if (!!captionElement.parent && captionElement.parent.is('element', 'caption')) {
        return captionElement;
    }

    return null;
}

function getCaptionFromCalloutModelElement(calloutModelElement) {
    for (const node of calloutModelElement.getChildren()) {
        if (node.is('element', 'caption')) {
            return node;
        }
    }
    return null;
}

function matchCalloutCaptionViewElement( element ) {
    // Convert only captions for callouts.
    if ( element.name == 'figcaption' && element.parent?.is('element', 'figure') && element.parent?.hasClass('callout')) {
        return { name: true };
    }

    return null;
}