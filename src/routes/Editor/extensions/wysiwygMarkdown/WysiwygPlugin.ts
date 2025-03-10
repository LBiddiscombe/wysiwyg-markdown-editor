import { Decoration, EditorView, ViewUpdate, type DecorationSet, type PluginValue } from "@codemirror/view";
import { syntaxTree } from '@codemirror/language';
import { type Range } from '@codemirror/state';



export class WysiwygPlugin implements PluginValue {
  decorations: DecorationSet;

  constructor(view: EditorView) {
    this.decorations = this.computeDecorations(view);
  }

  update(update: ViewUpdate) {
    if (update.selectionSet || update.focusChanged || update.docChanged || update.viewportChanged) {
      this.decorations = this.computeDecorations(update.view);
    }
  }

  computeDecorations(view: EditorView) {
    const tokenElement = ['InlineCode', 'Emphasis', 'StrongEmphasis', 'FencedCode', 'Link', 'Blockquote', 'Strikethrough', 'Mark', 'Image'];
    const tokenHidden = ['HardBreak', 'LinkMark', 'EmphasisMark', 'StrikethroughMark', 'CodeMark', 'CodeInfo', 'MarkMark'];

    const decorationHidden = Decoration.mark({ class: 'sr-only' });
    const decorationStrike = Decoration.mark({ class: 'line-through' });
    const decorationBullet = Decoration.mark({ class: 'cm-bullet' });
    const decorationMark = Decoration.mark({ class: 'bg-info font-sans px-1 py-[2px]' });

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

          if (node.type.is('Strikethrough')) {
            widgets.push(decorationStrike.range(node.from, node.to));
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
