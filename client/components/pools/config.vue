<template>
	<main>
      <div v-for="(system, index) in systems">
        <h3>system {{index}} - {{(system.params.timing.duration).toFixed()}} Seconds</h3>
        <div class="params">
          <div class="category">
            <h4>Timing</h4>
            <p>In Seconds. Set start time and gap in between system looping.</p>
            <div class="input">
              <label>Start [seconds]</label>
              <input type="number" v-model.number="system.params.timing.start"></input>
            </div>
            <div class="input">
              <label>Interval [seconds]</label>
              <input type="number" v-model.number="system.params.timing.interval"></input>
            </div>
          </div>

          <div class="category">
            <h4>Playback</h4>
            <p>Set system playback speed. 1 is normal, 2 is double, 0.5 is half-speed, etc</p>
            <div class="input">
              <label>Playback Rate Base [decimal]</label>
              <input type="number" v-model.number="system.params.playback.base" @change="changeDuration(system)"></input>
            </div>
            <div class="input">
              <label>Playback Rate range [decimal %]</label>
              <input type="number" v-model.number="system.params.playback.range"></input>
            </div>
            <div class="input">
              <label>New Values After [loops]</label>
              <input type="number" v-model.number="system.params.playback.interval"></input>
            </div>
          </div>

          <div class="category">
            <h4>Note</h4>
            <p>Max percentange (as decimal) note pitch will uniformly change.</p>
            <div class="input">
              <label>Note Smudge Base [decimal]</label>
              <input type="number" v-model.number="system.params.note.base"></input>
            </div>
            <div class="input">
              <label>Smudge Range [decimal]</label>
              <input type="number" v-model.number="system.params.note.range"></input>
            </div>
            <div class="input">
              <label>New Values After [loops]</label>
              <input type="number" v-model.number="system.params.note.interval"></input>
            </div>
          </div>

          <div class="category">
            <h4>Duration</h4>
            <p>Max percentage (as decimal) note duration will uniformly change.</p>
            <div class="input">
              <label>Duration Smudge Base [decimal]</label>
              <input type="number" v-model.number="system.params.duration.base"></input>
            </div>
            <div class="input">
              <label>Duration Smudge Range [decimal]</label>
              <input type="number" v-model.number="system.params.duration.range"></input>
            </div>
            <div class="input">
              <label>New Values After [loops]</label>
              <input type="number" v-model.number="system.params.duration.interval"></input>
            </div>
          </div>
        </div>
      </div>
      <div id="canvas">
      </div>
      <pre v-for="system in systems">
        {{system}}
      </pre>
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
      system.active.duration = system.params.timing.duration / system.params.playback.base
    }
  },
  mounted () {
  	var vue = this

  	let midiLength = this.getMidiLength(this.systems)

		// Vue values
  	var canvasWidth = 1200
  	var canvasHeight = 200

    var systemDuration = (this.systems[0].active.duration * 0.75) + (this.systems[1].active.duration * 0.75)
  	var canvasPixPerSecond = canvasWidth / systemDuration
    var canvasPixPerSystemHeight = canvasHeight / this.systems.length

  	var pixPerNote = canvasPixPerSystemHeight / midiLength.range


    function System(system) {
      // Commented out need to be in display function or they wont update
      // this.x = system.start * canvasPixPerSecond
      this.y = system.index * canvasPixPerSystemHeight
      // this.width = system.length * canvasPixPerSecond
      this.height = canvasPixPerSystemHeight

      this.display = function(sketch) {
        sketch.rect(system.params.timing.start * canvasPixPerSecond, this.y, system.active.duration * canvasPixPerSecond, this.height)
      }

      this.drawSeeds = function(sketch) {
        system.seeds.forEach((seed) => {
          sketch.rect(
            ((seed.start / system.params.playback.base) + system.params.timing.start) * canvasPixPerSecond,
            ((midiLength.max - seed.midi) * pixPerNote) + (system.index * canvasPixPerSystemHeight),
            (seed.duration / system.params.playback.base) * canvasPixPerSecond,
            pixPerNote
          )
        })
      }

      this.drawEcho = function(sketch) {
        system.seeds.forEach((seed) => {
          for (var i = 1; i < system.params.patch.echo; i++) {
            sketch.fill('rgba(65, 65, 65,' + (1 - (i/system.params.patch.echo)) + ')')
            sketch.rect((seed.start / system.params.playback.base * ((system.active.duration * canvasPixPerSecond) / system.active.duration)) + (system.params.timing.start / system.params.playback.base * ((system.active.duration * canvasPixPerSecond) / system.active.duration)) + ((5 * i) * ((system.active.duration * canvasPixPerSecond) / system.active.duration)), ((midiLength.max - seed.midi) * pixPerNote) + (system.index * canvasPixPerSystemHeight), seed.duration / system.params.playback.base * ((system.active.duration * canvasPixPerSecond) / system.active.duration), pixPerNote)
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
          system.drawEcho(sketch)
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
