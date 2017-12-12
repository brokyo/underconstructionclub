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
      <pre>{{loops}}</pre>
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
      p5Objects: []
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
  	var canvasWidth = 1200
  	var canvasHeight = 200

    var systemDuration = this.getSystemDuration()

  	var canvasPixPerSecond = canvasWidth / systemDuration
    var canvasPixPerSystemHeight = canvasHeight / this.loops.length

  	var pixPerNote = canvasPixPerSystemHeight / midiLength.range


    function System(system) {
      system.echo = 10
      // Commented out need to be in display function or they wont update
      // this.x = system.start * canvasPixPerSecond
      this.y = system.index * canvasPixPerSystemHeight
      // this.width = system.length * canvasPixPerSecond
      this.height = canvasPixPerSystemHeight

      this.systemWidth = system.length * canvasPixPerSecond
      this.seedPixPerSecond = this.systemWidth / system.length
      console.log(this.seedPixPerSecond)

      this.display = function(sketch) {
        sketch.rect(system.start * canvasPixPerSecond, this.y, system.length * canvasPixPerSecond, this.height)
      }

      this.drawSeeds = function(sketch) {
        system.events.forEach((seed) => {
          sketch.rect((seed.start * this.seedPixPerSecond) + (system.start * this.seedPixPerSecond), ((midiLength.max - seed.midi) * pixPerNote) + (system.index * canvasPixPerSystemHeight), seed.duration * this.seedPixPerSecond, pixPerNote)
        })
      }

      this.drawEcho = function(sketch) {
        system.events.forEach((seed) => {
          for (var i = 1; i < system.echo; i++) {
            sketch.fill('rgba(65, 65, 65,' + (1 - (i/system.echo)) + ')')
            sketch.rect((seed.start * this.seedPixPerSecond) + (system.start * this.seedPixPerSecond) + ((5 * i) * this.seedPixPerSecond), ((midiLength.max - seed.midi) * pixPerNote) + (system.index * canvasPixPerSystemHeight), seed.duration * this.seedPixPerSecond, pixPerNote)
          }
        })
      }
    }

    this.loops.forEach((system) => {
      this.p5Objects.push(new System(system))
    })

  	// P5 setup
  	var myp5 = new p5((sketch) => {
  	  sketch.setup = () => {
  	  	let canvas = sketch.createCanvas(canvasWidth, canvasHeight);
  	    canvas.parent('canvas')
  	    sketch.background(0)
  	  };

  	  sketch.draw = () => {
        sketch.background(0)
        this.p5Objects.forEach((system)=>{
          sketch.fill(255)
          system.display(sketch)
          sketch.fill(25)
          system.drawSeeds(sketch)
          // for(var i; i < 5; i++){
          system.drawEcho(sketch)
            // i++
          // }
        })
      }
  	})
  }
}
</script>

<style lang="css" scoped>
</style>
