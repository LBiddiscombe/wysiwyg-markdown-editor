import { EditorView, WidgetType } from "@codemirror/view";
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

export class BlockWidget extends WidgetType {
  constructor(private source: string) {
    super();
  }

  eq(widget: WidgetType): boolean {
    if (widget instanceof BlockWidget) {
      return this.source === widget.source;
    }
    return false
  }

  toDOM(view: EditorView): HTMLElement {
    const processor = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeStringify)
    const containerElement = document.createElement('div');
    containerElement.className = 'cm-renderBlock';
    containerElement.innerHTML = processor.processSync(this.source).toString();

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