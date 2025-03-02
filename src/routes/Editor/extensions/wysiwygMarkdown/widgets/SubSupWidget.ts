import { EditorView, WidgetType } from "@codemirror/view";

export class SubSupWidget extends WidgetType {
  constructor(private text: string, private subsup: string) {
    super()
  }

  eq(widget: WidgetType): boolean {
    if (widget instanceof SubSupWidget) {
      return this.text === widget.text && this.subsup === widget.subsup
    }
    return false
  }

  toDOM(view: EditorView): HTMLElement {
    let subsupElement = document.createElement(this.subsup)
    subsupElement.textContent = this.text.slice(1, this.text.length - 1)
    return subsupElement;
  }
}