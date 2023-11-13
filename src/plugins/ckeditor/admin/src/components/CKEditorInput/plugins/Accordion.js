console.log(window.CKEditor5); // see class methods
const Plugin = window.CKEditor5.core.Plugin;
const ButtonView = window.CKEditor5.ui.ButtonView;
const Command = window.CKEditor5.core.Command;
const enablePlaceholder = window.CKEditor5.engine.enablePlaceholder;
const Widget = window.CKEditor5.widget.Widget;
const toWidget = window.CKEditor5.widget.toWidget;
const toWidgetEditable = window.CKEditor5.widget.toWidgetEditable;
const accordionIcon = `<svg version="1.1" id="icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32" style="enable-background:new 0 0 32 32;" xml:space="preserve">
<style type="text/css">.st0{fill:none;}
	</style>
	<title>caret--right</title>
	<polygon points="12,8 22,16 12,24 "/>
</svg>`;

export class Accordion extends Plugin {
    static get pluginName() {
        return 'Accordion';
    }

    static get requires() {
        return [Widget];
    }

    init() {
        const editor = this.editor;
        const t = editor.t; // translate

        editor.ui.componentFactory.add('insertAccordion', (locale) => {
            const command = editor.commands.get('insertAccordion');

            const buttonView = new ButtonView(locale);

            buttonView.set({
                label: t('Insert accordion'),
                icon: accordionIcon,
                tooltip: true,
            });

            buttonView
                .bind('isOn', 'isEnabled')
                .to(command, 'value', 'isEnabled');

            this.listenTo(buttonView, 'execute', () =>
                editor.execute('insertAccordion')
            );

            return buttonView;
        });

        this._defineSchema();
        this._defineConverters();

        this.editor.commands.add(
            'insertAccordion',
            new InsertAccordionCommand(this.editor)
        );
    }

    afterInit() {
        const editor = this.editor;
        const viewDocument = editor.editing.view.document;

        this.listenTo(viewDocument, 'keydown', (event, data) => {
            const targetElement = editor.editing.mapper.toModelElement(
                data.target
            );
            if (targetElement && targetElement.name === 'accordionTitle') {
                if (data.keyCode === 32) {
                    // Spacebar: Prevent default details toggling
                    data.domEvent.preventDefault();
                    editor.model.change((writer) => {
                        const selection = editor.model.document.selection;
                        const insertPosition = selection.getFirstPosition();
                        writer.insertText(' ', insertPosition);
                    });
                }
                if (data.keyCode === 13) {
                    // Enter
                    const accordion = targetElement.parent;
                    const accordionId = accordion.getAttribute('id');
                    const accordionContent = accordion.getChild(1);
                    // eslint-disable-next-line
                    const accordionEl = document.querySelector(
                        `[data-id='${accordionId}']`
                    );
                    if (accordionEl.getAttribute('open') === 'true') {
                        // If accordion open: move the cursor to the accordion content
                        editor.model.change((writer) => {
                            writer.setSelection(accordionContent, 0);
                        });
                    } else {
                        // If accordion closed: insert new line after accordion
                        editor.execute('insertParagraph', {
                            position: editor.model.createPositionAfter(
                                accordion.parent
                            ),
                        });
                    }
                }
            }
        });

        this.listenTo(viewDocument, 'click', (event, data) => {
            const targetElement = editor.editing.mapper.toModelElement(
                data.target
            );

            if (targetElement && targetElement.name === 'accordionTitle') {
                data.domEvent.preventDefault();
                data.domEvent.stopPropagation();

                if (data.domEvent.offsetX < 16) {
                    const accordionEl = data.domTarget.parentElement;
                    accordionEl.toggleAttribute('open');

                    const accordionId = accordionEl.getAttribute('data-id');
                    const openAttr = accordionEl.getAttribute('open');
                    const isOpen = openAttr !== undefined && openAttr !== null;
                    setAccordionState(accordionId, isOpen);
                }
            }
        });
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register('accordionWrapper', {
            // Behaves like a self-contained object (e.g. an image).
            isObject: true,

            // Allow in places where other blocks are allowed (e.g. directly in the root).
            allowWhere: '$block',
        });

        schema.register('accordion', {
            // Behaves like a self-contained object (e.g. an image).
            isObject: false,

            allowIn: 'accordionWrapper',

            allowAttributes: ['id'],
        });

        schema.register('accordionTitle', {
            // Cannot be split or left by the caret.
            isLimit: true,

            allowIn: 'accordion',

            // Allow content which is allowed in blocks (i.e. text with attributes).
            allowContentOf: '$block',
        });

        schema.register('accordionContent', {
            // Cannot be split or left by the caret.
            isLimit: true,

            allowIn: 'accordion',

            // Allow content which is allowed in the root (e.g. paragraphs).
            allowContentOf: '$root',
        });
    }

