import { EditorView } from '@codemirror/view';
import { EditorState, RangeSet, StateField, type Range } from '@codemirror/state';
import { Decoration, type DecorationSet } from "@codemirror/view";
import { syntaxTree } from '@codemirror/language';

import { BlockWidget, MermaidWidget, TaskMarkerWidget, LinkWidget, SubSupWidget, CopyCodeWidget } from './widgets';

function replaceBlocks(state: EditorState): Range<Decoration>[] {
  const decorations: Range<Decoration>[] = [];
  const [cursor] = state.selection.ranges;

  syntaxTree(state).iterate({
    enter(node) {
      if (!['Table', 'Blockquote', 'FencedCode', 'TaskMarker', 'Link', 'Image', 'URL', 'HorizontalRule', 'Superscript', 'Subscript'].includes(node.name)) return;

      if (node.type.name === 'FencedCode') {
        const codeNode = node.node.getChild('CodeText');
        if (codeNode) {
          const copyCodeDecoration = Decoration.widget({
            widget: new CopyCodeWidget(state.doc.sliceString(codeNode.from, codeNode.to)),
            block: false
          });

          decorations.push(copyCodeDecoration.range(node.from, node.from));
        }
      }

      if (cursor.from >= node.from && cursor.to <= node.to) return false;

      switch (node.type.name) {
        case 'FencedCode':
          const infoNode = node.node.getChild('CodeInfo');
          const codeNode = node.node.getChild('CodeText');
          if (infoNode && codeNode && state.doc.sliceString(infoNode.from, infoNode.to) === 'mermaid') {
            const mermaidDecoration = Decoration.replace({
              widget: new MermaidWidget(state.doc.sliceString(codeNode.from, codeNode.to)),
              block: false
            });
            decorations.push(mermaidDecoration.range(node.from, node.to));
          }
          break;

        case 'TaskMarker':
          const taskText = state.doc.sliceString(node.from, node.to);
          const taskDecoration = Decoration.replace({
            widget: new TaskMarkerWidget(taskText, node.from),
            block: false
          });
          decorations.push(taskDecoration.range(node.from, node.to));
          break;

        case 'Link':
          const linkMarks = node.node.getChildren("LinkMark");
          const linkText = linkMarks.length >= 2 ? state.sliceDoc(linkMarks[0].to, linkMarks[1].from) : "";

          const urlNode = node.node.getChild("URL");
          const url = urlNode ? state.sliceDoc(urlNode.from, urlNode.to) : "";
          const linkDecoration = Decoration.replace({
            widget: new LinkWidget(linkText, url),
            block: false
          });
          decorations.push(linkDecoration.range(node.from, node.to));
          break;

        case 'URL':
          const urlText = state.doc.sliceString(node.from, node.to);
          const urlDecoration = Decoration.replace({
            widget: new LinkWidget(urlText, urlText),
            block: false
          });
          decorations.push(urlDecoration.range(node.from, node.to));
          break;

        case 'Subscript':
        case 'Superscript':
          const supOrSubText = state.doc.sliceString(node.from, node.to);
          const supOrSubDecoration = Decoration.replace({
            widget: new SubSupWidget(supOrSubText, node.type.name === 'Subscript' ? 'sub' : 'sup'),
            block: false
          });
          decorations.push(supOrSubDecoration.range(node.from, node.to));
          break;

        default:
          const blockText = state.doc.sliceString(node.from, node.to);
          const blockDecoration = Decoration.replace({
            widget: new BlockWidget(blockText),
            block: false
          });

          decorations.push(blockDecoration.range(node.from, node.to));
          break;
      }
    }
  });

  return decorations;
}

export function renderBlocks() {
  return StateField.define<DecorationSet>({
    create(state) {
      return RangeSet.of(replaceBlocks(state), true);
    },

    update(decorations, transaction) {
      return RangeSet.of(replaceBlocks(transaction.state), false);
    },

    provide(field) {
      return EditorView.decorations.from(field);
    },
  });
}
