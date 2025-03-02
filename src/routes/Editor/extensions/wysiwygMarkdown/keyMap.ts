import type { KeyBinding } from "@codemirror/view";
import { EditorSelection, type StateCommand } from "@codemirror/state";

export const cycleListType: StateCommand = ({ state, dispatch }) => {
  if (state.readOnly) return false

  const { from } = state.selection.main;
  const line = state.doc.lineAt(from);
  const lineText = line.text;

  const match = lineText.match(/^\s*(\- \[ \]|\- \[x\]|\* \[ \]|\* \[x\]|-|\*) /);
  if (!match) return false;

  const listMarker = match[1][0];
  const listTypes = [`${listMarker} [ ] `, `${listMarker} [x] `, `${listMarker} `];
  const indentation = lineText.indexOf(listMarker);

  const currentType = match[0].trimStart();
  const nextType = listTypes[(listTypes.indexOf(currentType) + 1) % listTypes.length];

  const changes = {
    from: line.from + indentation,
    to: line.from + match[0].length,
    insert: nextType
  };

  dispatch(state.update({ changes }));

  return true
}

const cycleTextEmphasis: StateCommand = ({ state, dispatch }) => {
  if (state.readOnly) return false

  const emphasisMarkers = ["", "*", "**", "***"];

  const transaction = state.changeByRange(({ from, to }) => {
    if (from === to) return { range: EditorSelection.range(from, to) };

    let start = from;
    let end = to;

    while (start > 0 && state.doc.sliceString(start - 1, start) === "*") start--;
    while (end < state.doc.length && state.doc.sliceString(end, end + 1) === "*") end++;

    const text = state.doc.sliceString(start, end);
    const match = text.match(/^(\*{0,3})(.*?)(\*{0,3})$/);

    if (!match) return { range: EditorSelection.range(from, to) };

    const [, startMarker, core, endMarker] = match;
    const currentMarker = startMarker === endMarker ? startMarker : "";
    const nextMarker = emphasisMarkers[(emphasisMarkers.indexOf(currentMarker) + 1) % emphasisMarkers.length];

    const newText = `${nextMarker}${core}${nextMarker}`;

    return {
      changes: { from: start, to: end, insert: newText },
      range: EditorSelection.range(start + nextMarker.length, start + core.length + nextMarker.length),
    };
  });

  if (transaction.changes.empty) return false;
  dispatch(state.update(transaction));

  return true;
}

export const wysiwygKeymap: readonly KeyBinding[] = ([
  { key: "Mod-Enter", run: cycleListType },
  { key: 'Mod-b', run: cycleTextEmphasis },
])