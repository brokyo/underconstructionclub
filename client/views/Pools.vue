<template>
  <main>
    <div id="tooltip" v-if="showTooltip">
      <p v-if="state === 'compose'">
        Click "record" button and play a short melody with QWERT/ASDFG. When you like it click the save button. Record in each slot then go to 'config'.
        Simpler is better. [sound records as heard so let the echo finish]
      </p>
      <p v-if="state === 'compose'">
        You can also just click on the 'play' tab. There's one already in there.
      </p>
      <p v-if="state === 'config'">
        Set playback paremeters. You can just leave this alone but use decimal percentage points to make the system evolve over time. This will be clearer eventually.
      </p>
      <p v-if="state === 'play'">
        Two loops that build on each other and evolve. Click play to listen (indefinitely. This makes ∞ music) or go to other tabs to make your own. This will get a lot more usable soon.
      </p>
      <span @click="showTooltip = false">X</span>
    </div>
    <div id="banner" v-else>
      <a href="http://www.under-construction.club">Under Construction Club</a>
      <span @click="showTooltip = true">+</span>
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
      showTooltip: true,
      // showTune: true,
      systems: [
          {
            "index": 0,
            "seeds": [
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
              },
              {
                "note": "G4",
                "frequency": 391.99543598174927,
                "midi": 67,
                "start": 4.861000061035156,
                "duration": 1.687000036239624
              },
              {
                "note": "G3",
                "frequency": 195.99771799087463,
                "midi": 55,
                "start": 6.526000022888184,
                "duration": 1.755000114440918
              },
              {
                "note": "E4",
                "frequency": 329.6275569128699,
                "midi": 64,
                "start": 11.27400016784668,
                "duration": 2.3959999084472656
              },
              {
                "note": "D4",
                "frequency": 293.6647679174076,
                "midi": 62,
                "start": 13.647000074386597,
                "duration": 2.0139999389648438
              },
              {
                "note": "G3",
                "frequency": 195.99771799087463,
                "midi": 55,
                "start": 15.77400016784668,
                "duration": 2.4069998264312744
              },
              {
                "note": "B3",
                "frequency": 246.94165062806206,
                "midi": 59,
                "start": 25.49500012397766,
                "duration": 3.318000078201294
              },
              {
                "note": "G4",
                "frequency": 391.99543598174927,
                "midi": 67,
                "start": 28.836000204086304,
                "duration": 3.4759998321533203
              },
              {
                "note": "G3",
                "frequency": 195.99771799087463,
                "midi": 55,
                "start": 41.16799998283386,
                "duration": 2.202000141143799
              },
              {
                "note": "E4",
                "frequency": 329.6275569128699,
                "midi": 64,
                "start": 43.38199996948242,
                "duration": 2.4740002155303955
              },
              {
                "note": "D4",
                "frequency": 293.6647679174076,
                "midi": 62,
                "start": 52.82100009918213,
                "duration": 2.496999979019165
              },
              {
                "note": "B3",
                "frequency": 246.94165062806206,
                "midi": 59,
                "start": 55.307000160217285,
                "duration": 2.6439998149871826
              },
              {
                "note": "G4",
                "frequency": 391.99543598174927,
                "midi": 67,
                "start": 66.04200005531311,
                "duration": 2.753000020980835
              },
              {
                "note": "E4",
                "frequency": 329.6275569128699,
                "midi": 64,
                "start": 68.77300000190735,
                "duration": 2.239000082015991
              },
              {
                "note": "D4",
                "frequency": 293.6647679174076,
                "midi": 62,
                "start": 83.7590000629425,
                "duration": 2.2939999103546143
              },
              {
                "note": "E4",
                "frequency": 329.6275569128699,
                "midi": 64,
                "start": 86.07599997520447,
                "duration": 3.1730000972747803
              },
              {
                "note": "G3",
                "frequency": 195.99771799087463,
                "midi": 55,
                "start": 96.51800012588501,
                "duration": 1.6979999542236328
              },
              {
                "note": "B3",
                "frequency": 246.94165062806206,
                "midi": 59,
                "start": 98.21500015258789,
                "duration": 1.6759998798370361
              },
              {
                "note": "G4",
                "frequency": 391.99543598174927,
                "midi": 67,
                "start": 108.79100012779236,
                "duration": 1.7990000247955322
              },
              {
                "note": "D4",
                "frequency": 293.6647679174076,
                "midi": 62,
                "start": 110.24100017547607,
                "duration": 1.8349997997283936
              },
              {
                "note": "B3",
                "frequency": 246.94165062806206,
                "midi": 59,
                "start": 112.04299998283386,
                "duration": 1.8430001735687256
              },
              {
                "note": "G3",
                "frequency": 195.99771799087463,
                "midi": 55,
                "start": 113.875,
                "duration": 1.9230000972747803
              },
              {
                "note": "E4",
                "frequency": 329.6275569128699,
                "midi": 64,
                "start": 115.76600003242493,
                "duration": 1.753999948501587
              },
              {
                "note": "B3",
                "frequency": 246.94165062806206,
                "midi": 59,
                "start": 133.81100010871887,
                "duration": 4.927000045776367
              },
              {
                "note": "D4",
                "frequency": 293.6647679174076,
                "midi": 62,
                "start": 135.55400013923645,
                "duration": 4.61299991607666
              },
              {
                "note": "E4",
                "frequency": 329.6275569128699,
                "midi": 64,
                "start": 137.08500003814697,
                "duration": 4.8480000495910645
              },
              {
                "note": "G3",
                "frequency": 195.99771799087463,
                "midi": 55,
                "start": 141.89900016784668,
                "duration": 1.6649999618530273
              },
              {
                "note": "G3",
                "frequency": 195.99771799087463,
                "midi": 55,
                "start": 144.91600012779236,
                "duration": 1.2369999885559082
              },
              {
                "note": "E4",
                "frequency": 329.6275569128699,
                "midi": 64,
                "start": 146.87199997901917,
                "duration": 2.013000011444092
              },
              {
                "note": "D4",
                "frequency": 293.6647679174076,
                "midi": 62,
                "start": 147.98600006103516,
                "duration": 1.2929999828338623
              },
              {
                "note": "E4",
                "frequency": 329.6275569128699,
                "midi": 64,
                "start": 149.0090000629425,
                "duration": 0.247999906539917
              },
              {
                "note": "D4",
                "frequency": 293.6647679174076,
                "midi": 62,
                "start": 150.16799998283386,
                "duration": 1.8570001125335693
              },
              {
                "note": "E4",
                "frequency": 329.6275569128699,
                "midi": 64,
                "start": 150.30299997329712,
                "duration": 1.7370002269744873
              },
              {
                "note": "D4",
                "frequency": 293.6647679174076,
                "midi": 62,
                "start": 153.3420000076294,
                "duration": 2.4739999771118164
              },
              {
                "note": "E4",
                "frequency": 329.6275569128699,
                "midi": 64,
                "start": 153.35400009155273,
                "duration": 2.4619998931884766
              },
              {
                "note": "G3",
                "frequency": 195.99771799087463,
                "midi": 55,
                "start": 159.81200003623962,
                "duration": 0.6380000114440918
              },
              {
                "note": "B3",
                "frequency": 246.94165062806206,
                "midi": 59,
                "start": 160.66600012779236,
                "duration": 0.6399998664855957
              },
              {
                "note": "B3",
                "frequency": 246.94165062806206,
                "midi": 59,
                "start": 162.2170000076294,
                "duration": 3.802000045776367
              },
              {
                "note": "B3",
                "frequency": 246.94165062806206,
                "midi": 59,
                "start": 167.8420000076294,
                "duration": 2.318000078201294
              },
              {
                "note": "B3",
                "frequency": 246.94165062806206,
                "midi": 59,
                "start": 172.55700016021729,
                "duration": 2.192999839782715
              },
              {
                "note": "B3",
                "frequency": 246.94165062806206,
                "midi": 59,
                "start": 177.4300000667572,
                "duration": 1.5269999504089355
              },
              {
                "note": "G4",
                "frequency": 391.99543598174927,
                "midi": 67,
                "start": 203.2039999961853,
                "duration": 2.134999990463257
              },
              {
                "note": "G4",
                "frequency": 391.99543598174927,
                "midi": 67,
                "start": 207.67900013923645,
                "duration": 2.316999912261963
              },
              {
                "note": "G4",
                "frequency": 391.99543598174927,
                "midi": 67,
                "start": 212.66300010681152,
                "duration": 2.700000047683716
              }
            ],
            "baseEvents": [],
            "active": {
              "loops": 4,
              "playbackRate": 1,
              "noteSmudge": 1,
              "durationSmudge": 1,
              "duration": 250.8788890308804
            },
            "params": {
              "timing": {
                "duration": 225.79100012779236,
                "start": 0,
                "interval": 0
              },
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
            "nextEventsBase": [
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
              },
              {
                "note": "G4",
                "frequency": 391.99543598174927,
                "midi": 67,
                "start": 4.861000061035156,
                "duration": 1.687000036239624
              },
              {
                "note": "G3",
                "frequency": 195.99771799087463,
                "midi": 55,
                "start": 6.526000022888184,
                "duration": 1.755000114440918
              },
              {
                "note": "E4",
                "frequency": 329.6275569128699,
                "midi": 64,
                "start": 11.27400016784668,
                "duration": 2.3959999084472656
              },
              {
                "note": "D4",
                "frequency": 293.6647679174076,
                "midi": 62,
                "start": 13.647000074386597,
                "duration": 2.0139999389648438
              },
              {
                "note": "G3",
                "frequency": 195.99771799087463,
                "midi": 55,
                "start": 15.77400016784668,
                "duration": 2.4069998264312744
              },
              {
                "note": "B3",
                "frequency": 246.94165062806206,
                "midi": 59,
                "start": 25.49500012397766,
                "duration": 3.318000078201294
              },
              {
                "note": "G4",
                "frequency": 391.99543598174927,
                "midi": 67,
                "start": 28.836000204086304,
                "duration": 3.4759998321533203
              },
              {
                "note": "G3",
                "frequency": 195.99771799087463,
                "midi": 55,
                "start": 41.16799998283386,
                "duration": 2.202000141143799
              },
              {
                "note": "E4",
                "frequency": 329.6275569128699,
                "midi": 64,
                "start": 43.38199996948242,
                "duration": 2.4740002155303955
              },
              {
                "note": "D4",
                "frequency": 293.6647679174076,
                "midi": 62,
                "start": 52.82100009918213,
                "duration": 2.496999979019165
              },
              {
                "note": "B3",
                "frequency": 246.94165062806206,
                "midi": 59,
                "start": 55.307000160217285,
                "duration": 2.6439998149871826
              },
              {
                "note": "G4",
                "frequency": 391.99543598174927,
                "midi": 67,
                "start": 66.04200005531311,
                "duration": 2.753000020980835
              },
              {
                "note": "E4",
                "frequency": 329.6275569128699,
                "midi": 64,
                "start": 68.77300000190735,
                "duration": 2.239000082015991
              },
              {
                "note": "D4",
                "frequency": 293.6647679174076,
                "midi": 62,
                "start": 83.7590000629425,
                "duration": 2.2939999103546143
              },
              {
                "note": "E4",
                "frequency": 329.6275569128699,
                "midi": 64,
                "start": 86.07599997520447,
                "duration": 3.1730000972747803
              },
              {
                "note": "G3",
                "frequency": 195.99771799087463,
                "midi": 55,
                "start": 96.51800012588501,
                "duration": 1.6979999542236328
              },
              {
                "note": "B3",
                "frequency": 246.94165062806206,
                "midi": 59,
                "start": 98.21500015258789,
                "duration": 1.6759998798370361
              },
              {
                "note": "G4",
                "frequency": 391.99543598174927,
                "midi": 67,
                "start": 108.79100012779236,
                "duration": 1.7990000247955322
              },
              {
                "note": "D4",
                "frequency": 293.6647679174076,
                "midi": 62,
                "start": 110.24100017547607,
                "duration": 1.8349997997283936
              },
              {
                "note": "B3",
                "frequency": 246.94165062806206,
                "midi": 59,
                "start": 112.04299998283386,
                "duration": 1.8430001735687256
              },
              {
                "note": "G3",
                "frequency": 195.99771799087463,
                "midi": 55,
                "start": 113.875,
                "duration": 1.9230000972747803
              },
              {
                "note": "E4",
                "frequency": 329.6275569128699,
                "midi": 64,
                "start": 115.76600003242493,
                "duration": 1.753999948501587
              },
              {
                "note": "B3",
                "frequency": 246.94165062806206,
                "midi": 59,
                "start": 133.81100010871887,
                "duration": 4.927000045776367
              },
              {
                "note": "D4",
                "frequency": 293.6647679174076,
                "midi": 62,
                "start": 135.55400013923645,
                "duration": 4.61299991607666
              },
              {
                "note": "E4",
                "frequency": 329.6275569128699,
                "midi": 64,
                "start": 137.08500003814697,
                "duration": 4.8480000495910645
              },
              {
                "note": "G3",
                "frequency": 195.99771799087463,
                "midi": 55,
                "start": 141.89900016784668,
                "duration": 1.6649999618530273
              },
              {
                "note": "G3",
                "frequency": 195.99771799087463,
                "midi": 55,
                "start": 144.91600012779236,
                "duration": 1.2369999885559082
              },
              {
                "note": "E4",
                "frequency": 329.6275569128699,
                "midi": 64,
                "start": 146.87199997901917,
                "duration": 2.013000011444092
              },
              {
                "note": "D4",
                "frequency": 293.6647679174076,
                "midi": 62,
                "start": 147.98600006103516,
                "duration": 1.2929999828338623
              },
              {
                "note": "E4",
                "frequency": 329.6275569128699,
                "midi": 64,
                "start": 149.0090000629425,
                "duration": 0.247999906539917
              },
              {
                "note": "D4",
                "frequency": 293.6647679174076,
                "midi": 62,
                "start": 150.16799998283386,
                "duration": 1.8570001125335693
              },
              {
                "note": "E4",
                "frequency": 329.6275569128699,
                "midi": 64,
                "start": 150.30299997329712,
                "duration": 1.7370002269744873
              },
              {
                "note": "D4",
                "frequency": 293.6647679174076,
                "midi": 62,
                "start": 153.3420000076294,
                "duration": 2.4739999771118164
              },
              {
                "note": "E4",
                "frequency": 329.6275569128699,
                "midi": 64,
                "start": 153.35400009155273,
                "duration": 2.4619998931884766
              },
              {
                "note": "G3",
                "frequency": 195.99771799087463,
                "midi": 55,
                "start": 159.81200003623962,
                "duration": 0.6380000114440918
              },
              {
                "note": "B3",
                "frequency": 246.94165062806206,
                "midi": 59,
                "start": 160.66600012779236,
                "duration": 0.6399998664855957
              },
              {
                "note": "B3",
                "frequency": 246.94165062806206,
                "midi": 59,
                "start": 162.2170000076294,
                "duration": 3.802000045776367
              },
              {
                "note": "B3",
                "frequency": 246.94165062806206,
                "midi": 59,
                "start": 167.8420000076294,
                "duration": 2.318000078201294
              },
              {
                "note": "B3",
                "frequency": 246.94165062806206,
                "midi": 59,
                "start": 172.55700016021729,
                "duration": 2.192999839782715
              },
              {
                "note": "B3",
                "frequency": 246.94165062806206,
                "midi": 59,
                "start": 177.4300000667572,
                "duration": 1.5269999504089355
              },
              {
                "note": "G4",
                "frequency": 391.99543598174927,
                "midi": 67,
                "start": 203.2039999961853,
                "duration": 2.134999990463257
              },
              {
                "note": "G4",
                "frequency": 391.99543598174927,
                "midi": 67,
                "start": 207.67900013923645,
                "duration": 2.316999912261963
              },
              {
                "note": "G4",
                "frequency": 391.99543598174927,
                "midi": 67,
                "start": 212.66300010681152,
                "duration": 2.700000047683716
              }
            ]
          },
                
                  {
            "index": 1,
            "seeds": [
              {
                "note": "A5",
                "frequency": 880,
                "midi": 81,
                "start": 0.5089998245239258,
                "duration": 1.2369999885559082
              },
              {
                "note": "E5",
                "frequency": 659.2551138257398,
                "midi": 76,
                "start": 1.7349998950958252,
                "duration": 1.315999984741211
              },
              {
                "note": "D5",
                "frequency": 587.3295358348151,
                "midi": 74,
                "start": 3.0289998054504395,
                "duration": 1.563000202178955
              },
              {
                "note": "C5",
                "frequency": 523.2511306011972,
                "midi": 72,
                "start": 14.335999965667725,
                "duration": 1.3489999771118164
              },
              {
                "note": "G5",
                "frequency": 783.9908719634985,
                "midi": 79,
                "start": 15.662999868392944,
                "duration": 2.7669999599456787
              },
              {
                "note": "E5",
                "frequency": 659.2551138257398,
                "midi": 76,
                "start": 32.30399990081787,
                "duration": 2.190999984741211
              },
              {
                "note": "D5",
                "frequency": 587.3295358348151,
                "midi": 74,
                "start": 34.48399996757507,
                "duration": 1.866999864578247
              },
              {
                "note": "C5",
                "frequency": 523.2511306011972,
                "midi": 72,
                "start": 36.36399984359741,
                "duration": 2.180999994277954
              }
            ],
            "baseEvents": [],
            "active": {
              "loops": 4,
              "playbackRate": 1,
              "noteSmudge": 1,
              "durationSmudge": 1,
              "duration": 66.5
            },
            "params": {
              "timing": {
                "duration": 66.5,
                "start": 10,
                "interval": 5
              },
              "playback": {
                "base": 0.8,
                "range": 0,
                "interval": 0
              },
              "note": {
                "base": 1,
                "range": 0.2,
                "interval": 3
              },
              "duration": {
                "base": 1,
                "range": 0.2,
                "interval": 4
              },
              "patch": {
                "echo": 10
              }
            },
            "nextEventsBase": [
              {
                "note": "A5",
                "frequency": 880,
                "midi": 81,
                "start": 0.5089998245239258,
                "duration": 1.2369999885559082
              },
              {
                "note": "E5",
                "frequency": 659.2551138257398,
                "midi": 76,
                "start": 1.7349998950958252,
                "duration": 1.315999984741211
              },
              {
                "note": "D5",
                "frequency": 587.3295358348151,
                "midi": 74,
                "start": 3.0289998054504395,
                "duration": 1.563000202178955
              },
              {
                "note": "C5",
                "frequency": 523.2511306011972,
                "midi": 72,
                "start": 14.335999965667725,
                "duration": 1.3489999771118164
              },
              {
                "note": "G5",
                "frequency": 783.9908719634985,
                "midi": 79,
                "start": 15.662999868392944,
                "duration": 2.7669999599456787
              },
              {
                "note": "E5",
                "frequency": 659.2551138257398,
                "midi": 76,
                "start": 32.30399990081787,
                "duration": 2.190999984741211
              },
              {
                "note": "D5",
                "frequency": 587.3295358348151,
                "midi": 74,
                "start": 34.48399996757507,
                "duration": 1.866999864578247
              },
              {
                "note": "C5",
                "frequency": 523.2511306011972,
                "midi": 72,
                "start": 36.36399984359741,
                "duration": 2.180999994277954
              }
            ]
          }
      
      ]
      ,
      line0: {
        synth: {},
        panner: {},
        filter: {},
        tremolo: {},
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
      let synth0Config = {
        envelope: {
          attack: 1,
          sustain: 1,
          release: 3
        }
      }

      this.line0.synth = new Tone.PolySynth(5, Tone.AMSynth)
      this.line0.synth.set(synth0Config)
      this.line0.panner = new Tone.Panner3D({positionZ: -2})
      this.line0.filter = new Tone.Filter()
      this.line0.tremolo = new Tone.Tremolo()
      this.line0.echo = new Tone.FeedbackDelay('8n', 0.4)
      this.line0.delay = new Tone.Delay({delayTime: 5, maxDelay: 179})
      this.line0.loop = new Tone.Gain(0.5)

      // this.line0.synth.chain(this.line0.panner, this.line0.filter, this.line0.tremolo, this.line0.echo, Tone.Master)

      this.line0.synth.connect(this.line0.panner)
      this.line0.panner.connect(this.line0.filter)
      this.line0.filter.connect(this.line0.echo)
      this.line0.echo.fan(this.global.EQ3, this.line0.delay)
      this.line0.delay.fan(this.global.EQ3, this.line0.loop)
      this.line0.loop.connect(this.line0.delay)


      // Line 1
      let synth1Config = {
        volume: -15,
        oscillator: {
          type: 'square'
        },
        envelope: {
            attack: 0.25, 
            sustain: 0.75, 
            release: 3
          }, 
        modulationEnvelope: {
            attack: 0.25, 
            sustain: 0.75, 
            release: 3
          }
      }
      this.line1.synth = new Tone.PolySynth(5, Tone.AMSynth)
      this.line1.synth.set(synth1Config)
      this.line1.panner = new Tone.AutoPanner({frequency: 50})
      this.line1.filter  = new Tone.Filter()
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
  #tooltip {
    position: fixed;
    width: 400px;
    right: 0;
    background: white;
    border: 1px solid;
    padding: 4px;
    z-index: 999;

    span {
      position: absolute;
      top: 2px;
      right: 7px;
      border: 1px solid rebeccapurple;
      padding: 2px;
      color: rebeccapurple;
    }
  }

  #banner {
    position: absolute;
    width: 400px;
    height: 20px;
    right: 0;
    background: white;
    border: 1px solid;
    padding: 4px;
    z-index: 999;

    span {
      position: absolute;
      top: 2px;
      right: 7px;
      border: 1px solid rebeccapurple;
      padding: 2px;
      color: rebeccapurple;
    }
  }

  #mobileStart {
    width: 100%;
    font-size: 32px;
  }
</style>
