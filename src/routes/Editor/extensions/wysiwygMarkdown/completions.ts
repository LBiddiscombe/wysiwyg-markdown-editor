import { CompletionContext, snippetCompletion } from "@codemirror/autocomplete"

export function wysiwygCompletions(context: CompletionContext) {
  let word = context.matchBefore(/^\/.*$/)
  if (word && word.from === word.to && !context.explicit) return null


  const options = [
    snippetCompletion('  ', { label: '/indent', displayLabel: 'Indent', boost: 1 }),
    snippetCompletion('# ${Header}', { label: '/header 1', displayLabel: 'Header 1', detail: '#' }),
    snippetCompletion('## ${Header}', { label: '/header 2', displayLabel: 'Header 2', detail: '##' }),
    snippetCompletion('### ${Header}', { label: '/header 3', displayLabel: 'Header 3', detail: '###' }),
    snippetCompletion('[${alt}](${url})', { label: '/link', displayLabel: 'Link', detail: '[alt](url)' }),
    snippetCompletion('- [ ] ${task}', { label: '/task', displayLabel: 'Task', detail: '- [ ] task' }),
    snippetCompletion('```mermaid\ngraph ${LR}\n${A --> B}\n```\n', { label: '/mermaid', displayLabel: 'Mermaid Graph', detail: '```mermaid' }),
    snippetCompletion('| ${Col1} | ${Col2} |\n| - | - |\n|${row1} | ${row2} |\n', { label: '/table 2', displayLabel: 'Table 2 Columns', detail: '| Col1 | Col2 |' }),
    snippetCompletion('| ${Col1} | ${Col2} | ${Col3} |\n| - | - | - |\n|${row1} | ${row2} | ${row3} |\n', { label: '/table 3', displayLabel: 'Table 3 Columns', detail: '| Col1 | Col2 | Col3 |' }),
  ]

  return {
    from: word?.from,
    options
  }

}