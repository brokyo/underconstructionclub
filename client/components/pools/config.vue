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
  props: ['loops'],
  data () {
    return {

    }
  },
  methods: {
  	playLoops () {
  		var vue = this
  		vue.loops.forEach((loop, index)=>{
  			function startLoop() {
  				console.log('again')
			  	Tone.Transport.schedule((time) => {
			  		loop.events.forEach((event) => {
			  			let line = 'line' + index
			  			vue.$parent[line].synth.triggerAttackRelease(event.note, event.duration, time + event.start, 0.75)
			  		})
			  	}, loop.start)  				
  			}

  			startLoop()
	  		setInterval(startLoop, loop.length + (loop.interval *  1000))

  		})

	  	Tone.Transport.start()
  		vue.playing = true
  	},
  	stopLoops () {
  		Tone.Transport.stop()
  		this.playing = false
  	}
  }
}
</script>

<style lang="css" scoped>
</style>