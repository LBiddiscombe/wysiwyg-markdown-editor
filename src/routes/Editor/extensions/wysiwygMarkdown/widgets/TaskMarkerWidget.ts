import { EditorView, WidgetType } from "@codemirror/view";

export class TaskMarkerWidget extends WidgetType {
  constructor(private source: string, private from: number) {
    super();
  }

  eq(widget: WidgetType): boolean {
    if (widget instanceof TaskMarkerWidget) {
      return this.source === widget.source;
    }
    return false
  }

  toDOM(view: EditorView): HTMLElement {
    const containerElement = document.createElement('span');
    const checked = this.source.charAt(1) === 'x';

    containerElement.innerHTML = `<input type='checkbox' class='w-4 h-4 rounded align-baseline cursor-pointer' ${checked ? 'checked' : ''}>`;

    containerElement.onclick = ({ x, y, target }) => {
      if (target) {
        view.dispatch({
          changes: [{
            from: this.from + 1,
            to: this.from + 2,
            insert: checked ? ' ' : 'x'
          }]
        })
      }
    }

    return containerElement;
  }
}