    _defineConverters() {
        const conversion = this.editor.conversion;
        const view = this.editor.editing.view;

        // <accordionWrapper> converters
        conversion.for('upcast').elementToElement({
            model: 'accordionWrapper',
            view: {
                name: 'div',
                classes: 'ck-accordion-wrapper',
            },
        });
        conversion.for('dataDowncast').elementToElement({
            model: 'accordionWrapper',
            view: {
                name: 'div',
                classes: 'ck-accordion-wrapper',
            },
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'accordionWrapper',
            view: (modelElement, { writer: viewWriter }) => {
                const div = viewWriter.createContainerElement('div', {
                    class: 'ck-accordion-wrapper',
                });

                return toWidget(div, viewWriter, {
                    label: 'accordion widget',
                    hasSelectionHandle: true,
                });
            },
        });

        // <accordion> converters
        conversion.for('upcast').elementToElement({
            model: (viewElement, { writer: modelWriter }) => {
                const accordionId =
                    viewElement.getAttribute('data-id') ||
                    generateAccordionId();
                return modelWriter.createElement('accordion', {
                    id: accordionId,
                });
            },
            view: {
                name: 'details',
                classes: 'ck-accordion',
            },
        });
        conversion.for('dataDowncast').elementToElement({
            model: 'accordion',
            view: (modelElement, { writer: viewWriter }) => {
                const accordionId = modelElement.getAttribute('id');
                const detailsAttributes = {
                    class: 'ck-accordion',
                    'data-id': accordionId,
                };
                if (getAccordionState(accordionId) === 'open') {
                    detailsAttributes.open = 'true';
                }

                return viewWriter.createContainerElement(
                    'details',
                    detailsAttributes
                );
            },
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'accordion',
            view: (modelElement, { writer: viewWriter }) => {
                const accordionId = modelElement.getAttribute('id');
                const detailsAttributes = {
                    class: 'ck-accordion',
                    'data-id': accordionId,
                };
                if (getAccordionState(accordionId) === 'open') {
                    detailsAttributes.open = 'true';
                }

                const details = viewWriter.createContainerElement(
                    'details',
                    detailsAttributes
                );

                return toWidget(details, viewWriter);
            },
        });

        // <accordionTitle> converters
        conversion.for('upcast').elementToElement({
            model: 'accordionTitle',
            view: {
                name: 'summary',
                classes: 'ck-accordion-title',
            },
        });
        conversion.for('dataDowncast').elementToElement({
            model: 'accordionTitle',
            view: {
                name: 'summary',
                classes: 'ck-accordion-title',
            },
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'accordionTitle',
            view: (modelElement, { writer: viewWriter }) => {
                const summary = viewWriter.createEditableElement('summary', {
                    class: 'ck-accordion-title',
                });

                enablePlaceholder({
                    view,
                    element: summary,
                    text: '  Accordion title...',
                    keepOnFocus: true,
                });

                return toWidgetEditable(summary, viewWriter);
            },
        });

        // <accordionContent> converters
        conversion.for('upcast').elementToElement({
            model: 'accordionContent',
            view: {
                name: 'div',
                classes: 'ck-accordion-content',
            },
        });
        conversion.for('dataDowncast').elementToElement({
            model: 'accordionContent',
            view: {
                name: 'div',
                classes: 'ck-accordion-content',
            },
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'accordionContent',
            view: (modelElement, { writer: viewWriter }) => {
                const div = viewWriter.createEditableElement('div', {
                    class: 'ck-accordion-content',
                });

                enablePlaceholder({
                    view,
                    element: div,
                    text: 'Empty accordion',
                    keepOnFocus: true,
                    isDirectHost: false,
                });

                return toWidgetEditable(div, viewWriter);
            },
        });
    }
}

class InsertAccordionCommand extends Command {
    execute() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const selectedContent = model.getSelectedContent(selection);

        model.change((writer) => {
            const accordionWrapper = writer.createElement('accordionWrapper');

            const accordion = writer.createElement('accordion');
            const accordionId = generateAccordionId();
            writer.setAttribute('id', accordionId, accordion);
            setAccordionState(accordionId, true);
            writer.append(accordion, accordionWrapper);

            const accordionTitle = writer.createElement('accordionTitle');
            writer.append(accordionTitle, accordion);

            const accordionContent = writer.createElement('accordionContent');
            writer.append(accordionContent, accordion);
            if (selection.isCollapsed) {
                writer.appendElement('paragraph', accordionContent);
            }

            model.insertContent(accordionWrapper);

            if (!selection.isCollapsed) {
                writer.setSelection(accordionContent, 0);
                model.insertContent(selectedContent);
            }
            writer.setSelection(accordionTitle, 'in');
        });
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const allowedIn = model.schema.findAllowedParent(
            selection.getFirstPosition(),
            'accordionWrapper'
        );

        this.isEnabled = allowedIn !== null;
    }
}

function generateAccordionId() {
    const time = new Date().getTime();
    const random = Math.random().toString(36).substring(2, 5);
    return `ckeditor5-accordion-${time}-${random}`;
}

function setAccordionState(accordionId, isOpen) {
    localStorage.setItem(`${accordionId}-state`, isOpen ? 'open' : 'closed');
}

function getAccordionState(accordionId) {
    return localStorage.getItem(`${accordionId}-state`)
};