<template>
  <main :class="{'active': active}">
    {{config}}
  </main>
</template>

<script>
export default {
  name: 'trigger',
  props: ['config', 'synth'],
  data () {
    return {
      active: false,
      playEvent: {
        frequency: 0,
        start: 0,
        end: 0,
        duration: 0
      }
    }
  },
  methods: {
    mountListener () {
      var vue = this
      window.addEventListener('keydown', (e) => {
        if (e.key === this.config.keyCode & !e.repeat) {
          this.active = true,
          this.playEvent.start = Date.now() / 1000
          this.playEvent.frequency = this.config.frequency

          this.synth.triggerAttack(this.playEvent.frequency, undefined, 1)
        }
      })

      window.addEventListener('keyup', (e) => {
        if (e.key === this.config.keyCode & !e.repeat) {
          this.active = false
          this.playEvent.end = Date.now() / 1000

          let event = {
            duration: this.playEvent.end - this.playEvent.start,
            frequency: this.config.frequency
          }
          this.synth.triggerRelease(this.playEvent.frequency)

          let i = 0
          // function loop (event) {
          //   if(i < 5) {
          //     vue.active = true
          //     vue.synth.triggerAttack(event.frequency, undefined, 1 - i/5)
          //     setTimeout(() => {
          //       vue.synth.triggerRelease(event.frequency)
          //       vue.active = false
          //     }, event.duration * 1000)
          //     i++


          //     setTimeout(loop, (event.duration * 1000) + 1000, event)
          //   }
          // }
          function loop (event) {
            this.active = true
            i++
            if(i < 5) {
              console.log('hey')
              vue.synth.triggerAttackRelease(event.frequency, event.duration, undefined, 1 - i/5)


              setTimeout(loop, 1000, event)
            }
          }

          setTimeout(loop, 1000, event)
        }
      })
    }
  },
  mounted () {
    this.mountListener()
  }
}
</script>

<style lang="scss" scoped>
.active {
  background-color: blue
}
</style>
