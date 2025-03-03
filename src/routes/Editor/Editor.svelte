<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { EditorView } from '@codemirror/view';
	import { EditorState, Compartment } from '@codemirror/state';

	import { extensions } from './extensions';
	import { appState } from '$lib/appState.svelte';

	let editor = $state<EditorView>();
	const themeCompartment = new Compartment();
	const lightTheme = EditorView.theme({}, { dark: false });
	const darkTheme = EditorView.theme({}, { dark: true });

	onMount(() => {
		const parent = document.getElementById('editor')!;
		editor = new EditorView({
			parent,
			state: EditorState.create({
				doc: appState.content,
				extensions: [
					...extensions,
					themeCompartment.of(appState.dark ? darkTheme : lightTheme),
					EditorView.updateListener.of((update) => {
						appState.content = update.state.doc.toString();
					}),
					EditorView.theme({
						'&': {
							height: '100%',
							minHeight: '100%'
						},
						'&.cm-focused': {
							outline: 'none'
						},
						'&.cm-focused .cm-selectionBackground, ::selection': {
							backgroundColor: '#11CCEE !important'
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

<div id="editor" class="h-full"></div>

<style></style>
