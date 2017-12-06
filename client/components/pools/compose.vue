<template>
	<main>
		<div id="triggers">
			<button v-for="trigger in triggers" class="synthTrigger" :class="{active: trigger.active}" @mousedown="attack(trigger.note); trigger.active = true" @mouseup="release(trigger.note); trigger.active = false" v-on:touchstart="attack(trigger.note); trigger.active = true" v-on:touchend="release(trigger.note); trigger.active = false">
				{{trigger.note}}
			</button>
		</div>
		<div id="controls">
			<button @click="startRecording(0)" v-if="recording !== 0" class="recordingButton" id="startButton">Loop0</button>
      <button @click="endRecording(0)" v-else class="recordingButton" id="endButton">End</button>
      <button @click="saveLoop(0)" :disabled="!loop0.events">Save</button>
      <button @click="startRecording(1)" v-if="recording !== 1" class="recordingButton" id="startButton">Loop1</button>
      <button @click="endRecording(1)" v-else class="recordingButton" id="endButton">End</button>
      <button @click="saveLoop(1)" :disabled="!loop1.events">Save</button>
		</div>
	</main>
</template>

<script>
var Tone = require('tone')
var _ = require('lodash')

export default {
  name: 'compose',
  data () {
  	return {
  		recording: false,
  		triggers: [
  			{note: 'B3', active: false, keyCode: 'q'},
  			{note: 'G3', active: false, keyCode: 'w'},
  			{note: 'D4', active: false, keyCode: 'e'},
  			{note: 'E4', active: false, keyCode: 'r'},
  			{note: 'G4', active: false, keyCode: 't'},
  			{note: 'C5', active: false, keyCode: 'a'},
  			{note: 'D5', active: false, keyCode: 's'},
  			{note: 'E5', active: false, keyCode: 'd'},
  			{note: 'G5', active: false, keyCode: 'f'},
  			{note: 'A5', active: false, keyCode: 'g'},
  		],
  		rawPart: {
  			start: 0,
  			end: 0,
  			events: []
  		},
  		loop0: [],
      loop1: [],
  		compose: {
  			synth: {},
        echo: {},
        delay: {},
        loop: {}
  		}
  	}
  },
  methods: {
  	startRecording (index) {
  		this.recording = index
  		this.rawPart.start = Date.now() / 1000
  	},
  	endRecording (index) {
  		this.recording = false
  		this.rawPart.end = Date.now() / 1000

  		let newLoop = {
  			events: [],
  		}

  		this.rawPart.events.forEach((event)=>{
  			event.start = event.start - this.rawPart.start

  			delete event.active
  			newLoop.events.push(event)
  		})

      newLoop.index = index
  		newLoop.length = this.rawPart.end - this.rawPart.start
      newLoop.interval = 5
  		newLoop.start = 0

      let constructedLoop = 'loop' + index
  		this[constructedLoop] = newLoop

  		this.rawPart = {
  			start: 0,
  			end: 0,
  			events: []
  		}
  	},
    saveLoop (index) {
      let constructedLoop = 'loop' + index
      this.$emit('saveLoop', this[constructedLoop])
      this[constructedLoop] = []
    },
  	attack (note) {
  		if (this.recording !== false){
	  		let event = {
	  			note: note,
	  			start: Date.now() / 1000,
	  			active: true
	  		}
	  		this.rawPart.events.push(event)  			
  		}

  		this.compose.synth.triggerAttack(note, undefined, 0.75)
  	},
  	release (note) {
  		if (this.recording !== false) {
	  		let event = _.find(this.rawPart.events, {note: note, active: true})
	  		event.duration = Date.now() / 1000 - event.start
	  		event.active = false
  		}

  		this.compose.synth.triggerRelease(note)
  	}
  },
  mounted () {
  	this.compose.synth = new Tone.PolySynth(7, Tone.AMSynth)
    this.compose.echo = new Tone.FeedbackDelay('16n', 0.4)
    this.compose.delay = new Tone.Delay({delayTime: 5, maxDelay: 179})
    this.compose.loop = new Tone.Gain(0.5)
    this.compose.filter = new Tone.Filter()

  	this.compose.synth.connect(this.compose.filter)
    this.compose.filter.connect(this.compose.echo)
    this.compose.echo.fan(Tone.Master, this.compose.delay)
    this.compose.delay.fan(Tone.Master, this.compose.loop)
    this.compose.loop.connect(this.compose.delay)


  	this.triggers.forEach((trigger)=>{
      window.addEventListener('keydown', (e) => {
        if (e.key === trigger.keyCode & !e.repeat) {
          this.attack(trigger.note)
          trigger.active = true
        }
      })

      window.addEventListener('keyup', (e) => {
        if (e.key === trigger.keyCode & !e.repeat) {
        	this.release(trigger.note)
        	trigger.active = false
        }
      })
  	})
  }
}
</script>

<style lang="scss" scoped>
  #triggers {
  	height: 90vh;
  	display: flex;
  	flex-direction: row;
  	flex-wrap: wrap
  }

  .synthTrigger {
  	border: 1px solid black;
  	flex-basis: 20%;

  	display: flex;
  	justify-content: center;
  	align-items: center;

  	-webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
  }

  .active {
  	background-color: red
  }

  #controls {
  	display: flex;
  	height: 10vh;
  	align-items: center;

  	.recordingButton {
  		flex-grow: 2;
  	}

  	button {
  		flex-grow: 1;
  		height: 80%; 

  	}

  	#startButton {
  		background-color: green;
  	}

  	#endButton {
  		background-color: red;
  	}
  }
</style>