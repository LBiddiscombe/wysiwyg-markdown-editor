# WYSIWYG Markdown Editor

A WYSIWYG Markdown editor using [CodeMirror](https://codemirror.net/)

Inspired by [Rich Markdown for CodeMirror 6](https://github.com/segphault/codemirror-rich-markdoc) and [ink-mde](https://github.com/davidmyersdev/ink-mde)

## Markdown Features
A checklist based on this [cheat sheet](https://www.markdownguide.org/cheat-sheet/). The following are supported and styled directly in the editor;

- [x] Headers (h1, h2, h3, h4)
- [x] Blockquotes
- [x] Text emphasis *italic*, **bold**, ***bold italic***, `inline code`
- [x] Text emphasis, highlights, strikethrough in task lists
- [x] Unordered and ordered lists
- [x] Task lists
- [x] Fenced code blocks with syntax highlighting based on language info - e.g. ```javascript
- [x] ```mermaid fenced code blocks render Mermaid diagrams
- [x] Links (clickable), both placeholder syntax and text urls
- [x] Tables
- [x] ~~Strikethrough~~
- [x] ==Highlight==
- [x] Image previews (image links in general throw a bit of a wobbly at the mo!)
- [x] Horizontal rule
- [x] Subscripts and superscripts
- [x] Emojis copy and paste 💥
- [ ] Emojis shortcodes :joy:
- [ ] Footnote style embeddable images in base64 data url
- [ ] Term definitions (summary and details)
- [ ] Footnotes
- [ ] Heading IDs


## Editing Features
- [x] `mod+b` to cycle between selected text normal, *italic*, **bold**, and ***bold italic***
- [x] `mod+enter` to cycle between unordered, unchecked, and checked items (- and * list markers)
- [x] `/` slash command on new lines to quickly add templates such as mermaid diagrams or tables
- [x] **Many** IDE like shortcuts powered by `codemirror` such as undo history, bracket matching, `alt+up arrow / down arrow` to move blocks up and down, find and replace, multiple cursor edits, etc
- [ ] Loading and saving files

