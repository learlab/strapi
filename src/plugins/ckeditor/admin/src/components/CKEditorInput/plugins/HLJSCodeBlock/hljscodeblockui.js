/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module code-block/codeblockui
 */

import { getNormalizedAndLocalizedLanguageDefinitions } from "./utils";

import codeBlockIcon from "./codeblock.svg";
import "./codeblock.css";
import "highlight.js/styles/atom-one-dark.css";

const Plugin = window.CKEditor5.core.Plugin;
const Collection = window.CKEditor5.utils.Collection;
const Model = window.CKEditor5.ui.Model;
const SplitButtonView = window.CKEditor5.ui.SplitButtonView;
const dropdownUtils = window.CKEditor5.ui;

/**
 * The code block UI plugin.
 *
 * Introduces the `'codeBlock'` dropdown.
 *
 * @extends module:core/plugin~Plugin
 */
export default class HLJSCodeBlockUI extends Plugin {
  /**
   * @inheritDoc
   */
  init() {
    const editor = this.editor;
    const t = editor.t;
    const componentFactory = editor.ui.componentFactory;
    const normalizedLanguageDefs =
      getNormalizedAndLocalizedLanguageDefinitions(editor);
    const defaultLanguageDefinition = normalizedLanguageDefs[0];

    componentFactory.add("codeBlock", (locale) => {
      const command = editor.commands.get("hljsCodeBlock");
      const dropdownView = dropdownUtils.createDropdown(
        locale,
        SplitButtonView,
      );
      const splitButtonView = dropdownView.buttonView;

      splitButtonView.set({
        label: t("Insert code block"),
        tooltip: true,
        icon: codeBlockIcon,
        isToggleable: true,
      });

      splitButtonView.bind("isOn").to(command, "value", (value) => !!value);

      splitButtonView.on("execute", () => {
        editor.execute("hljsCodeBlock", {
          language: defaultLanguageDefinition.language,
        });

        editor.editing.view.focus();
      });

      dropdownView.on("execute", (evt) => {
        editor.execute("hljsCodeBlock", {
          language: evt.source._codeBlockLanguage,
          forceValue: true,
        });

        editor.editing.view.focus();
      });

      dropdownView.class = "ck-code-block-dropdown";
      dropdownView.bind("isEnabled").to(command);

      dropdownUtils.addListToDropdown(
        dropdownView,
        this._getLanguageListItemDefinitions(normalizedLanguageDefs),
      );

      return dropdownView;
    });
  }

  /**
   * A helper returning a collection of the `codeBlock` dropdown items representing languages
   * available for the user to choose from.
   *
   * @private
   * @param {Array.<module:code-block/codeblock~CodeBlockLanguageDefinition>} normalizedLanguageDefs
   * @returns {Iterable.<module:ui/dropdown/utils~ListDropdownItemDefinition>}
   */
  _getLanguageListItemDefinitions(normalizedLanguageDefs) {
    const editor = this.editor;
    const command = editor.commands.get("hljsCodeBlock");
    const itemDefinitions = new Collection();

    for (const languageDef of normalizedLanguageDefs) {
      const definition = {
        type: "button",
        model: new Model({
          _codeBlockLanguage: languageDef.language,
          label: languageDef.label,
          withText: true,
        }),
      };

      definition.model.bind("isOn").to(command, "value", (value) => {
        return value === definition.model._codeBlockLanguage;
      });

      itemDefinitions.add(definition);
    }

    return itemDefinitions;
  }
}
