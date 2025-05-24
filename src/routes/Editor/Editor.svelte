<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { EditorView } from '@codemirror/view';
	import { EditorState, Compartment } from '@codemirror/state';
	import { extensions } from './extensions';
	import { appState } from '$lib/appState.svelte';

	let { content, editorId } = $props();

	let editor = $state<EditorView>();
	const themeCompartment = new Compartment();
	const lightTheme = EditorView.theme({}, { dark: false });
	const darkTheme = EditorView.theme({}, { dark: true });

	export function getContent() {
		if (!editor) return '';
		return editor.state.doc.toString();
	}

	export function handleFile(file: File) {
		if (!editor) return;
		if (editor.state.readOnly) return true;
		let reader = new FileReader();
		reader.readAsText(file);

		reader.onload = () => {
			if (!/[\x00-\x08\x0e-\x1f]{2}/.test(reader.result as string)) {
				editor!.dispatch({
					changes: [
						{
							from: 0,
							to: editor!.state.doc.length,
							insert: reader.result as string
						}
					]
				});
			}
		};
	}

	onMount(() => {
		const parent = document.getElementById(editorId)!;
		editor = new EditorView({
			parent,
			state: EditorState.create({
				doc: content,
				extensions: [
					...extensions,
					themeCompartment.of(appState.dark ? darkTheme : lightTheme),
					EditorView.updateListener.of((update) => {
						content = update.state.doc.toString();
					}),
					EditorView.domEventHandlers({
						drop(event, view) {
							if (!event.dataTransfer) return false;

							let files = event.dataTransfer.files;
							if (!files || files.length > 1 || files[0].type !== 'text/markdown') {
								alert('One markdown file can be dropped here to replace the current content.');
								return true;
							}

							if (files) {
								handleFile(files[0]);
								return true;
							}

							return false;
						}
					})
				]
			})
		});
		editor.focus();
	});

	$effect(() => {
		appState.dark;
		if (!editor) return;
		untrack(() => {
			editor!.dispatch({
				effects: themeCompartment.reconfigure(appState.dark ? darkTheme : lightTheme)
			});
		});
	});
</script>

<div id={editorId}></div>

<!-- Theme styles that I can't seem to do in theme.ts  -->
<style>
	:global(:root:has(input.theme-controller[value='dark']:checked) .cm-mermaid) {
		filter: invert(0.78);
	}

	:global(.cm-line .cm-bullet *) {
		display: none;
	}

	:global(.cm-line .cm-bullet::after) {
		display: inline !important;
		color: darkgray;
		margin: 0 0.5rem 0 0.75rem;
		content: '•';
	}

	:global(.cm-line .cm-ordered) {
		margin-left: 0.75rem;
	}
</style>
