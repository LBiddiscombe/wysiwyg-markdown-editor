import { Decoration, EditorView, ViewPlugin, ViewUpdate, type DecorationSet, type PluginValue } from "@codemirror/view";
import type { Range } from '@codemirror/state';
import { syntaxTree } from '@codemirror/language';
import { HighlightStyle } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

export class WysiwygPlugin implements PluginValue {
  decorations: DecorationSet;

  constructor(view: EditorView) {
    this.decorations = this.computeDecorations(view);
  }

  update(update: ViewUpdate) {
    if (update.selectionSet || update.focusChanged || update.docChanged) {
      this.decorations = this.computeDecorations(update.view);
    }
  }

  computeDecorations(view: EditorView) {
    const tokenElement = ['InlineCode', 'Emphasis', 'StrongEmphasis', 'FencedCode', 'Link', 'Blockquote', 'Strikethrough', 'Mark', 'Image'];
    const tokenHidden = ['HardBreak', 'LinkMark', 'EmphasisMark', 'StrikethroughMark', 'CodeMark', 'CodeInfo', 'MarkMark'];

    const decorationHidden = Decoration.mark({ class: 'sr-only' });
    const decorationBullet = Decoration.mark({ class: 'cm-bullet' });
    const decorationMark = Decoration.mark({ class: 'bg-accent font-sans px-1 py-[2px]' });

    const widgets: Range<Decoration>[] = [];
    const [cursor] = view.state.selection.ranges;

    for (const { from, to } of view.visibleRanges) {
      syntaxTree(view.state).iterate({
        from,
        to,
        enter(node) {

          if (node.type.is('Mark')) {
            widgets.push(decorationMark.range(node.from, node.to));
          }

          if (
            (node.name.startsWith('ATXHeading') || tokenElement.includes(node.name)) &&
            cursor.from >= node.from &&
            cursor.to <= node.to
          ) {
            return false;
          }

          if (node.name === 'ListMark' && node.matchContext(['BulletList', 'ListItem']) &&
            cursor.from !== node.from && cursor.from !== node.from + 1) {
            widgets.push(decorationBullet.range(node.from, node.to));
          }

          if (node.name === 'Task' &&
            cursor.from !== node.from && cursor.from !== node.from + 1) {
            const listMarkNode = node.node.prevSibling;
            if (listMarkNode && listMarkNode.name === 'ListMark') {
              widgets.push(decorationHidden.range(listMarkNode.from, listMarkNode.to + 1));
            }
          }

          if (['HeaderMark', 'QuoteMark'].includes(node.name)) {
            widgets.push(decorationHidden.range(node.from, node.to + 1));
          }

          if (tokenHidden.includes(node.name)) {
            widgets.push(decorationHidden.range(node.from, node.to));
          }
        }
      });
    }

    return Decoration.set(widgets);
  }
}

export const wysiwygStyle = HighlightStyle.define([
  { tag: t.heading1, class: 'font-sans font-bold text-3xl no-underline!' },
  { tag: t.heading2, class: 'font-sans font-bold text-2xl no-underline!' },
  { tag: t.heading3, class: 'font-sans font-bold text-xl no-underline!' },
  { tag: t.heading4, class: 'font-sans font-bold text-lg' },
  { tag: t.link, class: 'font-sans underline text-blue-600' },
  { tag: t.emphasis, class: 'font-sans italic' },
  { tag: t.strong, class: 'font-sans font-bold' },
  { tag: t.monospace, class: 'font-mono text-sm' },
  { tag: t.content, class: 'font-sans' },
  { tag: t.meta, class: 'text-gray-400!' },
  { tag: t.url, class: 'font-sans' }
]);