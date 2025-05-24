import { EditorView, WidgetType } from "@codemirror/view";
import { mermaidHelper } from './mermaidHelper';

export class MermaidWidget extends WidgetType {

  constructor(private source: string) {
    super();
  }

  eq(widget: WidgetType): boolean {
    if (widget instanceof MermaidWidget) {
      return this.source === widget.source;
    }
    return false
  }

  toDOM(view: EditorView): HTMLElement {
    const containerElement = mermaidHelper.text2SVG(this.source);

    containerElement.className = 'cm-mermaid w-full';

    containerElement.onclick = ({ x, y }) => {
      view.dispatch({
        selection: {
          anchor: (view.posAtCoords({ x, y }) || 0)
        }
      })
    }

    return containerElement;
  }
}