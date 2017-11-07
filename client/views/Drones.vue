<template>
  <main>
<!--     <input v-model='BaseNote' type='range' min='40' max='100'>
    <input v-model="NumOsc" type='range' min='1' max='40'> -->
    <label>Min</label>
    <input v-model="bufferMin" type="range" min="0" max="1" step="0.1"></input>
    <label>Max</label>
    <input v-model="bufferMax" type="range" min="0" max="1" step="0.1"></input>
    <pre>{{num}}</pre>
  </main>
</template>

<script>
export default {
  data () {
    return {
      outBuffer: [],
      num: 0,
      BaseNote: 63,
      NumOsc: 20,
      bufferMin: 0.2,
      bufferMax: 0.9
    }
  },
  mounted () {
    var vue = this
    var context = new AudioContext();
    var gain = context.createGain();
    gain.gain.value = 0.25;
    gain.connect(context.destination);

    var noiseNodes = [];
    var bufferLen = 256

    function createNoiseGen(freq) {
      var panner = context.createPanner();
      var max = 20;
      var min = -20;
      var x = rand(min, max);
      var y = rand(min, max);
      var z = rand(min, max);
      panner.setPosition(x, y, z);
      panner.connect(gain);

      var filter = context.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = freq;

      filter.Q.value = 50;
      filter.connect(panner);


      var noiseSource = context.createScriptProcessor(bufferLen, 1, 2);
      noiseSource.onaudioprocess = function (e) {
        var outBufferL = e.outputBuffer.getChannelData(0);
        var outBufferR = e.outputBuffer.getChannelData(1);
        for (var i = 0; i < bufferLen; i++) {
          outBufferL[i] = outBufferR[i] = rand(vue.bufferMin, vue.bufferMax);
        }
      };
      noiseSource.connect(filter);
      noiseNodes.push(noiseSource);

      setInterval(function () {
        x = x + rand(-0.1, 0.1);
        y = y + rand(-0.1, 0.1);
        z = z + rand(-0.1, 0.1);
        panner.setPosition(x, y, z);
      }, 500);
    }

    var scale = [0.0, 2.0, 4.0, 6.0, 7.0, 9.0, 11.0, 12.0, 14.0];

    for (var i = 0; i < this.NumOsc; i++) {
      var degree = Math.floor(Math.random() * scale.length);
      var freq = mtof(this.BaseNote + scale[degree]);

      freq += Math.random() * 4 - 2;
      createNoiseGen(freq);
    }

    function mtof(m) {
      return Math.pow(2, (m - 69) / 12) * 440;
    }

    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }


    // function reset(){
    //   while (noiseNodes.length){
    //     noiseNodes.pop().disconnect();
    //   }
    //   generate();
    // }


  }
}
</script>

<style lang="css" scoped>
</style>
