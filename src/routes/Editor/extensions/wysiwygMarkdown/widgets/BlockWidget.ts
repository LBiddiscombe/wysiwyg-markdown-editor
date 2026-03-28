import { EditorView, WidgetType } from '@codemirror/view';
import { marked } from 'marked';

export class BlockWidget extends WidgetType {
	constructor(private source: string) {
		super();
	}

	eq(widget: WidgetType): boolean {
		if (widget instanceof BlockWidget) {
			return this.source === widget.source;
		}
		return false;
	}

	toDOM(view: EditorView): HTMLElement {
		const containerElement = document.createElement('div');
		containerElement.className = 'cm-renderBlock';
		containerElement.innerHTML = marked.parse(this.source) as string;

		containerElement.onclick = ({ x, y }) => {
			view.dispatch({
				selection: {
					anchor: view.posAtCoords({ x, y }) || 0
				}
			});
		};

		return containerElement;
	}
}
