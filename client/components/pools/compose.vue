<template>
	<main>
		<div id="triggers">
			<button v-for="trigger in triggers" class="synthTrigger" :class="{active: trigger.active}" @mousedown="attack(trigger.note); trigger.active = true" @mouseup="release(trigger.note); trigger.active = false" v-on:touchstart="attack(trigger.note); trigger.active = true"
			  v-on:touchend="release(trigger.note); trigger.active = false">
					{{trigger.note}}
				</button>
		</div>
		<div id="controls">
			<button @click="startRecording(0)" v-if="recording !== 0" class="recordingButton" id="startButton">Record System 0</button>
			<button @click="endRecording(0)" v-else class="recordingButton" id="endButton">End</button>
			<button @click="exportSystem(0)" :disabled="!system0.seeds">Save</button>
			<button @click="startRecording(1)" v-if="recording !== 1" class="recordingButton" id="startButton">Record System 1</button>
			<button @click="endRecording(1)" v-else class="recordingButton" id="endButton">End</button>
			<button @click="exportSystem(1)" :disabled="!system1.seeds">Save</button>
		</div>
	</main>
</template>

<script>
	var Tone = require('tone')
	var _ = require('lodash')

	export default {
		name: 'compose',
		data() {
			return {
				recording: false,
				triggers: [{
						note: 'B3',
						active: false,
						keyCode: 'q'
					},
					{
						note: 'G3',
						active: false,
						keyCode: 'w'
					},
					{
						note: 'D4',
						active: false,
						keyCode: 'e'
					},
					{
						note: 'E4',
						active: false,
						keyCode: 'r'
					},
					{
						note: 'G4',
						active: false,
						keyCode: 't'
					},
					{
						note: 'C5',
						active: false,
						keyCode: 'a'
					},
					{
						note: 'D5',
						active: false,
						keyCode: 's'
					},
					{
						note: 'E5',
						active: false,
						keyCode: 'd'
					},
					{
						note: 'G5',
						active: false,
						keyCode: 'f'
					},
					{
						note: 'A5',
						active: false,
						keyCode: 'g'
					},
				],
				rawPart: {
					start: 0,
					end: 0,
					seeds: []
				},
				system0: [],
				system1: [],
			}
		},
		methods: {
			startRecording(index) {
				this.recording = index
				this.rawPart.start = Date.now() / 1000
			},
			endRecording(index) {
				this.recording = false
				this.rawPart.end = Date.now() / 1000

				let newSystem = {
          index: index,
					seeds: [],
          baseEvents: [],
          active: {
            loops: 0,
            playbackRate: 1,
            noteSmudge: 0,
            durationSmudge: 0,
            duration: this.rawPart.end - this.rawPart.start,
          },
          params: {
            timing: {
              duration: this.rawPart.end - this.rawPart.start,
              start: 0,
              interval: 5
            },
            playback: {
              rate: 1,
              range: 0,
              interval: 0
            },
            note: {
              smudge: 0,
              interval: 0
            },
            duration: {
              smudge: 0,
              interval: 0
            },
            patch: {
              echoCount: 10
            }
          }

				}

				this.rawPart.seeds.forEach((event) => {
					event.start = event.start - this.rawPart.start

					delete event.active
					newSystem.seeds.push(event)
				})


				let constructedSystem = 'system' + index
				this[constructedSystem] = newSystem

				this.rawPart = {
					start: 0,
					end: 0,
					seeds: []
				}
			},
			exportSystem(index) {
				let constructedSystem = 'system' + index

				this.$emit('exportSystem', this[constructedSystem])
				this[constructedSystem] = []
			},
			attack(note) {
				if (this.recording !== false) {
					let event = {
						note: note,
						frequency: Tone.Frequency(note).toFrequency(),
						midi: Tone.Frequency(note).toMidi(),
						start: Date.now() / 1000,
						active: true
					}
					this.rawPart.seeds.push(event)				}

				this.$parent.line0.synth.triggerAttack(note, undefined, 0.75)
			},
			release(note) {
				if (this.recording !== false) {
					let event = _.find(this.rawPart.seeds, {
						note: note,
						active: true
					})
					event.duration = Date.now() / 1000 - event.start
					event.active = false
				}

				this.$parent.line0.synth.triggerRelease(note)
			}
		},
		mounted() {
			this.triggers.forEach((trigger) => {
				window.addEventListener('keydown', (e) => {
					if (e.key === trigger.keyCode & !e.repeat) {
						this.attack(trigger.note)
						trigger.active = true
					}
				})

				window.addEventListener('keyup', (e) => {
					if (e.key === trigger.keyCode & !e.repeat) {
						this.release(trigger.note)
						trigger.active = false
					}
				})
			})
		}
	}
</script>

<style lang="scss" scoped>
	#triggers {
		height: 90vh;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap
	}

	.synthTrigger {
		border: 1px solid black;
		flex-basis: 20%;
		display: flex;
		justify-content: center;
		align-items: center;
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	.active {
		background-color: red
	}

	#controls {
		display: flex;
		height: 10vh;
		align-items: center;
		.recordingButton {
			flex-grow: 2;
		}
		button {
			flex-grow: 1;
			height: 80%;
		}
		#startButton {
			background-color: green;
		}
		#endButton {
			background-color: red;
		}
	}
</style>
