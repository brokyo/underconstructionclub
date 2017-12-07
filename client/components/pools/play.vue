<template>
	<main>
		<button v-if="!playing" @click="playLoops">Play</button>
		<img :src="embed"></img>
	</main>
</template>

<script>
var Tone = require('tone')

export default {
  name: 'play',
  props: ['loops'],
  data () {
    return {
    	cacheBreak: 0,
    	playing: false
    }
  },
  computed: {
  	embed () {
  		return 'http://207.251.86.238/cctv391.jpg?cache='+this.cacheBreak
  	}
  },
  methods: {
  	playLoops () {
  		this.loops.forEach((loop, index)=>{
  			let newLoop = new Tone.Loop((time) => {
  				
  				// Do The mutation here
  				console.log(time)

  				loop.events.forEach((event) => {
  					let line = 'line' + index
  					this.$parent[line].synth.triggerAttackRelease(event.note, event.duration, time + event.start, 0.75)
  				})
  			}, loop.length + loop.interval)

  			newLoop.start(loop.start)

  		})

	  	Tone.Transport.start()
  		this.playing = true
  	}
  },
  mounted () {
  	setInterval(() => {
	  	this.cacheBreak = Math.random()
  	}, 1000)
  },
  beforeDestroy () {
	Tone.Transport.stop()
  }
}
</script>

<style lang="scss" scoped>
	button {
		position: absolute;
		height: 100vh;
		width: 100vw;
	}

	img {
		height: 100vh;
		width: 100vw;
	}
</style>