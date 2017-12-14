<template>
  <main>
    <button v-if="!playing" @click="startSystem">Play</button>
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
        playing: false,
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
          system.systemEvents = _.cloneDeep(system.seeds)

          this.loopSystem(system)
        })
      },
      loopSystem(system) {
        console.log('new loop - system: ', system.index)
        // Temporary (wind blowing leaves) - reset to seeds every loop
        system.systemEvents = _.cloneDeep(system.seeds)

        // Semi-permanent (snow on a car windshield) let event changes compound then after x loops move back to seed

        // For probability (puddles near the cub) apply changes only to one note


        // Tracks additional start delay time based on duration smudge
        let compoundSmudge, changedDuration, smudgePercent
        compoundSmudge = 0
        smudgePercent = _.random(-system.durationSmudge, system.durationSmudge)

        system.systemEvents.forEach((event, index) => {
          // Calculate compounding smudge
          let smudgeAmount, newDuration
          smudgeAmount = event.duration * smudgePercent
          compoundSmudge += smudgeAmount

          event.frequency += _.random(system.noteSmudge)
          event.duration += smudgeAmount
          event.start += compoundSmudge

          // Apply playback rate changes and schedule event
          this.scheduleEvent(this.applyPlaybackRate(system, event), system.index)

        })


        this.changeDuration(system)

        // Call self
        let loopInterval = (system.systemDuration + system.interval) / system.playbackRate * 1000
        setTimeout(this.loopSystem, loopInterval, system)
        // system.loops++
      },
      scheduleEvent (event, lineIndex) {
        Tone.Transport.schedule((time) => {
          console.log('frequency:', event.frequency, 'duration:', event.duration, 'playAt:', time + event.start)
          let line = 'line' + lineIndex
          this.$parent[line].synth.triggerAttackRelease(event.frequency, event.duration, time + event.start, 0.75)
        })
      },
      applyPlaybackRate (system, event) {
        event.frequency *= system.playbackRate
        event.duration /= system.playbackRate
        event.start /= system.playbackRate

        return event
      },
      changeDuration (system) {
        let startGap, endGap, eventDuration, firstSeed, finalSeed, finalEchoLength, systemDuration

        firstSeed = _.first(system.systemEvents)
        finalSeed = _.last(system.systemEvents)
        startGap = firstSeed.start


        finalEchoLength = finalSeed.duration * system.echoCount
        endGap = system.systemDuration - (finalEchoLength + finalSeed.start)
        // Should do something to catch if it's negative
        eventDuration = (finalSeed.start + finalEchoLength) - firstSeed.start

        system.systemDuration = (startGap + eventDuration + endGap) / system.playbackRate
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
</style>
