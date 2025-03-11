<script lang="ts">
	import basic from './examples/basic.md?raw';
	import extended from './examples/extended.md?raw';
	import code from './examples/code.md?raw';

	interface Props {
		content: string;
	}

	let { content = $bindable() }: Props = $props();

	const examples = [
		{ name: 'Basic', content: basic },
		{ name: 'Extended', content: extended },
		{ name: 'Code', content: code }
	];

	$effect(() => {
		content = examples[0].content;
	});
</script>

<div>
	<label class="select">
		<span class="label">Example</span>
		<select class="select select-bordered select-sm" bind:value={content}>
			<option disabled>Choose an example</option>
			{#each examples as example, i}
				<option value={example.content} selected={i === 0}>{example.name}</option>
			{/each}
		</select>
	</label>
</div>
