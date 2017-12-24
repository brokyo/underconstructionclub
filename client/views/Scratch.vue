<template>
  <main>
    <p>{{activeImage}}</p>
    <h1>hi</h1>
    <button @click="north" v-if="activeDirection === 'south'">North</button>
    <button @click="south" v-else>south</button>
  </main>
</template>

<script>
import Pool from '../../static/js/pools.js'

var Tone = require('tone')
export default {
  data () {
    return {
      activeDirection: 'north',
      line: {},
      patchConfig: [
        {prop: 'synth', toneName: 'AMSynth', config: {}, connectType: 'connect', connectNode: ['filter']},
        {prop: 'filter', toneName: 'Filter', config: {}, connectType: 'connect', connectNode: ['out']},
        {prop: 'out', toneName: 'Gain', config: {}, connectType: 'connect', connectNode: ['Tone.Master']}
      ],
      playConfig: {
        seeds: [
              {
                "note": "B3",
                "frequency": 246.94165062806206,
                "midi": 59,
                "start": 0.6420001983642578,
                "duration": 1.3619999885559082
              },
              {
                "note": "D4",
                "frequency": 293.6647679174076,
                "midi": 62,
                "start": 1.9580001831054688,
                "duration": 1.5089998245239258
              },
              {
                "note": "E4",
                "frequency": 329.6275569128699,
                "midi": 64,
                "start": 3.443000078201294,
                "duration": 1.428999900817871
              }
            ],

        "active": {
          "loops": 0,
          "playbackRate": 1,
          "noteSmudge": 1,
          "durationSmudge": 1,
          "duration": 4
        },
        "timing": {
          "duration": 4,
          "start": 0,
          "interval": 0
        },
        "directionConfig": {
          north: {
            "playback": {
              "base": 0.9,
              "range": 0.1,
              "interval": 0
            },
            "note": {
              "base": 1,
              "range": 0,
              "interval": 0
            },
            "duration": {
              "base": 1,
              "range": 0.15,
              "interval": 2
            },
            "patch": {
              "echo": 10
            }
          },
          south: {

          }
        }
      },
      meta: {
        name: 'waves'
      }
    }
  },
  computed: {
    activeImage () {
      switch (this.activeDirection) {
        case 'north':
          return 'canada'
          break
        case 'south':
          return 'mexico'
          break
      }
    }
  },
  methods: {
    north () {
      this.activeDirection = 'north'
      this.line.changeDirection('north')
    },
    south () {
      this.activeDirection = 'south'
      this.line.changeDirection('south')
    }
  },
  mounted () {
    this.line = new Pool(this.patchConfig, this.playConfig, this.meta)
    // this.line.start(0)
    Tone.Transport.start()
  }
}
</script>

<style lang="scss" scoped>


</style>
