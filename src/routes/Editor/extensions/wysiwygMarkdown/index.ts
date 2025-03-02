import { keymap, ViewPlugin } from '@codemirror/view';
import { languages } from '@codemirror/language-data';
import { syntaxHighlighting } from "@codemirror/language"
import { markdown, markdownLanguage, markdownKeymap } from '@codemirror/lang-markdown';
import { mermaidLanguageDescription } from 'codemirror-lang-mermaid';

import { WysiwygPlugin, wysiwygStyle } from './WysiwygPlugin';
import { renderBlocks } from './renderBlocks';
import { wysiwygKeymap } from './keyMap';
import { wysiwygCompletions } from './completions';
import { Mark } from './lezerExtensions';
import { code } from './codePlugin';

export function wysiwygMarkdown() {

  return ViewPlugin.fromClass(WysiwygPlugin, {
    decorations: v => v.decorations,
    provide: () => [
      code(),
      syntaxHighlighting(wysiwygStyle),
      renderBlocks(),
      markdown({ codeLanguages: [...languages, mermaidLanguageDescription], base: markdownLanguage, extensions: [Mark] }),
      markdownLanguage.data.of({
        autocomplete: wysiwygCompletions
      }),
      keymap.of([
        ...wysiwygKeymap,
        ...markdownKeymap
      ])
    ]
  });
}