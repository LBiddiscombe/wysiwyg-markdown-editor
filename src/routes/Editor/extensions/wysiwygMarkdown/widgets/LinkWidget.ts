import { EditorView, WidgetType } from "@codemirror/view";

export class LinkWidget extends WidgetType {
  constructor(private text: string, private url: string) {
    super()
  }

  eq(widget: WidgetType): boolean {
    if (widget instanceof LinkWidget) {
      return this.text === widget.text && this.url === widget.url
    }
    return false
  }

  toDOM(view: EditorView): HTMLElement {
    let link = document.createElement('a')
    link.textContent = this.text
    link.href = this.url
    link.target = '_blank'
    link.className = 'font-sans underline cursor-pointer text-blue-600'
    return link;
  }
}