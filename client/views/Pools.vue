<template>
	<main>
		<div>
			<span>X</span>
			<p>
				Click "record" button and play a short melody with QWERT/ASDFG. When you like it click save. Record two then go to "config'"
			</p>
		</div>
		<button id="mobileStart" @click="mobileStart" v-if="!started">iOS Start</button>
		<div v-if="started">
			<div>
				<button @click="state = 'compose'">Compose</button>
				<button @click="state = 'config'">Config</button>
				<button @click="state = 'play'">Play</button>
			</div>
			<compose v-if="state === 'compose'" v-on:exportSystem="saveSystem"></compose>
			<config v-if="state === 'config'" :systems="systems"></config>
			<play v-if="state === 'play'" :systems="systems"></play>
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
// import tune from '../components/pools/tune.vue'

export default {
  components: {
  	compose, config, play
  },
  data () {
    return {
    	started: false,
    	state: 'compose',
			hideTip: false,
      // showTune: true,
    	systems: [
 {
    "seeds": [
      {
        "note": "C5",
        "frequency": 523.2511306011972,
        "midi": 72,
        "start": 0.5089998245239258,
        "duration": 1.1349999904632568
      },
      {
        "note": "D5",
        "frequency": 587.3295358348151,
        "midi": 74,
        "start": 1.5879998207092285,
        "duration": 1.248000144958496
      },
      {
        "note": "G5",
        "frequency": 783.9908719634985,
        "midi": 79,
        "start": 2.81499981880188,
        "duration": 0.9890000820159912
      },
      {
        "note": "E5",
        "frequency": 659.2551138257398,
        "midi": 76,
        "start": 3.7819998264312744,
        "duration": 0.9560000896453857
      },
      {
        "note": "G4",
        "frequency": 391.99543598174927,
        "midi": 67,
        "start": 20.150999784469604,
        "duration": 1.4280002117156982
      },
      {
        "note": "D4",
        "frequency": 293.6647679174076,
        "midi": 62,
        "start": 21.590999841690063,
        "duration": 1.687000036239624
      },
      {
        "note": "E4",
        "frequency": 329.6275569128699,
        "midi": 64,
        "start": 24.38099980354309,
        "duration": 1.5970001220703125
      },
      {
        "note": "G3",
        "frequency": 195.99771799087463,
        "midi": 55,
        "start": 25.988999843597412,
        "duration": 1.1590001583099365
      }
    ],
    "systemEvents": [],
    "index": 0,
    "systemDuration": 71.87599992752075,
    "interval": 5,
    "start": 0,
    "playbackRate": 0.9,
    "playbackRange": 0,
    "noteSmudge": 0,
    "durationSmudge": 0,
    "echoCount": 10
  },
  {
    "seeds": [
      {
        "note": "B3",
        "frequency": 246.94165062806206,
        "midi": 59,
        "start": 1.0269999504089355,
        "duration": 1.6410000324249268
      },
      {
        "note": "D4",
        "frequency": 293.6647679174076,
        "midi": 62,
        "start": 12.02999997138977,
        "duration": 0.877000093460083
      },
      {
        "note": "G4",
        "frequency": 391.99543598174927,
        "midi": 67,
        "start": 12.930000066757202,
        "duration": 1.0449998378753662
      },
      {
        "note": "E4",
        "frequency": 329.6275569128699,
        "midi": 64,
        "start": 13.986999988555908,
        "duration": 0.9219999313354492
      },
      {
        "note": "G4",
        "frequency": 391.99543598174927,
        "midi": 67,
        "start": 14.90999984741211,
        "duration": 1.2930002212524414
      }
    ],
    "systemEvents": [],
    "index": 1,
    "systemDuration": 62.07800006866455,
    "interval": 5,
    "start": 3,
    "playbackRate": 0.6,
    "playbackRange": 0,
    "noteSmudge": 0,
    "durationSmudge": 0,
    "echoCount": 10
  }
			]
			,
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
      // this.global.compressor = new Tone.Compressor()
      // this.global.distortion = new Tone.Distortion()
      this.global.out = new Tone.Gain().toMaster()

      this.global.EQ3.connect(this.global.out)
      // this.global.compressor.connect(this.global.distortion)
      // this.global.distortion.connect(this.global.out)

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
  	saveSystem (exortedRecording) {
  		this.systems[exortedRecording.index] = exortedRecording
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
