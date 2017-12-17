<template>
	<main>
      <div v-for="(system, index) in systems">
        <h3>system {{index}} - {{(system.performanceDuration).toFixed()}} Seconds</h3>
        <div class="params">
          <div class="category">
            <h4>Timing</h4>
            <p>In Seconds. Set start time and gap in between system looping.</p>
            <div class="input">
              <label>Start [seconds]</label>
              <input type="number" v-model.number="system.timing.start"></input>
            </div>
            <div class="input">
              <label>Interval [seconds]</label>
              <input type="number" v-model.number="system.timing.interval"></input>
            </div>
          </div>

          <div class="category">
            <h4>Playback</h4>
            <p>System loop speed and max variance. New values calculate after number of loops in 'loop change'</p>
            <div class="input">
              <label>Base Playback Rate [decimal]</label>
              <input type="number" v-model.number="system.playback.rate" @change="changeDuration(system)"></input>
            </div>
            <div class="input">
              <label>Playback Rate range [decimal %]</label>
              <input type="number" v-model.number="system.playback.range"></input>
            </div>
            <div class="input">
              <label>New Values After [loops]</label>
              <input type="number" v-model.number="system.playback.interval"></input>
            </div>
          </div>

          <div class="category">
            <h4>Note</h4>
            <p>Note percentage variance. New values calculate after number of loops in 'loop change'</p>
            <div class="input">
              <label>Note Smudge Max [decimal %]</label>
              <input type="number" v-model.number="system.note.smudge"></input>
            </div>
            <div class="input">
              <label>New Values After [loops]</label>
              <input type="number" v-model.number="system.note.interval"></input>
            </div>
          </div>

          <div class="category">
            <h4>Duration</h4>
            <p>Note duration variance. New values calculate after number of loops in 'loop change'</p>
            <div class="input">
              <label>Duration Smudge [decimal %]</label>
              <input type="number" v-model.number="system.duration.smudge"></input>
            </div>
            <div class="input">
              <label>New Values After [loops]</label>
              <input type="number" v-model.number="system.duration.interval"></input>
            </div>
          </div>
        </div>
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
    changeDuration(system) {
      system.performanceDuration = system.systemDuration / system.playback.rate
      system.systemEvents.forEach((event, index) => {
        event.start = system.seeds[index].start / system.playback.rate
        event.duration = system.seeds[index].duration  / system.playback.rate
      })
    }
  },
  mounted () {
  	var vue = this

  	let midiLength = this.getMidiLength(this.systems)

		// Vue values
  	var canvasWidth = 1200
  	var canvasHeight = 200

    var systemDuration = this.systems[0].performanceDuration + this.systems[1].performanceDuration
  	var canvasPixPerSecond = canvasWidth / systemDuration
    var canvasPixPerSystemHeight = canvasHeight / this.systems.length

  	var pixPerNote = canvasPixPerSystemHeight / midiLength.range


    function System(system) {
      // Commented out need to be in display function or they wont update
      // this.x = system.start * canvasPixPerSecond
      this.y = system.index * canvasPixPerSystemHeight
      // this.width = system.length * canvasPixPerSecond
      this.height = canvasPixPerSystemHeight

      this.systemWidth = system.performanceDuration * canvasPixPerSecond
      this.seedPixPerSecond = this.systemWidth / system.performanceDuration

      this.display = function(sketch) {
        sketch.rect(system.timing.start * canvasPixPerSecond, this.y, system.performanceDuration * canvasPixPerSecond, this.height)
      }

      this.drawSeeds = function(sketch) {
        system.systemEvents.forEach((seed) => {
          sketch.rect((seed.start * this.seedPixPerSecond) + (system.timing.start * this.seedPixPerSecond), ((midiLength.max - seed.midi) * pixPerNote) + (system.index * canvasPixPerSystemHeight), seed.duration * this.seedPixPerSecond, pixPerNote)
        })
      }

      this.drawEcho = function(sketch) {
        system.systemEvents.forEach((seed) => {
          for (var i = 1; i < system.echoCount; i++) {
            sketch.fill('rgba(65, 65, 65,' + (1 - (i/system.echoCount)) + ')')
            sketch.rect((seed.start * this.seedPixPerSecond) + (system.start * this.seedPixPerSecond) + ((5 * i) * this.seedPixPerSecond), ((midiLength.max - seed.midi) * pixPerNote) + (system.index * canvasPixPerSystemHeight), seed.duration * this.seedPixPerSecond, pixPerNote)
          }
        })
      }

      this.drawInterval = function (sketch) {
        sketch.rect(system.performanceDuration * canvasPixPerSecond, this.y, system.timing.interval * canvasPixPerSecond, this.height)
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
          // system.drawEcho(sketch)
          sketch.fill(190)
          system.drawInterval(sketch)
        })
      }
  	})
  }
}
</script>

<style lang="scss" scoped>
  .params {
    display: flex;
    width: 1000px;
  }

  label {
    display: block;
    font-size: 12px;
    font-weight: 900;
  }
  .category {
    flex-grow: 1;

    h4 {
      margin-bottom: 4px;
    }

    p {
      font-size: 10px;
      width: 120px;
    }
  }

  .input {

  }
</style>
