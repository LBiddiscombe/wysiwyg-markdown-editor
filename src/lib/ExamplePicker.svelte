<script lang="ts">
	import basic from './examples/basic.md?raw';
	import extended from './examples/extended.md?raw';
	import code from './examples/code.md?raw';
	import { appState } from '$lib/appState.svelte';

	const examples = [
		{ name: 'Basic', content: basic },
		{ name: 'Extended', content: extended },
		{ name: 'Code', content: code }
	];

	$inspect(appState);
</script>

<div class="form-control">
	<select class="select select-bordered select-sm" bind:value={appState.content}>
		<option disabled>Choose an example</option>
		{#each examples as example, i}
			<option value={example.content} selected={i === 0}>{example.name}</option>
		{/each}
	</select>
</div>
