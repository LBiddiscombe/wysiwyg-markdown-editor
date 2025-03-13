import { syntaxTree } from "@codemirror/language"
import { CompletionContext, snippetCompletion } from "@codemirror/autocomplete"

export function wysiwygCompletions(context: CompletionContext) {
  let word = context.matchBefore(/^\//)
  if (word && word.from == word.to && !context.explicit) return null

  const nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1);

  const options = [
    snippetCompletion('# ', { label: '/header 1', displayLabel: 'Header 1', detail: '#' }),
    snippetCompletion('## ', { label: '/header 2', displayLabel: 'Header 2', detail: '##' }),
    snippetCompletion('### ', { label: '/header 3', displayLabel: 'Header 3', detail: '###' }),
    snippetCompletion('[${alt}](${url})', { label: '/link', displayLabel: 'Link', detail: '[alt](url)' }),
    snippetCompletion('- [ ] ${task}', { label: '/task', displayLabel: 'Task', detail: '- [ ] task' }),
    snippetCompletion('```mermaid\ngraph ${TD}\n${A --> B}\n```\n', { label: '/mermaid', displayLabel: 'Mermaid Graph', detail: '```mermaid' }),
    snippetCompletion('| ${col1} | ${col2} |\n| - | - |\n|${row1} | ${row2} |\n', { label: '/table 2', displayLabel: 'Table - 2 Columns', detail: '| col1 | col2 |' }),
    snippetCompletion('| ${col1} | ${col2} | ${col2} |\n| - | - | - |\n|${row1} | ${row2} | ${row3} |\n', { label: '/table 3', displayLabel: 'Table - 3 Columns' }),
  ]

  return {
    from: nodeBefore ? nodeBefore.from : context.pos,
    options
  }

}