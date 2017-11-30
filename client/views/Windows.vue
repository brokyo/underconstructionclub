<template>
  <div>
    <div v-if="!isMobile">
      <label>Base: {{baseFrequency}}</label> <label>Oscillators: {{oscillators}}</label>
      <button @click="fullScreen">full screen</button>
    </div>
    <h1 v-if="isMobile && !start">iOS click center of screen to start</h1>
     <div id="canvasContainer">
      <canvas id="pixels"></canvas>
    </div>
  </div>
</template>

<script>
var Tone = require('tone')
var _ = require('underscore')
var StartAudioContext = require('startaudiocontext')
// EUGH I did not name this and it's literally the only thing that does what I need :/
var nipplejs = require('nipplejs')
export default {
  name: 'Windows',
  data () {
    return {
        canvasConfig: {
          h: 255,
          s: 11,
          l: 30,
          rw: 100,
          rh: 10,
          percent: 0.0001  ,
          interval: 250,
        },
        startLoc: {
          x: 0,
          y: 0
        },
        start: false
    }
  },
  computed: {
    baseFrequency () {
      return _.sample([110, 220, 440])
    },
    oscillators () {
      return _.random(2, 20)
    },
    isMobile() {
      return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    }
  },
  methods: {
    fullScreen() {
      var canvas = document.getElementById("canvasContainer")
      if(canvas.RequestFullScreen){
          canvas.RequestFullScreen();
      }else if(canvas.webkitRequestFullScreen){
          canvas.webkitRequestFullScreen();
      }else if(canvas.mozRequestFullScreen){
          canvas.mozRequestFullScreen();
      }else if(canvas.msRequestFullscreen){
          canvas.msRequestFullscreen();
      }else{
          alert("This browser doesn't supporter fullscreen");
      }
    },
  },
  mounted () {
      var vue = this

      function isMobileDevice() {
          return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
      };

      if(isMobileDevice()){
        StartAudioContext(Tone.context).then(function(){
          vue.start = true
          createDrone()
          createCanvas()
          createControls()
        })
      } else {
        vue.start = true
        createDrone()
        createCanvas()
        createControls()

      }

      function createCanvas() {
        var canvas = document.getElementById("pixels");
        var ctx = canvas.getContext("2d");

        let w = window.screen.width * window.devicePixelRatio;
        let h = window.screen.height * window.devicePixelRatio;
        var pixels = Math.round((w * h) / 2);


        window.setInterval(()=>{

          // for (var i = 0; i < pixels * vue.canvasConfig.percent; i++) {
          for (var i = 0; i < _.random(10, 70); i++) {
              let h = vue.canvasConfig.h + Math.random()*3
              let s = vue.canvasConfig.s + Math.random()*3
              let cw = vue.canvasConfig.rw * _.random(1, 1.1)
              let ch = vue.canvasConfig.rh * _.random(1, 1.1)
              ctx.fillStyle = 'hsl('+ h +','+ s +'%,'+vue.canvasConfig.l+'%)';
              ctx.fillRect(_.random(-40, 600), _.random(-40, 600), cw, ch);
            }


        }, vue.canvasConfig.interval)

      }

      function createDrone() {

        // Gain is the output node but also determines how loud
        // TODO: Maybe loop this or something
        var droneOut = new Tone.Gain(0.25);
        droneOut.toMaster()

        // Creates an output chain for each oscillator, generates random playback, & pans audio [final two update constantly]
        function createOsc(freq) {

          // Create panner
          var panner = new Tone.Panner3D();
          var max = 20;
          var min = -20;
          var x = _.random(min, max);
          var y = _.random(min, max);
          var z = _.random(min, max);
          panner.setPosition(x, y, z);
          panner.connect(droneOut);

          var filter = new Tone.Filter({frequency: freq, type: 'lowpass', Q: 50})
          filter.connect(panner);

          var noiseSource = new Tone.Noise("pink")
          noiseSource.start()
          noiseSource.connect(filter);

          // Update panner position ever 500ms
          setInterval(function () {
            x = x + _.random(-0.1, 0.1);
            y = y + _.random(-0.1, 0.1);
            z = z + _.random(-0.1, 0.1);
            panner.setPosition(x, y, z);
          }, 500);
        }

        var scale = [0.0, 2.0, 4.0, 6.0, 7.0, 9.0, 11.0, 12.0, 14.0];

        // Run createOsc() for each oscillator
        // // function takes bounded random frequency
        for (var i = 0; i < 10; i++) {

          // Get random note from scale and smudge
          let freq = vue.baseFrequency * Math.pow(1.05945946, _.sample(scale))
          freq += Math.random() * 4 - 2;
          createOsc(freq);
        }
      }

      function createControls() {
        var options = {
          zone: document.getElementById("canvasContainer"),
          threshold: 0.01
        }
        var manager = nipplejs.create(options);
        manager.on('start', (e, data) => {
          vue.startLoc.x = data.position.x
          vue.startLoc.y = data.position.y
        })

        manager.on('move', (e, data) => {
          let heightCalc = Math.abs(data.position.y - vue.startLoc.y)
          let widthCalc = Math.abs(data.position.x - vue.startLoc.x)
          heightCalc === 0 ? vue.canvasConfig.rh = vue.canvasConfig.rh : vue.canvasConfig.rh = heightCalc / 2
          widthCalc === 0 ? vue.canvasConfig.rw = vue.canvasConfig.rw : vue.canvasConfig.rw = widthCalc * 2


          vue.canvasConfig.h = data.angle.degree

        })
      }
  }
}
</script>
<style lang="css" scoped>
  canvas {
    width: 100vw;
    height: 100vh;

  }
  #canvasContainer {
    position: relative;
  }

</style>
