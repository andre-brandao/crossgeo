<script lang="ts">
	import Chart, {
		type ChartConfiguration,
	} from 'chart.js/auto'

	export let config: ChartConfiguration
	export let id: string = ''

	export let chart: Chart | null = null

	export let width = 400
	export let height = 400

	function mountMap(node: HTMLCanvasElement) {
		const ctx = node.getContext('2d')
		if (!ctx) return
		chart = new Chart(ctx, config)
	}
</script>

<canvas
	{id}
	use:mountMap
	{width}
	{height}
></canvas>
