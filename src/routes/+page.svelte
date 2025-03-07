<script lang="ts">
	import Editor from './Editor/Editor.svelte';
	import { ThemeToggle } from '$lib';
	import ExamplePicker from '$lib/ExamplePicker.svelte';

	let content = $state('');
</script>

<div class="navbar bg-base-100 sticky top-0 z-10 shadow-sm">
	<div class="flex-1">
		<a class="btn btn-ghost text-xl" href="/">Rich Markdown Editor</a>
	</div>
	<div class="flex-1">
		<ExamplePicker bind:content />
	</div>
	<div class="flex-none">
		<ThemeToggle />
	</div>
</div>

<div class="container mx-auto max-w-4xl">
	{#key content}
		<Editor {content} editorId="editor-1" />
	{/key}
</div>
