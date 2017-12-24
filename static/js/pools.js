var Tone = require('tone')

export default class Pool {

  constructor (patchConfig, playConfig, meta) {
    this.name = meta.name
    this.patch = {}
    // Create Tone Objects
    patchConfig.forEach((node) => {
      this.patch[node.prop] = new Tone[node.toneName](node.config)
    })

    // Connect Tone Objects
    patchConfig.forEach((node, index) => {

      if (node.prop === 'out') {
        this.patch[node.prop][node.connectType](Tone.Master)
      } else {
        node.connectNode.forEach((connectedNode) => {
          this.patch[node.prop][node.connectType](this.patch[connectedNode])
        })
      }
    })

    this.seeds = playConfig.seeds
    this.nextEventsBase = playConfig.seeds
    this.active = {
      loops: 0,
      playbackRate: 1,
      noteSmudge: 1,
      durationSmudge: 1,
      direction: 'north',
      duration: playConfig.timing.duration
    }
    this.timing = {
      duration: playConfig.timing.duration,
      start: playConfig.timing.start,
      interval: playConfig.timing.interval
    }

    this.directionConfig = {
      north: playConfig.directionConfig.north,
      south: playConfig.directionConfig.south
    }
  }

  start (startTime) {
    this.playing = true
    setTimeout(() => this.loop(), 5000)
  }

  loop() {
    console.log(this.name, 'loop:', this.active.loops)

    // Temporary (wind blowing leaves) - reset to seeds every loop
    this.nextEventsBase = _.cloneDeep(this.seeds)


    // Change Playback
    if (this.active.loops % this.directionConfig[this.active.direction].playback.interval === 0) {
      this.changePlaybackRate()
      console.log(this.name, 'changed: playback', this.active.playbackRate )
    }

    // Change Frequency
    if (this.active.loops % this.directionConfig[this.active.direction].note.interval === 0) {
      this.changeFrequencyPercent()
      console.log(this.name, 'changed: frequency', this.active.noteSmudge )
    }

    // Change Duration
    if (this.active.loops % this.directionConfig[this.active.direction].duration.interval === 0) {
      this.changeDurationPercent()
      console.log(this.name, 'changed: duration', this.active.durationSmudge )
    }

    // Tracks additional start delay time based on duration smudge
    let compoundSmudge, changedDuration
    compoundSmudge = 0

    // Select new notes
    this.nextEventsBase.forEach((event, index) => {
      let smudgeAmount, newDuration
      smudgeAmount = event.duration * (1 - this.active.durationSmudge)
      compoundSmudge += smudgeAmount

      event.frequency *= this.active.playbackRate
      event.duration += (smudgeAmount / this.active.playbackRate)
      event.start += (compoundSmudge / this.active.playbackRate)

      this.scheduleEvent(event)
    })


    let loopInterval = (this.active.duration * 1000) + (this.timing.interval * 1000)
    setTimeout(() => this.loop(), loopInterval)
    this.active.loops++
  }


  changePlaybackRate () {
    this.active.playbackRate = this.directionConfig[this.active.direction].playback.base * (1 + _.round(_.random(-this.directionConfig[this.active.direction].playback.range, this.directionConfig[this.active.direction].playback.range), 2))
    this.active.duration = this.directionConfig[this.active.direction].timing.duration / this.active.playbackRate
  }

  changeFrequencyPercent () {
    this.active.noteSmudge = this.directionConfig[this.active.direction].note.base * (1 + _.round(_.random(-this.directionConfig[this.active.direction].note.smudge, this.directionConfig[this.active.direction].note.smudge), 2))
  }

  changeDurationPercent () {
    this.active.durationSmudge = this.directionConfig[this.active.direction].duration.base * (1 + _.round(_.random(-this.directionConfig[this.active.direction].duration.smudge, this.directionConfig[this.active.direction].duration.smudge)))
  }

  scheduleEvent (event) {
    Tone.Transport.schedule((time) => {
      this.patch.synth.triggerAttackRelease(event.frequency, event.duration, time + event.start, 0.75)
      // console.log('frequency:', event.frequency, 'duration:', event.duration, 'start:', event.start+time)
    })
  }

  changeDirection (direction) {
    console.log('direction change:', direction)
    switch (direction) {
      case 'north':
        this.active.direction = 'north'
        break
      case 'south':
        this.active.direction = 'south'
        break
      case 'east':
        break
      case 'west':
        break
    }

  }

}
