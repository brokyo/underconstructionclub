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
    	<div :id="'canvas'+index"></div>
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
		console.log(max)
		let min = _.min(systemMidiMin) - 3
		console.log(min)
		return {range: max - min , max: max}
  	}
  },
  mounted () {
  	var vue = this

  	let midiLength = this.getMidiLength(this.loops)
  	console.log(midiLength)
  	this.loops.forEach((loop) => {	  	
  		// Vue values
	  	var canvasWidth = 800
	  	var canvasHeight = 200

	  	var pixPerSecond = canvasWidth / (loop.length - loop.start)
	  	var pixPerNote = canvasHeight / midiLength.range


	  	// P5 setup
	  	var myp5 = new p5((sketch) => {
		  sketch.setup = function() {
		  	let canvas = sketch.createCanvas(canvasWidth, canvasHeight);
		    canvas.parent('canvas' + loop.index)
		    sketch.background(0)
		    sketch.noLoop()
		  };

		  sketch.draw = function() {
		  	loop.events.forEach((event) => {
			    sketch.fill(255);
			    sketch.rect(event.start * pixPerSecond, (midiLength.max - event.midi) * pixPerNote, event.duration * pixPerSecond, pixPerNote);
		  	})
		  };
	  	})
  	})
  }
}
</script>

<style lang="css" scoped>
</style>