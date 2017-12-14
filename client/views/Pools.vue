<template>
	<main>
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
      // showTune: true,
    	systems: [

  {
    'seeds': [
      {
        'note': 'D4',
        'frequency': 293.6647679174076,
        'midi': 62,
        'start': 0.2840001583099365,
        'duration': 1.0339999198913574
      },
      {
        'note': 'B3',
        'frequency': 246.94165062806206,
        'midi': 59,
        'start': 1.3400001525878906,
        'duration': 1.1359999179840088
      },
      {
        'note': 'E4',
        'frequency': 329.6275569128699,
        'midi': 64,
        'start': 2.4650001525878906,
        'duration': 1.2369999885559082
      },
      {
        'note': 'G3',
        'frequency': 195.99771799087463,
        'midi': 55,
        'start': 3.6579999923706055,
        'duration': 1.1019999980926514
      },
      {
        'note': 'G5',
        'frequency': 783.9908719634985,
        'midi': 79,
        'start': 14.920000076293945,
        'duration': 0.39299988746643066
      },
      {
        'note': 'E5',
        'frequency': 659.2551138257398,
        'midi': 76,
        'start': 15.256999969482422,
        'duration': 0.33700013160705566
      },
      {
        'note': 'D5',
        'frequency': 587.3295358348151,
        'midi': 74,
        'start': 15.628000020980835,
        'duration': 0.5510001182556152
      }
    ],
    'systemEvents': [
      {
        'note': 'D4',
        'frequency': 293.6647679174076,
        'midi': 62,
        'start': 0.2840001583099365,
        'duration': 1.0339999198913574
      },
      {
        'note': 'B3',
        'frequency': 246.94165062806206,
        'midi': 59,
        'start': 1.3400001525878906,
        'duration': 1.1359999179840088
      },
      {
        'note': 'E4',
        'frequency': 329.6275569128699,
        'midi': 64,
        'start': 2.4650001525878906,
        'duration': 1.2369999885559082
      },
      {
        'note': 'G3',
        'frequency': 195.99771799087463,
        'midi': 55,
        'start': 3.6579999923706055,
        'duration': 1.1019999980926514
      },
      {
        'note': 'G5',
        'frequency': 783.9908719634985,
        'midi': 79,
        'start': 14.920000076293945,
        'duration': 0.39299988746643066
      },
      {
        'note': 'E5',
        'frequency': 659.2551138257398,
        'midi': 76,
        'start': 15.256999969482422,
        'duration': 0.33700013160705566
      },
      {
        'note': 'D5',
        'frequency': 587.3295358348151,
        'midi': 74,
        'start': 15.628000020980835,
        'duration': 0.5510001182556152
      }
    ],
    'index': 0,
    'systemDuration': 55.205000162124634,
    'interval': 5,
    'start': 4,
    'playbackRate': 1,
    'playbackRange': 0,
    'noteSmudge': 0,
    'durationSmudge': 0,
    'echoCount': 10,
    'echo': 10,
    'loops': null
  },
  {
    'seeds': [
      {
        'note': 'G5',
        'frequency': 783.9908719634985,
        'midi': 79,
        'start': 2.3429999351501465,
        'duration': 0.1119999885559082
      },
      {
        'note': 'E5',
        'frequency': 659.2551138257398,
        'midi': 76,
        'start': 2.375999927520752,
        'duration': 0.1230001449584961
      },
      {
        'note': 'D5',
        'frequency': 587.3295358348151,
        'midi': 74,
        'start': 2.4560000896453857,
        'duration': 0.05499982833862305
      },
      {
        'note': 'E5',
        'frequency': 659.2551138257398,
        'midi': 76,
        'start': 3.490000009536743,
        'duration': 0.1119999885559082
      },
      {
        'note': 'G5',
        'frequency': 783.9908719634985,
        'midi': 79,
        'start': 3.558000087738037,
        'duration': 0.09999990463256836
      },
      {
        'note': 'A5',
        'frequency': 880,
        'midi': 81,
        'start': 3.614000082015991,
        'duration': 0.08899998664855957
      },
      {
        'note': 'C5',
        'frequency': 523.2511306011972,
        'midi': 72,
        'start': 9.553999900817871,
        'duration': 0.0559999942779541
      },
      {
        'note': 'C5',
        'frequency': 523.2511306011972,
        'midi': 72,
        'start': 9.823999881744385,
        'duration': 0.0559999942779541
      },
      {
        'note': 'D5',
        'frequency': 587.3295358348151,
        'midi': 74,
        'start': 10.138999938964844,
        'duration': 0.07800006866455078
      },
      {
        'note': 'D5',
        'frequency': 587.3295358348151,
        'midi': 74,
        'start': 19.611999988555908,
        'duration': 0.12299990653991699
      },
      {
        'note': 'D4',
        'frequency': 293.6647679174076,
        'midi': 62,
        'start': 19.723999977111816,
        'duration': 0.23600006103515625
      },
      {
        'note': 'D5',
        'frequency': 587.3295358348151,
        'midi': 74,
        'start': 19.97099995613098,
        'duration': 0.22499990463256836
      }
    ],
    'systemEvents': [
      {
        'note': 'G5',
        'frequency': 783.9908719634985,
        'midi': 79,
        'start': 2.3429999351501465,
        'duration': 0.1119999885559082
      },
      {
        'note': 'E5',
        'frequency': 659.2551138257398,
        'midi': 76,
        'start': 2.375999927520752,
        'duration': 0.1230001449584961
      },
      {
        'note': 'D5',
        'frequency': 587.3295358348151,
        'midi': 74,
        'start': 2.4560000896453857,
        'duration': 0.05499982833862305
      },
      {
        'note': 'E5',
        'frequency': 659.2551138257398,
        'midi': 76,
        'start': 3.490000009536743,
        'duration': 0.1119999885559082
      },
      {
        'note': 'G5',
        'frequency': 783.9908719634985,
        'midi': 79,
        'start': 3.558000087738037,
        'duration': 0.09999990463256836
      },
      {
        'note': 'A5',
        'frequency': 880,
        'midi': 81,
        'start': 3.614000082015991,
        'duration': 0.08899998664855957
      },
      {
        'note': 'C5',
        'frequency': 523.2511306011972,
        'midi': 72,
        'start': 9.553999900817871,
        'duration': 0.0559999942779541
      },
      {
        'note': 'C5',
        'frequency': 523.2511306011972,
        'midi': 72,
        'start': 9.823999881744385,
        'duration': 0.0559999942779541
      },
      {
        'note': 'D5',
        'frequency': 587.3295358348151,
        'midi': 74,
        'start': 10.138999938964844,
        'duration': 0.07800006866455078
      },
      {
        'note': 'D5',
        'frequency': 587.3295358348151,
        'midi': 74,
        'start': 19.611999988555908,
        'duration': 0.12299990653991699
      },
      {
        'note': 'D4',
        'frequency': 293.6647679174076,
        'midi': 62,
        'start': 19.723999977111816,
        'duration': 0.23600006103515625
      },
      {
        'note': 'D5',
        'frequency': 587.3295358348151,
        'midi': 74,
        'start': 19.97099995613098,
        'duration': 0.22499990463256836
      }
    ],
    'index': 1,
    'systemDuration': 51.03099989891052,
    'interval': 5,
    'start': 0,
    'playbackRate': 1,
    'playbackRange': 0,
    'noteSmudge': 0,
    'durationSmudge': 0,
    'echoCount': 10,
    'echo': 10,
    'loops': null
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
