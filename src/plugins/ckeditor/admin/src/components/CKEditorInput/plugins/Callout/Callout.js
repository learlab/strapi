const Plugin = window.CKEditor5.core.Plugin;
const ButtonView = window.CKEditor5.ui.ButtonView;
const Command = window.CKEditor5.core.Command;
const enablePlaceholder = window.CKEditor5.engine.enablePlaceholder;
const Widget = window.CKEditor5.widget.Widget;
const toWidget = window.CKEditor5.widget.toWidget;
const toWidgetEditable = window.CKEditor5.widget.toWidgetEditable;

export class Callout extends Plugin {
    static get pluginName() {
        return 'callout';
    }

    static get requires() {
        return [Widget];
    }

    init() {
        const editor = this.editor;
        const t = editor.t; // translate

        editor.ui.componentFactory.add('callout', (locale) => {
            const command = editor.commands.get('insertCallout');

            const buttonView = new ButtonView(locale);

            buttonView.set({
                label: t('Insert Callout'),
                withText: true,
                tooltip: true,
            });

            buttonView
                .bind('isOn', 'isEnabled')
                .to(command, 'value', 'isEnabled');

            this.listenTo(buttonView, 'execute', () =>
                editor.execute('insertCallout')
            );

            return buttonView;
        });

        this._defineSchema();
        this._defineConverters();

        this.editor.commands.add(
            'insertCallout',
            new InsertCalloutCommand(this.editor)
        );
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register('callout', {
            isObject: true,
            allowIn: '$root',
            isSelectable: true,
            allowChildren: ['calloutContent', 'calloutCaption'],
        });

        schema.register('calloutContent', {
            // Cannot be split or left by the caret.
            isLimit: true,

            allowIn: 'callout',

            // Allow content which is allowed in the root (e.g. paragraphs).
            allowContentOf: '$root',
        });
    }

    _defineConverters() {
        const conversion = this.editor.conversion;
        const view = this.editor.editing.view;

        conversion.for('upcast').elementToElement({
            model: 'callout',
            view: {
                name: 'figure',
                classes: 'callout',
            },
        });
        conversion.for('dataDowncast').elementToElement({
            model: 'callout',
            view: {
                name: 'figure',
                classes: 'callout',
            },
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'callout',
            view: (modelElement, { writer: viewWriter }) => {
                const figure = viewWriter.createContainerElement('figure', {
                    class: 'callout',
                });

                return toWidget(figure, viewWriter, {
                    label: 'callout widget'
                });
            },
        });

        conversion.for('upcast').elementToElement({
            model: 'calloutContent',
            view: {
                name: 'div',
                classes: 'callout-content',
            },
        });
        conversion.for('dataDowncast').elementToElement({
            model: 'calloutContent',
            view: {
                name: 'div',
                classes: 'callout-content',
            },
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'calloutContent',
            view: (modelElement, { writer: viewWriter }) => {
                const div = viewWriter.createEditableElement('div', {
                    class: 'callout-content',
                });

                return toWidgetEditable(div, viewWriter);
            },
        });
    }
}

class InsertCalloutCommand extends Command {
    execute() {
        this.editor.model.change((writer) => {
            this.editor.model.insertObject(createCallout(writer));
        });
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const allowedIn = model.schema.findAllowedParent(
            selection.getFirstPosition(),
            'callout'
        );

        this.isEnabled = allowedIn !== null;
    }
}

function createCallout(writer) {
    const callout = writer.createElement('callout');
    const calloutContent = writer.createElement('calloutContent');

    writer.append(calloutContent, callout);

    writer.appendElement('paragraph', calloutContent);

    return callout;
}