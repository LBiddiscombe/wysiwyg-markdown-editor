import { keymap } from '@codemirror/view';
import { languages } from '@codemirror/language-data';
import { syntaxHighlighting } from '@codemirror/language';
import { markdown, markdownLanguage, markdownKeymap } from '@codemirror/lang-markdown';
import { mermaidLanguageDescription } from 'codemirror-lang-mermaid';

import { wysiwygDecorations } from './decorations';
import { wysiwygKeymap } from './keyMap';
import { wysiwygCompletions } from './completions';
import { Mark } from './lezerExtensions';
import { code } from './codePlugin';
import { theme, wysiwygStyle } from './theme';

export function wysiwygMarkdown() {
	return [
		theme,
		code(),
		syntaxHighlighting(wysiwygStyle),
		wysiwygDecorations(),
		markdown({
			codeLanguages: [...languages, mermaidLanguageDescription],
			base: markdownLanguage,
			extensions: [Mark]
		}),
		markdownLanguage.data.of({
			autocomplete: wysiwygCompletions
		}),
		keymap.of([...wysiwygKeymap, ...markdownKeymap])
	];
}
