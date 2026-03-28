import { EditorView } from '@codemirror/view';
import { EditorState, RangeSet, StateField, type Range } from '@codemirror/state';
import { Decoration, type DecorationSet } from '@codemirror/view';
import { syntaxTree } from '@codemirror/language';

import {
	BlockWidget,
	MermaidWidget,
	TaskMarkerWidget,
	LinkWidget,
	SubSupWidget,
	CopyCodeWidget
} from './widgets';

// Decoration constants — created once, reused on every pass
const hidden = Decoration.mark({ class: 'sr-only' });
const strike = Decoration.mark({ class: 'line-through' });
const bullet = Decoration.mark({ class: 'cm-bullet' });
const ordered = Decoration.mark({ class: 'cm-ordered' });
const highlight = Decoration.mark({ class: 'bg-yellow-300/50 font-sans px-1 py-[2px]' });

const tokenElement = new Set([
	'InlineCode',
	'Emphasis',
	'StrongEmphasis',
	'FencedCode',
	'Link',
	'Blockquote',
	'Strikethrough',
	'Mark',
	'Image'
]);

const tokenHidden = new Set([
	'HardBreak',
	'LinkMark',
	'EmphasisMark',
	'StrikethroughMark',
	'CodeMark',
	'CodeInfo',
	'MarkMark'
]);

// Nodes that get replaced by a widget when the cursor is outside them
const blockReplace = new Set([
	'Table',
	'Blockquote',
	'FencedCode',
	'TaskMarker',
	'Link',
	'Image',
	'URL',
	'HorizontalRule',
	'Superscript',
	'Subscript'
]);

function buildDecorations(state: EditorState): Range<Decoration>[] {
	const widgets: Range<Decoration>[] = [];
	const [cursor] = state.selection.ranges;

	syntaxTree(state).iterate({
		enter(node) {
			const name = node.type.name;

			// ── Mark / Strikethrough styling ─────────────────────────────
			if (node.type.is('Mark')) {
				widgets.push(highlight.range(node.from, node.to));
			}

			if (node.type.is('Strikethrough')) {
				widgets.push(strike.range(node.from, node.to));
			}

			// ── Cursor inside: skip replacement, keep raw syntax visible ─
			if (
				(name.startsWith('ATXHeading') || tokenElement.has(name)) &&
				cursor.from >= node.from &&
				cursor.to <= node.to
			) {
				return false;
			}

			// ── Bullet / ordered list marks ───────────────────────────────
			if (
				name === 'ListMark' &&
				node.matchContext(['BulletList', 'ListItem']) &&
				cursor.from !== node.from &&
				cursor.from !== node.from + 1
			) {
				widgets.push(bullet.range(node.from, node.to));
			}

			if (
				name === 'ListMark' &&
				node.matchContext(['OrderedList', 'ListItem']) &&
				cursor.from !== node.from &&
				cursor.from !== node.from + 1
			) {
				widgets.push(ordered.range(node.from, node.to));
			}

			// ── Task list: hide the raw list mark when cursor is elsewhere ─
			if (name === 'Task' && cursor.from !== node.from && cursor.from !== node.from + 1) {
				const listMarkNode = node.node.prevSibling;
				if (listMarkNode && listMarkNode.name === 'ListMark') {
					widgets.push(hidden.range(listMarkNode.from, listMarkNode.to + 1));
				}
			}

			// ── Header / blockquote syntax marks ──────────────────────────
			if (['HeaderMark', 'QuoteMark'].includes(name)) {
				widgets.push(hidden.range(node.from, node.to + 1));
			}

			// ── Generic hidden marks ──────────────────────────────────────
			if (tokenHidden.has(name)) {
				widgets.push(hidden.range(node.from, node.to));
			}

			// ── Block replacements ────────────────────────────────────────
			if (!blockReplace.has(name)) return;

			// Copy button always appears on code blocks regardless of cursor
			if (name === 'FencedCode') {
				const codeNode = node.node.getChild('CodeText');
				if (codeNode) {
					widgets.push(
						Decoration.widget({
							widget: new CopyCodeWidget(state.doc.sliceString(codeNode.from, codeNode.to)),
							block: false
						}).range(node.from, node.from)
					);
				}
			}

			// Cursor inside — don't replace, let user edit raw markdown
			if (cursor.from >= node.from && cursor.to <= node.to) return false;

			switch (name) {
				case 'FencedCode': {
					const infoNode = node.node.getChild('CodeInfo');
					const codeNode = node.node.getChild('CodeText');
					if (
						infoNode &&
						codeNode &&
						state.doc.sliceString(infoNode.from, infoNode.to) === 'mermaid'
					) {
						widgets.push(
							Decoration.replace({
								widget: new MermaidWidget(state.doc.sliceString(codeNode.from, codeNode.to)),
								block: false
							}).range(node.from, node.to)
						);
					}
					break;
				}

				case 'TaskMarker': {
					widgets.push(
						Decoration.replace({
							widget: new TaskMarkerWidget(state.doc.sliceString(node.from, node.to), node.from),
							block: false
						}).range(node.from, node.to)
					);
					break;
				}

				case 'Link': {
					const linkMarks = node.node.getChildren('LinkMark');
					const linkText =
						linkMarks.length >= 2 ? state.sliceDoc(linkMarks[0].to, linkMarks[1].from) : '';
					const urlNode = node.node.getChild('URL');
					const url = urlNode ? state.sliceDoc(urlNode.from, urlNode.to) : '';
					widgets.push(
						Decoration.replace({
							widget: new LinkWidget(linkText, url),
							block: false
						}).range(node.from, node.to)
					);
					break;
				}

				case 'URL': {
					const urlText = state.doc.sliceString(node.from, node.to);
					widgets.push(
						Decoration.replace({
							widget: new LinkWidget(urlText, urlText),
							block: false
						}).range(node.from, node.to)
					);
					break;
				}

				case 'Subscript':
				case 'Superscript': {
					widgets.push(
						Decoration.replace({
							widget: new SubSupWidget(
								state.doc.sliceString(node.from, node.to),
								name === 'Subscript' ? 'sub' : 'sup'
							),
							block: false
						}).range(node.from, node.to)
					);
					break;
				}

				default: {
					widgets.push(
						Decoration.replace({
							widget: new BlockWidget(state.doc.sliceString(node.from, node.to)),
							block: false
						}).range(node.from, node.to)
					);
					break;
				}
			}
		}
	});

	return widgets;
}

export function wysiwygDecorations() {
	return StateField.define<DecorationSet>({
		create(state) {
			return RangeSet.of(buildDecorations(state), true);
		},

		update(_, transaction) {
			return RangeSet.of(buildDecorations(transaction.state), true);
		},

		provide(field) {
			return EditorView.decorations.from(field);
		}
	});
}
