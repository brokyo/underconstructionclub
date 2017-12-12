<template>
	<main>
		<div>
			<label>EQ</label>
			<label>H</label>
			<input type="range" min="-20" max="40" v-model="EQ.high"></input>
			<label>M</label>
			<input type="range" min="-20" max="20" v-model="EQ.mid"></input>
			<label>L</label>
			<input type="range" min="-20" max="20" v-model="EQ.low"></input>
		</div>
		<!-- Probably not interesting -->
<!-- 		<div>
			<label>Compressor</label>
			<label>Threshold</label>		
			<input type="range" min="-100" max="0" v-model="compressor.threshold"></input>
			<label>Ratio</label>
			<input type="range" min="1" max="20" v-model="compressor.ratio"></input>
		</div> -->
		<div>
			<label>Distortion</label>
			<input type="range" min="0" max="1" step="0.1" v-model="distortion.distortion"></input>
		</div>
	</main>
</template>

<script>
export default {
  name: 'tune',
  data () {
    return { 
    	EQ: {
    		low: 0,
    		mid: 0,
    		high: 0
    	},
    	compressor: {
    		ratio: -12,
    		threshold: -24,
    		release: 0.25,
    		attack: 0.003,
    		knee: 30
    	},
    	chorus: {
    		frequency: 1.5,
    		delayTime: 3.5,
    		depth: 0.7,
    		feedback: 0.1,
    		type: 'sine',
    		spread: 180
    	},
    	distortion: {
    		distortion: 0.4,
    		oversample: 'none'
    	},
    	freeverb: {
    		roomSize: 0.7,
    		dampening: 3000
    	},
    	tremolo: {
    		frequency: 10,
    		type: 'sine',
    		depth: 0.5,
    		spread: 180
    	},
    	vibrato: {
    		maxDelay: 0.005,
    		frequency: 5,
    		depth: 0.1,
    		type: 'sine'
    	},
    	foo: 1
    }
  },
  watch: {
  	EQ: {
  		handler: function (value) {
	  		this.$emit('updatePatch', {toneName: 'EQ3', newValue: value})
  		},
	  	deep: true
  	},
  	compressor: {
  		handler: function (value) {
  			this.$emit('updatePatch', {toneName: 'compressor', newValue: value})
  		},
  		deep: true
  	},
  	distortion: {
  		handler: function (value) {
  			this.$emit('distortion', {toneName: 'distortion', newValue: value})
  		},
  		deep: true
  	}
  },
  methods: {

  },
  mounted () {

  }
}
</script>

<style lang="css" scoped>
</style>