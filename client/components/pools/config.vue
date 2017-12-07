<template>
	<main>
		<button @click="playLoops">Play</button>
      <div v-for="(loop, index) in loops">
        <h3>Loop {{index}} - {{Math.round(loop.length * 100) / 100}} Seconds</h3>
        <label>Start</label>
        <input v-model="loop.start"></input>
        <label>Loop Hold</label>
        <input v-model="loop.interval"></input>
        <pre v-for="event in loop.events">{{event.note}} Start: {{event.start}} Duration: {{event.duration}}</pre>
      </div>
	</main>
</template>

<script>
var Tone = require('tone')

export default {
  name: 'config',
  props: ['loops']
}
</script>

<style lang="css" scoped>
</style>