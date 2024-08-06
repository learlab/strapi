import InsertWarningCommand from "./WarningCommand.js";

const Plugin = window.CKEditor5.core.Plugin;
const Widget = window.CKEditor5.widget.Widget;
const toWidget = window.CKEditor5.widget.toWidget;
const toWidgetEditable = window.CKEditor5.widget.toWidgetEditable;

export default class WarningEditing extends Plugin {
  static get requires() {
    return [Widget];
  }
  init() {
    this._defineSchema();
    this._defineConverters();
    this.editor.commands.add(
      "insertWarning",
      new InsertWarningCommand(this.editor)
    );
  }
  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.register("Warning", {
      // Behaves like a self-contained block object (e.g. a block image)
      // allowed in places where other blocks are allowed (e.g. directly in the root).
      inheritAllFrom: "$blockObject",
      allowChildren: "$text",
    });

    schema.register("WarningContent", {
      // Cannot be split or left by the caret.
      isLimit: true,
      allowIn: "Warning",
      allowContentOf: "$root",
    });

    schema.addChildCheck((context, childDefinition) => {
      if (
        context.endsWith("WarningContent") &&
        childDefinition.name != "paragraph"
      ) {
        return false;
      }
    });
  }

  _defineConverters() {
    const conversion = this.editor.conversion;

    conversion.for("dataDowncast").elementToElement({
      model: {
        name: "Warning",
      },
      view: {
        name: "section",
        classes: "Warning",
      },
    });
    conversion.for("editingDowncast").elementToElement({
      model: {
        name: "Warning",
      },
      view: (modelElement, { writer }) => {
        const section = writer.createContainerElement("section", {
          class: "Warning",
        });

        return toWidget(section, writer, { label: "Warning widget" });
      },
    });

    conversion.for("upcast").elementToElement({
      view: {
        name: "section",
        classes: "Warning",
      },
      model: (viewElement, { writer }) => {
        return writer.createElement("Warning");
      },
    });

    conversion.for("upcast").elementToElement({
      model: "WarningContent",
      view: {
        name: "div",
      },
    });
    conversion.for("dataDowncast").elementToElement({
      model: "WarningContent",
      view: {
        name: "div",
      },
    });
    conversion.for("editingDowncast").elementToElement({
      model: "WarningContent",
      view: (modelElement, { writer: writer }) => {
        // Note: You use a more specialized createEditableElement() method here.
        const div = writer.createEditableElement("div");

        return toWidgetEditable(div, writer);
      },
    });
  }
}
