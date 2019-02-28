<template>
    <main>
      <div class="introText">
        <p>Hiya. I'm Alex Carusillo & I make stuff with code.</p> 
        <p>Always interested in new people and ideas so, seriously, <a href="mailto:alexcarusillo@gmail.com">alexcarusillo@gmail.com</a> for professional 'technologist' work, collaborations, or just to chat! I'd love to hear about what you're working on.</p>
      </div>
        <h2>Log</h2>
        <pre>11-30-18</pre>
        <p>Put up A/V stuff. I'm particularly excited about the electromagnetic field recording videos atm so if you think they're cool @ me. I want to do more with them but don't quite know what.</p>
        <p>Sign up for the update letter, if you want. It's infrequent fwiw.</p>
        <img src=""
        <div class="emailSignupContainer">
            <div class="signupForm">
                <label>Enter email for updates</label>
                <input type="text" v-model="email"></input>
                <button @click="submit" :disabled="!email">Join</button>
            </div>
        </div>
        <hr>
        <h2>A/V</h2>
        <div v-for="project in avProjects">
            <div class="projectContainer">
                <div class="projectCopy">
                    <h2><a :href="'https://' + project.url">{{project.name}}</a></h2>
                    <h4>What is it:</h4>
                    <p>{{project.what}}</p>
                    <h4 v-if="project.how">How do I use it:</h4>
                    <p v-if="project.how">{{project.how}}</p>
                    <h4 v-if="project.next">Coming next:</h4>
                    <p v-if="project.next">{{project.next}}</p>
                    <h4 v-if="project.tech">Technology Used</h4>
                    <p>{{project.tech}}</p>
                </div>
                <div class="projectImage">
                    <a :href="'https://' + project.url">
                        <img :src="baseUrl + project.image"></img>
                    </a>
                </div>
            </div>
            <hr>
        </div>        <h2>Code</h2>
        <div v-for="project in codeProjects">
            <div class="projectContainer">
                <div class="projectCopy">
                    <h2><a :href="'https://' + project.url">{{project.name}}</a></h2>
                    <h4>What is it:</h4>
                    <p>{{project.what}}</p>
                    <h4>How do I use it:</h4>
                    <p>{{project.how}}</p>
                    <h4 v-if="project.next">Coming next:</h4>
                    <p v-if="project.next">{{project.next}}</p>
                    <h4 v-if="project.tech">Technology Used</h4>
                    <p>{{project.tech}}</p>
                </div>
                <div class="projectImage">
                    <a :href="'https://' + project.url">
                        <img :src="baseUrl + project.image"></img>
                    </a>
                </div>
            </div>
            <hr>
        </div>
        </div>
    </main>
</template>
<script>
import {
  db,
} from './plugins/firebase.js';
import './plugins/vue-easy-toast.js';

