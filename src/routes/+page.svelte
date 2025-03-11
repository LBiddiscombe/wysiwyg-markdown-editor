<script lang="ts">
	import Editor from './Editor/Editor.svelte';
	import { ThemeToggle } from '$lib';
	import ExamplePicker from '$lib/ExamplePicker.svelte';

	let content = $state('');
</script>

<!-- <div class="navbar bg-base-100 sticky top-0 z-10 shadow-sm">
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
</div> -->

<div class="drawer">
	<input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col">
		<!-- Navbar -->
		<div class="navbar bg-base-300 w-full">
			<div class="flex-none lg:hidden">
				<label for="my-drawer-3" aria-label="open sidebar" class="btn btn-square btn-ghost">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="inline-block h-6 w-6 stroke-current"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						></path>
					</svg>
				</label>
			</div>
			<div class="mx-2 flex-1 px-2">WYSIWYG Markdown Editor</div>
			<div class="hidden flex-none lg:block">
				<ul class="menu menu-horizontal items-center gap-2">
					<!-- Navbar menu content here -->
					<button class="btn btn-primary">Upload Markdown</button>
					<button class="btn btn-success">Download</button>
					<ExamplePicker bind:content />
					<ThemeToggle />
				</ul>
			</div>
		</div>
		<!-- Page content here -->
		<div class="container mx-auto max-w-4xl">
			{#key content}
				<Editor {content} editorId="editor-1" />
			{/key}
		</div>
	</div>
	<div class="drawer-side">
		<label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay"></label>
		<ul class="menu bg-base-200 min-h-full w-80 gap-2 p-4">
			<!-- Sidebar content here -->
			<div class="flex flex-1 flex-col gap-2">
				<button class="btn btn-primary">Upload Markdown</button>
				<button class="btn btn-success">Download</button>
				<ExamplePicker bind:content />
			</div>
			<div class="flex flex-none justify-end">
				<ThemeToggle />
			</div>
		</ul>
	</div>
</div>
