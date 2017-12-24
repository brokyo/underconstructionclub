<template>
  <main>
    <trigger v-for="triggerConfig in triggers" :config="triggerConfig" :synth="tone.synth"></trigger>
  </main>
</template>

<script>
import trigger from '../components/fla17/trigger.vue'

var Tone = require('Tone')
var _ = require('lodash')
export default {
  components: {trigger},
  data () {
    return {
      tone: {
        synth: {},
        gain: {}
      },
      triggers: [
        {
          keyCode: 'q',
          frequency: '440',
        },
        {
          keyCode: 'w',
          frequency: '220'
        },
        {
          keyCode: 'e',
          frequency: '110'
        },
        {
          keyCode: 'r',
          frequency: '55'
        }
      ]
    }
  },
  methods: {
    constructTone () {
      this.tone.synth = new Tone.PolySynth(5, Tone.AMSynth)
      this.tone.gain = new Tone.Gain()

      this.tone.synth.chain(this.tone.gain, Tone.Master)
    }
  },
  mounted () {
    this.constructTone()
  }
}
</script>

<style lang="css" scoped>
</style>
