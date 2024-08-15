import {
  getIndentOutdentPositions,
  isModelSelectionInHLJSCodeBlock,
} from "./utils";

const Command = window.CKEditor5.core.Command;

/**
 * The code block indentation increase command plugin.
 *
 * @extends module:core/command~Command
 */
export default class IndentHLJSCodeBlockCommand extends Command {
  constructor(editor) {
    super(editor);

    /**
     * A sequence of characters added to the line when the command is executed.
     *
     * @readonly
     * @private
     * @member {String}
     */
    this._indentSequence = editor.config.get("hljsCodeBlock.indentSequence");
  }

  /**
   * @inheritDoc
   */
  refresh() {
    this.isEnabled = this._checkEnabled();
  }

  /**
   * Executes the command. When the command {@link #isEnabled is enabled}, the indentation of the
   * code lines in the selection will be increased.
   *
   * @fires execute
   */
  execute() {
    const editor = this.editor;
    const model = editor.model;

    model.change((writer) => {
      const positions = getIndentOutdentPositions(model);

      // Indent all positions, for instance assuming the indent sequence is 4x space ("    "):
      //
      //		<codeBlock>^foo</codeBlock>        ->       <codeBlock>    foo</codeBlock>
      //
      //		<codeBlock>foo^bar</codeBlock>     ->       <codeBlock>foo    bar</codeBlock>
      //
      // Also, when there is more than one position:
      //
      //		<codeBlock>
      //			^foobar
      //			<softBreak></softBreak>
      //			^bazqux
      //		</codeBlock>
      //
      //		->
      //
      //		<codeBlock>
      //			    foobar
      //			<softBreak></softBreak>
      //			    bazqux
      //		</codeBlock>
      //
      for (const position of positions) {
        writer.insertText(this._indentSequence, position);
      }
    });
  }

  /**
   * Checks whether the command can be enabled in the current context.
   *
   * @private
   * @returns {Boolean} Whether the command should be enabled.
   */
  _checkEnabled() {
    if (!this._indentSequence) {
      return false;
    }

    // Indent (forward) command is always enabled when there's any code block in the selection
    // because you can always indent code lines.
    return isModelSelectionInHLJSCodeBlock(
      this.editor.model.document.selection,
    );
  }
}
