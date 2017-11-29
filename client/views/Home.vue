<template>
  <main>
    <pre>Want to collaborate? Github projects <a href="https://github.com/brokyo">are here</a> or just <a href="mailto:alexcarusillo@gmail.com">email me</a> no tech skills required</pre>
    <h2>Log</h2>
    <pre>11-29-17</pre>
    <p>Spent yesterday making a weird drone painting thing. It's great. Try opening it in the corner of your screen while you do other work.</p>
    <p>Thinking about making it an app but the art will need to be more considered - let me know if you've got thoughts.</p>
    <p>Sign up for the update letter, if you want.</p>
    <div class="emailSignupContainer">
      <div class="signupForm">
        <label>Enter email for updates</label>
        <input type="text" v-model="email"></input>
        <button @click="submit" :disabled="!email">Join</button>
      </div>
    </div>
    <hr>
    <div class="projectContainer">
      <div class="projectCopy">
        <h2><a href="/windows">Windows</a></h2>
        <h4>What is it:</h4>
        <p>Randomly generated drones and painting. Click and drag to change color and shapes. Opening several windows at a time is fun too. Works on mobile supposedly.</p>
        <h4>How far along:</h4>
        <p>Quick prototype for something else but might end up making this an ionic app so it can be properly used on phones/appletv/<a href="https://frm.fm">framed.</a></p>
        <h4>Next feature:</h4>
        <p>Improving the control system and painting evolution</p>
      </div>
      <div class="projectImage">
        <a href="/windows">
          <img src="/images/windows.png"></img>
        </a>
      </div>
    </div>
    <hr>
    <div class="projectContainer">
      <div class="projectCopy">
        <h2><a href="http://ourlittleplanet.club/">Our Little Planet</a></h2>
        <h4>What is it:</h4>
        <p>A tool for creating generative music boxes.</p>
        <h4>How far along:</h4>
        <p>You can design a synth, create visuals, and "save" them as five minute instrument/song hybrid things. It's like windchimes. I've made windchines.</p>
        <h4>Next feature:</h4>
        <p>Multiple synths and effects on them</p>
      </div>
      <div class="projectImage">
        <a href="http://ourlittleplanet.club">
          <img src="/images/olp.png"></img>
        </a>
      </div>
    </div>
    <hr>
    <div class="projectContainer">
      <div class="projectCopy">
        <h2><a href="http://geocitiesspelunkers.surge.sh/">Unnamed GeoCities spelunker/memorial thing</a></h2>
        <h4>What is it:</h4>
        <p>Go to a random archived geocities page and - if it's cool - memorialize it so other people can see it.</p>
        <h4>How far along:</h4>
        <p>It exists and all the buttons work and stuff</p>
        <h4>Next feature</h4>
        <p>This is just a little hack - don't know what if anything is next. If you use it and want something or like it let me know.</p>
        <p>Also want to save the MIDIs if they're cool and make them available somewhere.</p>
      </div>
      <div class="projectImage">
        <a href="http://geocitiesspelunkers.surge.sh/">
          <img src="/images/su.png"></img>
        </a>
      </div>
    </div>
  </main>
</template>

<script>
import { db } from '../plugins/firebase.js'
import '../plugins/vue-easy-toast.js'

export default {
  metaInfo: {
    title: 'Welcome To The Under Construction Club'
  },
  data () {
    return {
      email: ''
    }
  },
  firebase: {
    newsletter: db.ref('newsletterSignups')
  },
  methods: {
    submit () {
        this.$firebaseRefs.newsletter.push({email: this.email})
        // this.$toast('Saved', {horizontalPosition: 'right', duration: 3000, closeable: true})
        this.email = ''
        alert('youre signed up')
    }
  }
}
</script>

<style lang="scss" scoped>
main {
  margin: 8px
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
  justify-content: center;

  img {
    border: 10px ridge;
    width: 350px;
    height: 350px;

  }

  a {
    color: white;
  }

  a :hover {
    color: blue;
  }
}
</style>
