import "./Warning.css";

const Plugin = window.CKEditor5.core.Plugin;
const ButtonView = window.CKEditor5.ui.ButtonView;

export default class WarningUI extends Plugin {
  init() {
    const editor = this.editor;
    const t = editor.t;

    // to be displayed in the toolbar.
    editor.ui.componentFactory.add("Warning", (locale) => {
      // The state of the button will be bound to the widget command.
      const command = editor.commands.get("insertWarning");

      // The button will be an instance of ButtonView.
      const buttonView = new ButtonView(locale);

      buttonView.set({
        // The t() function helps localize the editor. All strings enclosed in t() can be
        // translated and change when the language of the editor changes.
        label: t("Red Box"),
        withText: true,
        tooltip: true,
      });

      // Bind the state of the button to the command.
      buttonView.bind("isOn", "isEnabled").to(command, "value", "isEnabled");

      // Execute the command when the button is clicked (executed).
      this.listenTo(buttonView, "execute", () =>
        editor.execute("insertWarning")
      );

      return buttonView;
    });
  }
}
