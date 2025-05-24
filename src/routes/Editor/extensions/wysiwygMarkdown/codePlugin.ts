import { syntaxTree } from '@codemirror/language'
import type { Extension } from '@codemirror/state'
import { RangeSetBuilder } from '@codemirror/state'
import type { EditorView } from '@codemirror/view'
import { Decoration, ViewPlugin } from '@codemirror/view'

const codeBlockDecoration = Decoration.line({ attributes: { class: 'cm-codeblock group' } })
const codeBlockOpenDecoration = Decoration.line({ attributes: { class: 'cm-codeblock-open' } })
const codeBlockCloseDecoration = Decoration.line({ attributes: { class: 'cm-codeblock-close' } })
const codeDecoration = Decoration.mark({ attributes: { class: 'cm-code' } })
const codeOpenDecoration = Decoration.mark({ attributes: { class: 'cm-code cm-code-open' } })
const codeCloseDecoration = Decoration.mark({ attributes: { class: 'cm-code cm-code-close' } })

const codeBlockPlugin = ViewPlugin.define((view: EditorView) => {
  return {
    update: () => {
      return decorate(view)
    },
  }
}, { decorations: plugin => plugin.update() })

const decorate = (view: EditorView) => {
  const builder = new RangeSetBuilder<Decoration>()

  for (const visibleRange of view.visibleRanges) {
    for (let position = visibleRange.from; position < visibleRange.to;) {
      const line = view.state.doc.lineAt(position)

      syntaxTree(view.state).iterate({
        from: line.from,
        to: line.to,
        enter({ type, from, to }) {
          if (type.name === 'FencedCode' || type.name === 'CodeBlock') {
            builder.add(line.from, line.from, codeBlockDecoration)

            const openLine = view.state.doc.lineAt(from)
            const closeLine = view.state.doc.lineAt(to)

            if (openLine.number === line.number) {
              builder.add(line.from, line.from, codeBlockOpenDecoration)
            }

            if (closeLine.number === line.number) {
              builder.add(line.from, line.from, codeBlockCloseDecoration)
            }

            return false
          }

          if (type.name === 'InlineCode') {
            const inlineCode = { from, to, innerFrom: from, innerTo: to }

            syntaxTree(view.state).iterate({
              from: inlineCode.from,
              to: inlineCode.to,
              enter({ type: markType, from: markFrom, to: markTo }) {
                if (markType.name === 'CodeMark') {
                  if (markFrom === inlineCode.from) {
                    inlineCode.innerFrom = markTo

                    builder.add(markFrom, markTo, codeOpenDecoration)
                  } else if (markTo === inlineCode.to) {
                    inlineCode.innerTo = markFrom

                    builder.add(inlineCode.innerFrom, inlineCode.innerTo, codeDecoration)
                    builder.add(markFrom, markTo, codeCloseDecoration)
                  }
                }
              }
            })
          }
        }

      })

      position = line.to + 1
    }
  }

  return builder.finish()
}

export const code = (): Extension => {
  return [
    codeBlockPlugin,
  ]
}