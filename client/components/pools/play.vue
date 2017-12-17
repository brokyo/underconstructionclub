<template>
  <main>
    <button v-if="!playing" @click="startSystem">Play</button>
    <div id="debug">
      <div v-for="system in systems">
        <p>
          {{system.seeds}}
        </p>
        <p>
          {{system.baseEvents}}
        </p>
      </div>
    </div>
    <img :src="embed"></img>
  </main>
</template>

<script>
  var Tone = require('tone')

  export default {
    name: 'play',
    props: ['systems'],
    data() {
      return {
        cacheBreak: 0,
        possibleCams: ['http://207.251.86.238/cctv391.jpg', 'http://206.140.121.226/jpg/image.jpg', 'http://128.151.213.230/jpg/image.jpg', 'http://airportcam.puc.edu/-wvhttp-01-/GetStillImage?camera_id=1', 'http://82.144.57.103/oneshotimage.jpg', 'http://pcc.miemasu.net/snapshotJPEG?Resolution=640x480&amp;Quality=Clarity', 'http://ds4ams.viewnetcam.com/snapshotJPEG?resolution=320x240'],
        playing: false
      }
    },
    computed: {
      embed() {
        return 'http://207.251.86.238/cctv391.jpg?cache=' + this.cacheBreak
      }
    },
    methods: {
      startSystem(system) {
        this.playing = true
        this.systems.forEach((system) => {
          setTimeout(() => this.loopSystem(system), system.params.timing.start * 1000)
        })
      },
      loopSystem(system) {
        // Temporary (wind blowing leaves) - reset to seeds every loop
        system.nextEventsBase = _.cloneDeep(system.seeds)

        // Semi-permanent (snow on a car windshield) let event changes compound then after x loops move back to seed

        // For probability (puddles near the curb) apply changes only to one note

        // Change Playback
        if (system.active.loops % system.params.playback.interval === 0) {
          this.changePlaybackRate(system)
        }

        // Change Frequency
        if (system.active.loops % system.params.note.interval === 0) {
          this.changeFrequencyPercent(system)
        }

        // Change Duration
        if (system.active.loops % system.params.duration.interval === 0) {
          this.changeDurationPercent(system)
        }

        // Tracks additional start delay time based on duration smudge
        let compoundSmudge, changedDuration
        compoundSmudge = 0

        // Select new notes
        system.nextEventsBase.forEach((event, index) => {
          let smudgeAmount, newDuration
          smudgeAmount = event.duration *= system.active.durationSmudge
          compoundSmudge += smudgeAmount

          event.frequency *= system.active.noteSmudge *= system.active.playbackRate
          event.duration *= smudgeAmount /= system.active.playbackRate
          event.start += compoundSmudge /= system.active.playbackRate

          this.scheduleEvent(event, system.index)

        })

        // Update Loop
        let loopInterval = (system.active.duration * 1000) + (system.params.timing.interval * 1000)
        setTimeout(this.loopSystem, loopInterval, system)
        system.active.loops++
      },
      changePlaybackRate (system) {
        system.active.playbackRate = system.params.playback.rate * (1 + _.round(_.random(-system.params.playback.range, system.params.playback.range), 2))
        system.active.duration = system.params.timing.duration / system.active.playbackRate
      },
      changeFrequencyPercent (system) {
        system.active.noteSmudge = 1 + _.round(_.random(-system.params.note.smudge, system.params.note.smudge), 2)
      },
      changeDurationPercent (system) {
        system.active.durationSmudge = 1 + _.round(_.random(-system.params.duration.smudge, system.params.duration.smudge))
      },
      scheduleEvent (event, lineIndex) {
        Tone.Transport.schedule((time) => {
          let line = 'line' + lineIndex
          this.$parent[line].synth.triggerAttackRelease(event.frequency, event.duration, time + event.start, 0.75)
        })
      }
    },
    mounted() {
      Tone.Transport.start()

      setInterval(() => {
        this.cacheBreak = Math.random()
      }, 1000)
    },
    beforeDestroy() {
      Tone.Transport.stop()
    }
  }
</script>

<style lang="scss" scoped>
  button {
    position: absolute;
    height: 100vh;
    width: 100vw;
  }

  img {
    height: 100vh;
    width: 100vw;
  }

  #debug {
    position: absolute;
    top: 0;
    z-index: 999999;
  }
</style>
