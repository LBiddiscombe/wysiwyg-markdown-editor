<script lang="ts">
	import Editor from './Editor/Editor.svelte';
	import { ThemeToggle } from '$lib';
	import ExamplePicker from '$lib/ExamplePicker.svelte';
	import type { SvelteComponent } from 'svelte';

	let content = $state('');
	let isOpen = $state<boolean>(true);
	let editorComponent = $state<SvelteComponent>();

	function onFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const files = target.files;

		if (files && files.length > 0) {
			const file = files[0];
			editorComponent!.handleFile(file);
		}
	}

	$effect(() => {
		content;
		isOpen = false;
	});

	function handleDownload() {
		const editorContent = editorComponent!.getContent();
		const blob = new Blob([editorContent], { type: 'text/markdown' });
		let url = URL.createObjectURL(blob);
		let element = document.createElement('a');
		element.setAttribute('download', 'Downloaded Successfully');
		element.href = url;
		element.download = 'markdown.md';
		element.click();
		element.remove();
	}

	async function handleCopyToClipboard(event: Event) {
		const target = event.target as HTMLButtonElement;
		const editorContent = editorComponent!.getContent();

		try {
			await navigator.clipboard.writeText(editorContent);
			target.textContent = 'Copied!';
		} catch (error) {
			if (error instanceof Error) {
				target.textContent = 'Failed to copy!';
				alert(error.message);
			}
		}

		setTimeout(() => {
			target.textContent = 'Copy to Clipboard';
		}, 1000);
	}
</script>

<div class="drawer lg:drawer-open">
	<input bind:checked={isOpen} id="left-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col items-center justify-start">
		<!-- Page content here -->
		<label
			for="left-drawer"
			class="btn btn-ghost-outline drawer-button sticky top-2 z-1 m-2 self-start lg:hidden"
		>
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
		<div class="container mx-auto max-w-4xl">
			{#key content}
				<Editor bind:this={editorComponent} {content} editorId="editor-1" />
			{/key}
		</div>
	</div>
	<div class="drawer-side">
		<label for="left-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
		<ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
			<!-- Sidebar content here -->
			<div class="flex flex-1 flex-col gap-2">
				<h1 class="mt-12 text-center text-xl font-bold lg:mt-0">WYSIWYG Markdown Editor</h1>
				<div class="divider">Load Example</div>
				<ExamplePicker bind:content />
				<div class="divider mt-8">Upload Markdown</div>
				<input
					type="file"
					class="file-input file-input-ghost"
					accept=".md"
					onchange={onFileChange}
				/>
				<p class="text-center text-xs italic">
					Or you can also drop a markdown file straight on to the editor
				</p>
			</div>
			<div class="flex flex-none flex-col gap-2">
				<div class="divider">Save Markdown</div>
				<button class="btn btn-primary" onclick={handleCopyToClipboard}>Copy to Clipboard</button>
				<button class="btn btn-success mb-8" onclick={handleDownload}>Download Markdown</button>
				<ThemeToggle />
			</div>
		</ul>
	</div>
</div>
