<template>
	<main>
		<button @click="mobileStart" v-if="!started"></button>
		<div>
			<button @click="state = 'compose'">Compose</button>
			<button @click="state = 'config'">Config</button>
		</div>
		<div v-if="started">
			<compose v-if="state === 'compose'"></compose>
			<config v-if="state === 'config'"></config>
		</div>
	</main>
</template>

<script>
import compose from '../components/pools/compose.vue'
import config from '../components/pools/config.vue'

function isMobileDevice() {
  return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};
var isMobile = isMobileDevice()
var StartAudioContext = require('startaudiocontext')

export default {
  components: {
  	compose, config
  },
  data () {
    return {
    	started: false,
    	state: 'home',
    }
  },
  methods: {
  	mobileStart () {
  		StartAudioContext(Tone.context).then(() => {
  			this.started = true
  		})
  	}
  },
  mounted () {
  	if(!isMobile) {
  		this.started = true
  	}
  }
}
</script>

<style lang="css" scoped>
</style>