<template>
	<main>
		<div id="triggers">
			<button v-for="trigger in triggers" class="synthTrigger" :class="{active: trigger.active}" @mousedown="attack(trigger.note); trigger.active = true" @mouseup="release(trigger.note); trigger.active = false" v-on:touchstart="attack(trigger.note); trigger.active = true" v-on:touchend="release(trigger.note); trigger.active = false">
				{{trigger.note}}
			</button>
		</div>
		<div id="controls">
			<button @click="startRecording" v-if="!recording" :disabled="loops.length === 2" class="recordingButton" id="startButton">Record</button>
			<button @click="endRecording" v-else class="recordingButton" id="endButton">End</button>
			<button @click="clearLoops" :disabled="loops.length === 0">Clear</button>
			<button @click="playLoops" v-if="playing === false">Play</button>
			<button @click="stopLoops" v-else>Stop</button>
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
  		playing: false,
  		loopPause: 5,
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
  		loops: [
  		
  		],
  		compose: {
  			synth: {}
  		},
		line0: {
			synth: {},
			panner: {},
			echo: {},
			delay: {},
			loop: {}			  				
		},
		line1: {
			synth: {},
			panner: {},
			echo: {},
			delay: {},
			loop: {}			  				
		}
  	}
  },
  methods: {
  	startRecording () {
  		this.recording = true
  		this.rawPart.start = Date.now() / 1000
  	},
  	endRecording () {
  		this.recording = false
  		this.rawPart.end = Date.now() / 1000

		let newLoop = {
			events: [],
			interval: 0
		}

  		this.rawPart.events.forEach((event)=>{
  			event.start = event.start - this.rawPart.start

  			delete event.active
  			newLoop.events.push(event)
  		})

  		newLoop.interval = (this.rawPart.end - this.rawPart.start + this.loopPause) * 1000
  		newLoop.start = 0
  		this.loops.push(newLoop)

  		this.rawPart = {
  			start: 0,
  			end: 0,
  			events: []
  		}
  	},
  	clearLoops () {
  		this.loops = []
  	},
  	attack (note) {
  		if (this.recording){
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
  		if (this.recording) {
	  		let event = _.find(this.rawPart.events, {note: note, active: true})
	  		event.duration = Date.now() / 1000 - event.start
	  		event.active = false
  		}

  		this.compose.synth.triggerRelease(note)
  	},
  	playLoops () {
  		var vue = this
  		vue.loops.forEach((loop, index)=>{
  			function startLoop() {
			  	Tone.Transport.schedule((time) => {
			  		loop.events.forEach((event) => {
			  			let line = 'line' + index
			  			vue[line].synth.triggerAttackRelease(event.note, event.duration, time + event.start, 0.75)
			  		})

			  		setTimeout(startLoop, loop.interval)
			  	}, loop.start)  				
  			}

  			startLoop()
  		})

	  	Tone.Transport.start()
  		vue.playing = true
  	},
  	stopLoops () {
  		Tone.Transport.stop()
  		this.playing = false
  	}
  },
  mounted () {
  	// Line 0
  	this.line0.synth = new Tone.PolySynth(7, Tone.AMSynth)
  	this.line0.panner = new Tone.Panner(-0.5)
    this.line0.echo = new Tone.FeedbackDelay('16n', 0.4)
  	this.line0.delay = new Tone.Delay({delayTime: 5, maxDelay: 179})
  	this.line0.loop = new Tone.Gain(0.5)

  	this.line0.synth.connect(this.line0.panner)
  	this.line0.panner.connect(this.line0.echo)
  	this.line0.echo.fan(Tone.Master, this.line0.delay)
  	this.line0.delay.fan(Tone.Master, this.line0.loop)
  	this.line0.loop.connect(this.line0.delay)


  	// Line 1
  	this.line1.synth = new Tone.PolySynth(7, Tone.AMSynth)
  	this.line1.panner = new Tone.Panner(-0.5)
	this.line1.echo = new Tone.FeedbackDelay('16n', 0.4)
  	this.line1.delay = new Tone.Delay({delayTime: 5, maxDelay: 179})
  	this.line1.loop = new Tone.Gain(0.5)

  	this.line1.synth.connect(this.line1.panner)
  	this.line1.panner.connect(this.line1.echo)
  	this.line1.echo.fan(Tone.Master, this.line1.delay)
  	this.line1.delay.fan(Tone.Master, this.line1.loop)
  	this.line1.loop.connect(this.line1.delay)

  	// Composition
  	this.compose.synth = new Tone.PolySynth(7, Tone.AMSynth)
  	this.compose.synth.connect(this.line0.panner)


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