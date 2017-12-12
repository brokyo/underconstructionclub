<template>
	<main>
		<button id="mobileStart" @click="mobileStart" v-if="!started">iOS Start</button>
		<div v-if="started">
			<div>
				<button @click="state = 'compose'">Compose</button>
				<button @click="state = 'config'">Config</button>
				<button @click="state = 'play'">Play</button>
			</div>
			<compose v-if="state === 'compose'" v-on:saveLoop="saveLoop"></compose>
			<config v-if="state === 'config'" :loops="loops"></config>
			<play v-if="state === 'play'" :loops="loops"></play>
      <!-- <tune v-show="showTune" @updatePatch="updatePatch"></tune> -->
		</div>
	</main>
</template>

<script>
var Tone = require('tone')
var _ = require('lodash')
var StartAudioContext = require('startaudiocontext')

import compose from '../components/pools/compose.vue'
import config from '../components/pools/config.vue'
import play from '../components/pools/play.vue'
import tune from '../components/pools/tune.vue'

export default {
  components: {
  	compose, config, play, tune
  },
  data () {
    return {
    	started: false,
    	state: 'compose',
      showTune: true,
    	loops: [
    		{
    			events: [
    				{start: 0, duration: 1, midi: 79, note: 'G5',},
    				{start: 1, duration: 1, midi: 80, note: 'A5',},
    				{start: 2, duration: 2, midi: 82, note: 'C5',},
            {start: 20, duration: 1, midi: 79, note: 'G5',},
            {start: 21, duration: 1, midi: 80, note: 'A5',},
            {start: 22, duration: 2, midi: 82, note: 'C5',}
    			],
    			index: 0,
    			interval: 5,
    			length: 30,
    			maxShift: 0,
    			playbackRate: 1,
    			start: 0
    		},
    		{
    			events: [
    				{start: 10, duration: 5, midi: 87, note: 'G5',},
    				{start: 22, duration: 11, midi: 72, note: 'A5',},
    				{start: 34, duration: 2, midi: 91, note: 'C5',}
    			],
    			index: 1,
    			interval: 5,
    			length: 45,
    			maxShift: 0,
    			playbackRate: 1,
    			start: 0
    		}

    	],
    	line0: {
    		synth: {},
    		panner: {},
    		filter: {},
    		echo: {},
    		delay: {},
    		loop: {},
    	},
    	line1: {
    		synth: {},
    		panner: {},
    		filter: {},
    		echo: {},
    		delay: {},
    		loop: {},
    	},
      global: {
        EQ3: {},
        compressor: {},
        distortion: {},
        out: {}
      }
    }
  },
  computed: {
  	isMobile () {
  		return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
  	}
  },
  methods: {
  	mobileStart () {
  		StartAudioContext(Tone.context).then(() => {
  			this.started = true
  			this.constructTone()
  		})
  	},
  	constructTone () {
      // Global
      this.global.EQ3 = new Tone.EQ3({low: 0, medium: 0, high: 0, lowFrequency: 400, highFrequency: 2500})
      this.global.compressor = new Tone.Compressor()
      this.global.distortion = new Tone.Distortion()
      this.global.out = new Tone.Gain().toMaster()

      this.global.EQ3.connect(this.global.compressor)
      this.global.compressor.connect(this.global.distortion)
      this.global.distortion.connect(this.global.out)

	  	// Line 0
	  	this.line0.synth = new Tone.PolySynth(5, Tone.AMSynth)
	  	this.line0.panner = new Tone.Panner(0)
	  	this.line0.filter = new Tone.Filter()
	    this.line0.echo = new Tone.FeedbackDelay('8n', 0.4)
	  	this.line0.delay = new Tone.Delay({delayTime: 5, maxDelay: 179})
	  	this.line0.loop = new Tone.Gain(0.5)

	  	this.line0.synth.connect(this.line0.panner)
	  	this.line0.panner.connect(this.line0.filter)
	  	this.line0.filter.connect(this.line0.echo)
	  	this.line0.echo.fan(this.global.EQ3, this.line0.delay)
	  	this.line0.delay.fan(this.global.EQ3, this.line0.loop)
	  	this.line0.loop.connect(this.line0.delay)



	  	// Line 1
	  	this.line1.synth = new Tone.PolySynth(5, Tone.AMSynth)
	  	this.line1.panner = new Tone.Panner(0.5)
	  	this.line1.filter = new Tone.Filter()
	    this.line1.echo = new Tone.FeedbackDelay('8n', 0.4)
	  	this.line1.delay = new Tone.Delay({delayTime: 5, maxDelay: 179})
	  	this.line1.loop = new Tone.Gain(0.5)

	  	this.line1.synth.connect(this.line1.panner)
	  	this.line1.panner.connect(this.line1.filter)
	  	this.line1.filter.connect(this.line1.echo)
	  	this.line1.echo.fan(this.global.EQ3, this.line1.delay)
	  	this.line1.delay.fan(this.global.EQ3, this.line1.loop)
	  	this.line1.loop.connect(this.line1.delay)

  	},
  	saveLoop (exportedLoop) {
  		this.loops[exportedLoop.index] = exportedLoop
  	},
    updatePatch (update) {
      this.global[update.toneName].set(update.newValue)
    }
  },
  mounted () {
  	if(this.isMobile){
  		this.started = false
  	} else {
  		this.started = true
  		this.constructTone()
  	}
  }
}
</script>

<style lang="scss" scoped>
	#mobileStart {
		width: 100%;
		font-size: 32px;
	}
</style>
