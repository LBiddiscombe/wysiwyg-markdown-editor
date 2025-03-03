import { EditorView, WidgetType } from "@codemirror/view";

export class CopyCodeWidget extends WidgetType {
  constructor(private code: string) {
    super()
  }

  eq(widget: WidgetType): boolean {
    if (widget instanceof CopyCodeWidget) {
      return this.code === widget.code
    }
    return false
  }

  toDOM(view: EditorView): HTMLElement {
    let copyBtn = document.createElement('button')
    copyBtn.textContent = 'Copy'
    copyBtn.className = 'btn btn-soft btn-xs btn-primary absolute right-3 hidden group-hover:inline'
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(this.code)
      copyBtn.textContent = 'Copied!'
      setTimeout(() => {
        copyBtn.textContent = 'Copy'
      }, 1000)

    }

    return copyBtn;
  }
}