export default {
  metaInfo: {
    title: 'Ongoing, always | Under Construction Club',
    meta: [
      {
        vmid: 'description', name: 'description', content: 'Alex Carusillo\'s ongoing projects',
      },
    ],
  },
  data() {
    return {
      baseUrl: process.env.BASE_URL,
      email: '',
      avProjects: [
        {
          name: 'Waves [for anna & dylan but I never finished :(]',
          what: 'Generative light and sound IRL. A tunable system that syncs Philip Hue bulbs with timbre controls to play an adjustable, evolving piece. Click to see video or get the repo here.',
          tech: 'Vue.js, Tone.js, Philips Hue',
          url: 'www.youtube.com/watch?v=SAdAy6xxl8M',
          image: 'images/waves.jpg',
        },
        {
          name: 'Our Little Planet [video series]',
          what: 'Series of videos combining electromagnetic field recordings and long-form static video.',
          tech: 'LOM Audio Priezor, Zoom H4n Pro, iPhone 4',
          url: 'www.youtube.com/watch?v=xl7YxKPPbg8&index=9&list=PLhNGcsSWZ_gA0fVJbWJHEwOKMGPKIYsBl',
          image: 'images/olp-v.jpg',
        }
      ],
      codeProjects: [
        {
          name: 'Breath',
          what: "Evolving harmonic drone and breathing exercise. Part of `Digital Prayers Work` app. Drone written in tone.js using white noise, filters, and a series of effects. Visuals are a perlin noise 3d probability space drawn in p5. ",
          how: "After click start drone changes on its own or can be controlled manually. It's pretty hard to make it sound bad so explore the parameters.",
          tech: "Vue.js, Tone.js, P5.js",
          url: "breathe.under-construction.club",
          image: 'images/breath.png'
        },
        {
            name: 'Everything A Cycle',
            what: 'Probabilistic music and evolving visuals. This is alpha but I\'m using it for something and need a link. You can make your own using the Additive Synthesizer. Let me know if you want to collaborate on this as I\'d love help.',
            how: 'click the link. It\'s supposed to always be quiet as it\'ll end up being an always on device (maybe)',
            tech: 'Vue.js, Tone.js, p5.js',
            url: 'everythingacycle.under-construction.club',
            image: 'images/olp2.png'
        },
        {
          name: 'Healing Codes For The Biological Apocalypse [w. Setu]',
          what: 'Meditative new age inkblot deep listening drones based on the Watts-Strogatz model. (I know...) Graph of sound nodes that turn on or off based on state of neighbors and connections between. Mutating drone composed of Solfeggio frequencies.',
          how: 'Click a button to change your life',
          tech: 'Vue.js, Tone.js, p5.js, Amazon Polly',
          url: 'healingcodes.under-construction.club',
          image: 'images/sn.png',
        }, {
          name: 'Our Little Planet',
          what: 'A tool for creating musicboxes for others to play. It windchimes, I\'ve made windchimes.',
          how: 'Play prexisting musicboxes or create your own to share by designing a synthesizer and visuals.',
          tech: 'Vue.js, Tone.js',
          url: 'ourlittleplanet.under-construction.club',
          image: 'images/olp.png',
        }, {
          name: 'Additive Synthesizer',
          what: 'A synthesizer you can play in your browser with either your keyboard or an attached MIDI keyboard. Also allows composing music, saving it as JSON, and exporting the synth and loop. Synths can be plugged directly into Our Little Planet 2. Particularly useful if creating a ToneJS project',
          how: 'Press letters or keys to hear notes. Create different waveforms with sliders, filters, and effects.',
          tech: 'Vue.js, Tone.js',
          url: 'additive-synth.under-construction.club',
          image: 'images/as.png',
        }, {
          name: 'Pools',
          what: 'Patterns of different lengths loop continuously and change over time. Played over NYC DoT traffic cams. Plays indefinitely',
          how: 'Play existing loops or record your own pieces and set mutation parameters.',
          next: 'More synth config options and a way to switch between different synths and mutation probabilities',
          tech: 'Vue.js, Tone.js',
          url: 'pools.under-construction.club',
          image: 'images/fade.png',
        }, 
        {
          name: 'Photos',
          what: 'I take a lot of pictures with plastic cameras and expired/homemade film.',
          tech: 'Superheadz Golden Half, Minolta AF2, Lomo LCA, Superheadz Ultra Wide & Slim',
          url: 'www.flickr.com/photos/95717285@N00/albums/72157702680866031',
          image: 'images/flickr.png',
        },
        {
          name: 'GeoCities Spelunker',
          what: 'Geocities explorer and hall of fame',
          how: 'Go to a random archived geocities page and - if it\'s cool - memorialize it so other people can see it.',
          tech: 'Vue.js',
          url: 'spelunker.under-construction.club',
          image: 'images/su.png',
        }, {
          name: 'Windows',
          what: 'Randomly generated drones and painting. Works on mobile supposedly.',
          how: 'Click and drag to change color and shapes. Opening several windows at a time is fun, too. ',
          tech: 'Vue.js, Web Audio API',
          url: 'windows.under-construction.club',
          image: 'images/windows.png',
        }],
    };
  },
  firebase: {
    newsletter: db.ref('newsletterSignups'),
  },
  methods: {
    submit() {
      this.$firebaseRefs.newsletter.push({
        email: this.email,
      });
      // this.$toast('Saved', {horizontalPosition: 'right', duration: 3000, closeable: true})
      this.email = '';
      alert('youre signed up');
    },
  },
};
</script>
<style lang="scss" scoped="">
main {
    margin: 8px
}

.introText {
    width: 800px;
    margin: 20px auto;
    text-align: center;

    p {
      margin-bottom: 5px;
      margin-top: 0px;
    }
}

.emailSignupContainer {
    display: flex;
    justify-content: center;
    .signupForm {
        border: 5px double black;
        padding: 10px;
        width: 400px;
    }
}

label {
    font-weight: 900;
}

.projectContainer {
    display: flex;
    width: 100vw;
}

.projectCopy {
    width: 60%;
}

.projectImage {
    width: 40%;
    display: flex;
    justify-content: flex-end;
    img {
        border: 10px ridge;
        margin: 0px 27px 0px 0px;
        width: 350px;
        height: 350px;
    }
    a {
        color: white;
    }
    a:hover {
        color: blue;
    }
}

.projectImage img:hover {
  border: 10px ridge blue;
}
</style>
