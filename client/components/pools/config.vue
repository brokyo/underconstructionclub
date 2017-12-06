<template>
	<main>
		<div v-for="(loop, index) in loops">
			<h3>{{index}}</h3>
			<label>Start</label>
			<input v-model="loop.start"></input>
			<label>Hold</label>
			<input v-model="loop.interval"></input>
		</div>
		<div>
			<h2>Global</h2>
			<label>Note Delay</label>
			<input v-model="global.noteDelay"></input>
			<label>Humanize</label>
			<input v-model="global.humanize"></input>
			<label>Probability</label>
			<input v-model="global.probability"></input>
			<label>Panner High</label>
			<label>Panner Low</label>
			<label>Filter</label>
			<label>EQ</label>
		</div>
	</main>
</template>

<script>
export default {
  name: 'config',
  data () {
    return {
    	global: {
    		noteDelay: 5,
    		humanize: 0,
    		probability: 1
    	},
    	loop0: {
    		start: 0,
    		loopHold: 0,
    	},
    	loop1: {
    		start: 0,
    		loopHold: 0,
    	}
    }
  }
}
</script>

<style lang="css" scoped>
</style>