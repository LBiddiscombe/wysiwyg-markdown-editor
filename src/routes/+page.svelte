<script lang="ts">
	import Editor from './Editor/Editor.svelte';
	import { ThemeToggle } from '$lib';
</script>

<div class="navbar bg-base-100 sticky top-0 z-10 shadow-sm">
	<div class="flex-1">
		<a class="btn btn-ghost text-xl" href="/">Rich Markdown Editor</a>
	</div>
	<div class="flex-none">
		<ThemeToggle />
	</div>
</div>

<div class="container mx-auto h-full max-w-4xl">
	<Editor />
</div>
