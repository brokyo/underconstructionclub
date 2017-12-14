<template>
	<main>
      <div v-for="(system, index) in systems">
        <h3>system {{index}} - {{system.systemDuration}} Seconds</h3>
        <label>Start (seconds)</label>
        <input v-model.number="system.start"></input>
        <label>Interval (seconds)</label>
        <input v-model.number="system.interval"></input>
        <label>Playback Rate (1 is normal speed, .5 half, etc)</label>
        <input v-model.number="system.playbackRate"></input>
        <label>Playback Rate range (decimal as percentage [0 is no change, 0.5 50% more or less, etc) </label>
        <input v-model.number="system.playbackRange"></input>
        <label>Note Smudge (decimal as percentage. [.1 is 10% in either direction, .5 is 50%, etc])</label>
        <input v-model.number="system.noteSmudge"></input>
        <label>Duration Smudge (decimal as percentage. [.1 is 10% in either direction, .5 is 50%, etc])</label>
        <input v-model.number="system.durationSmudge"></input>
      </div>
      <div id="canvas">
      </div>
      <pre>{{systems}}</pre>
	</main>
</template>

<script>
var Tone = require('tone')
var p5 = require('p5')
var _ = require('lodash')

export default {
  name: 'config',
  props: ['systems'],
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
  			systemMidiMin.push(_.minBy(system.seeds, 'midi').midi)
	   		systemMidiMax.push(_.maxBy(system.seeds, 'midi').midi)
		  })

  		let max = _.max(systemMidiMax) + 3
  		let min = _.min(systemMidiMin) - 3
  		return {range: max - min , max: max}
  	},
    getSystemDuration() {
      let systemDuration = 0
      this.systems.forEach((system) => {
        systemDuration += system.systemDuration
      })

      return systemDuration
    }
  },
  mounted () {
  	var vue = this

  	let midiLength = this.getMidiLength(this.systems)

		// Vue values
  	var canvasWidth = 1200
  	var canvasHeight = 200

    var systemDuration = this.getSystemDuration()
    console.log(systemDuration)
  	var canvasPixPerSecond = canvasWidth / systemDuration
    var canvasPixPerSystemHeight = canvasHeight / this.systems.length

  	var pixPerNote = canvasPixPerSystemHeight / midiLength.range


    function System(system) {
      // Commented out need to be in display function or they wont update
      // this.x = system.start * canvasPixPerSecond
      this.y = system.index * canvasPixPerSystemHeight
      // this.width = system.length * canvasPixPerSecond
      this.height = canvasPixPerSystemHeight

      this.systemWidth = system.systemDuration * canvasPixPerSecond
      this.seedPixPerSecond = this.systemWidth / system.systemDuration

      this.display = function(sketch) {
        sketch.rect(system.start * canvasPixPerSecond, this.y, system.systemDuration * canvasPixPerSecond, this.height)
      }

      this.drawSeeds = function(sketch) {
        system.seeds.forEach((seed) => {
          sketch.rect((seed.start * this.seedPixPerSecond) + (system.start * this.seedPixPerSecond), ((midiLength.max - seed.midi) * pixPerNote) + (system.index * canvasPixPerSystemHeight), seed.duration * this.seedPixPerSecond, pixPerNote)
        })
      }

      this.drawEcho = function(sketch) {
        system.seeds.forEach((seed) => {
          for (var i = 1; i < system.echoCount; i++) {
            sketch.fill('rgba(65, 65, 65,' + (1 - (i/system.echoCount)) + ')')
            sketch.rect((seed.start * this.seedPixPerSecond) + (system.start * this.seedPixPerSecond) + ((5 * i) * this.seedPixPerSecond), ((midiLength.max - seed.midi) * pixPerNote) + (system.index * canvasPixPerSystemHeight), seed.duration * this.seedPixPerSecond, pixPerNote)
          }
        })
      }
    }

    this.systems.forEach((system) => {
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
