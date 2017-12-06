<template>
	<main>
		<div id="triggers">
			<div v-for="trigger in triggers" class="synthTrigger" :class="{active: trigger.active}" @mousedown="attack(trigger.note); trigger.active = true" @mouseup="release(trigger.note); trigger.active = false">
				<p>{{trigger.note}}</p>
			</div>
		</div>
<!-- 		<div id="controls">
			<button @click="startRecording" v-if="!recording">Start</button>
			<button @click="endRecording" v-else>End</button>
			<button @click="clearLoops">Clear</button>
			<button @click="playLoops" v-if="loops.length > 0">Play</button>
		</div> -->
	</main>
</template>

<script>
var Tone = require('tone')
var _ = require('lodash')

export default {
  name: 'fade',
  data () {
  	return {
  		recording: false,
  		loopPause: 5,
  		triggers: [
  			{note: 'B3', active: false},
  			{note: 'G3', active: false},
  			{note: 'D4', active: false},
  			{note: 'E4', active: false},
  			{note: 'G4', active: false},
  			{note: 'C5', active: false},
  			{note: 'D5', active: false},
  			{note: 'E5', active: false},
  			{note: 'G5', active: false},
  			{note: 'A5', active: false},
  		],
  		rawPart: {
  			start: 0,
  			end: 0,
  			events: []
  		},
  		loops: [
  		// 	{
  		// 		events: [
		  // 			{note: 'C4', duration: 0.5, start: 0.2},
		  // 			{note: 'C5', duration: 1.2, start: 1},
		  // 			{note: 'E4', duration: 0.5, start: 3.2},
				// ],
				// interval: 8200
  		// 	}
  		],
  		compose: {
  			synth: {}
  		},
  		tone: {
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

  		this.compose.synth.triggerAttack(note)
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
  		vue.loops.forEach((loop)=>{
  			function startLoop() {
			  	Tone.Transport.schedule((time) => {
			  		loop.events.forEach((event) => {
			  			vue.tone.synth.triggerAttackRelease(event.note, event.duration, time + event.start)
			  		})

			  		setTimeout(startLoop, loop.interval)
			  	})  				
  			}

  			startLoop()
  		})
  	}
  },
  mounted () {
  	this.compose.synth = new Tone.PolySynth(7, Tone.AMSynth)

  	this.tone.synth = new Tone.PolySynth(7, Tone.AMSynth)
  	this.tone.panner = new Tone.Panner(0)
  	this.tone.echo = new Tone.FeedbackDelay('16n', 0.4)
  	this.tone.delay = new Tone.Delay({delayTime: 5, maxDelay: 179})
  	this.tone.loop = new Tone.Gain(0.5)

  	this.compose.synth.connect(this.tone.panner)
  	this.tone.synth.connect(this.tone.panner)
  	this.tone.panner.connect(this.tone.echo)
  	this.tone.echo.fan(Tone.Master, this.tone.delay)
  	this.tone.delay.fan(Tone.Master, this.tone.loop)
  	this.tone.loop.connect(this.tone.delay)


  	Tone.Transport.start()
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
	flex-basis: 18%;

	display: flex;
	justify-content: center;
	align-items: center;

	p {
		font-size: 100px;
	}
}

.active {
	background-color: red
}

#controls {

}

</style>