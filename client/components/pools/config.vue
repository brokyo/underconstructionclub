<template>
	<main>
      <div v-for="(loop, index) in loops">
        <h3>Loop {{index}} - {{Math.round(loop.length * 100) / 100}} Seconds</h3>
        <label>Start</label>
        <input v-model="loop.start"></input>
        <label>Interval</label>
        <input v-model="loop.interval"></input>
        <label>Playback Rate</label>
    	<input v-model="loop.playbackRate"></input>
    	<label>Note Shift Range</label>
    	<input v-model="loop.maxShift"></input>
      </div>
      <div id="canvas">
      </div>
	</main>
</template>

<script>
var Tone = require('tone')
var p5 = require('p5')
var _ = require('lodash')

export default {
  name: 'config',
  props: ['loops'],
  data () {
  	return {

  	}
  },
  methods: {
  	getMidiLength(systems) {
  		let systemMidiMin = []
  		let systemMidiMax = []

  		systems.forEach((system) => {
  			systemMidiMin.push(_.minBy(system.events, 'midi').midi)
	   		systemMidiMax.push(_.maxBy(system.events, 'midi').midi)
		  })

  		let max = _.max(systemMidiMax) + 3
  		let min = _.min(systemMidiMin) - 3
  		return {range: max - min , max: max}
  	},
    getSystemDuration() {
      let allDurations = []
      this.loops.forEach((loop) => {
        allDurations.push(loop.length)
      })

      let systemDuration = _.max(allDurations)

      return systemDuration
    }
  },
  mounted () {
  	var vue = this

  	let midiLength = this.getMidiLength(this.loops)
		// Vue values
  	var canvasWidth = 800
  	var canvasHeight = 200

    var systemDuration = this.getSystemDuration()

  	var canvasPixPerSecond = canvasWidth / systemDuration
    var canvasPixPerSystemHeight = canvasHeight / this.loops.length

  	var pixPerNote = canvasPixPerSystemHeight / midiLength.range

    let count = 0
  	// P5 setup
  	var myp5 = new p5((sketch) => {
  	  sketch.setup = () => {
  	  	let canvas = sketch.createCanvas(canvasWidth, canvasHeight);
  	    canvas.parent('canvas')
  	    sketch.background(0)
        // sketch.noLoop()
  	  };

  	  sketch.draw = () => {
        sketch.background(0)
        this.loops.forEach((loop, index) => {
          let systemWidth = loop.length * canvasPixPerSecond
          let systemHeight = loop.length * canvasPixPerSystemHeight

          sketch.fill('rgba(55, 55, 55, 0.4)')
          sketch.rect(loop.start * canvasPixPerSecond, index * canvasPixPerSystemHeight, systemWidth, canvasPixPerSystemHeight )

          loop.events.forEach((event) => {
            var eventPixPerSecond = systemWidth / loop.length

            sketch.fill(255);
            sketch.rect((event.start + loop.start) * eventPixPerSecond, ((midiLength.max - event.midi) * pixPerNote) + (index * canvasPixPerSystemHeight), event.duration * eventPixPerSecond, pixPerNote);
          })

        })
      }
  	})
  }
}
</script>

<style lang="css" scoped>
</style>
