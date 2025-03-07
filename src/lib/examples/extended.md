# WYSIWYG Markdown Editor

A WYSIWYG Markdown editor using [CodeMirror](https://codemirror.net/)

## Markdown Cheat Sheet

Thanks for visiting [The Markdown Guide](https://www.markdownguide.org)!

This Markdown cheat sheet provides a quick overview of all the Markdown syntax elements. It can’t cover every edge case, so if you need more information about any of these elements, refer to the reference guides for [basic syntax](https://www.markdownguide.org/basic-syntax/) and [extended syntax](https://www.markdownguide.org/extended-syntax/).

## Extended Syntax

These elements extend the basic syntax by adding additional features. Not all Markdown applications support these elements.

### Task List

- [x] Write the press release
- [ ] Update the website
- [ ] Contact the media

### Table

| Syntax | Description |
| ----------- | ----------- |
| Header | Title |
| Paragraph | Text |

### Fenced Code Block

```ts
const state = EditorState.create({
	doc: 'my source code',
	extensions: [
		coolGlow
	]
});
```

### Strikethrough

~~The world is flat.~~

### Emoji

That is so funny! :joy:

(See also [Copying and Pasting Emoji](https://www.markdownguide.org/extended-syntax/#copying-and-pasting-emoji))

### Highlight

I need to highlight these ==very important words==.

### Subscript

H~2~O

### Superscript

X^2^

### Heading ID

### My Great Heading {#custom-id}

### Definition List

term
: definition

### Footnote

Here's a sentence with a footnote. [^1]

[^1]: This is the footnote.