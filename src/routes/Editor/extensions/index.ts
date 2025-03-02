import {
  keymap,
  highlightSpecialChars,
  drawSelection,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  EditorView,
} from "@codemirror/view"
import { type Extension, EditorState } from "@codemirror/state"
import {
  defaultHighlightStyle,
  syntaxHighlighting,
  indentOnInput,
  bracketMatching,
  foldKeymap
} from "@codemirror/language"
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands"
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search"
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete"
import { lintKeymap } from "@codemirror/lint"

import { wysiwygMarkdown } from './wysiwygMarkdown'

const editorConfig: Extension = (() => [
  syntaxHighlighting(defaultHighlightStyle),
  highlightSpecialChars(),
  history(),
  dropCursor(),
  EditorView.lineWrapping,
  EditorState.allowMultipleSelections.of(true),
  indentOnInput(),
  drawSelection(),
  bracketMatching(),
  closeBrackets(),
  autocompletion(),
  rectangularSelection(),
  crosshairCursor(),
  highlightSelectionMatches(),
  keymap.of([
    indentWithTab,
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...searchKeymap,
    ...historyKeymap,
    ...foldKeymap,
    ...completionKeymap,
    ...lintKeymap,
  ])
])()

export const extensions = [
  wysiwygMarkdown(),
  editorConfig
]