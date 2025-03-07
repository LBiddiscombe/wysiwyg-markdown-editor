<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { EditorView } from '@codemirror/view';
	import { EditorState, Compartment } from '@codemirror/state';
	import { extensions } from './extensions';
	import { appState } from '$lib/appState.svelte';

	let { content } = $props();

	let editor = $state<EditorView>();
	const themeCompartment = new Compartment();
	const lightTheme = EditorView.theme({}, { dark: false });
	const darkTheme = EditorView.theme({}, { dark: true });

	onMount(() => {
		const parent = document.getElementById('editor')!;
		editor = new EditorView({
			parent,
			state: EditorState.create({
				doc: content,
				extensions: [
					...extensions,
					themeCompartment.of(appState.dark ? darkTheme : lightTheme),
					EditorView.updateListener.of((update) => {
						untrack(() => {
							content = update.state.doc.toString();
						});
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
		margin: 0 0.25rem 0 0.25rem;
		content: '•';
	}
</style>
