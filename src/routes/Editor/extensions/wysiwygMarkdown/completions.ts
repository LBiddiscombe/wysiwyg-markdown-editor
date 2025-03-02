import { CompletionContext, snippetCompletion } from "@codemirror/autocomplete"

export function wysiwygCompletions(context: CompletionContext) {
  let word = context.matchBefore(/^\//)
  if (word && word.from == word.to && !context.explicit) return null

  return {
    from: word?.from,
    options: [
      snippetCompletion('```mermaid\ngraph ${TD}\n${A --> B}\n```\n', { label: '/mermaid-graph', displayLabel: 'Mermaid Graph' }),
      snippetCompletion('| ${col1} | ${col2} |\n| - | - |\n|${row1} | ${row2} |\n', { label: '/table-2', displayLabel: 'Table 2 Cols' }),
      snippetCompletion('| ${col1} | ${col2} | ${col2} |\n| - | - | - |\n|${row1} | ${row2} | ${row3} |\n', { label: '/table-3', displayLabel: 'Table 3 Cols' })
    ]
  }

}
