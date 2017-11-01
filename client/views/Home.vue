<template>
  <main>
    <pre>Want to collaborate? Github projects <a href="https://github.com/brokyo">are here</a> or just <a href="mailto:alexcarusillo@gmail.com">email me</a> no tech skills required</pre>
    <h2>Log</h2>
    <pre>10-31-17</pre>
    <p>You're early.</p>
    <label>Enter email for updates</label>
    <input type="text" v-model="email"></input>
    <button @click="submit" :disabled="!email">Join</button>
    <hr>
    <div class="projectContainer">
      <div class="projectCopy">
        <h2><a href="https://ourlittleplanet.herokuapp.com">Our Little Planet</a></h2>
        <h4>What is it:</h4>
        <p>A tool for creating generative music boxes.</p>
        <h4>How far along:</h4>
        <p>You can design a synth, create visuals, and "save" them as five minute instrument/song hybrid things. It's like windchimes. I've made windchines.</p>
        <h4>Next feature:</h4>
        <p>Ability to edit music boxes you've already created</p>
        <h3>New musicboxes</h3>
      </div>
      <div class="projectImage">
        <a href="https://ourlittleplanet.herokuapp.com">
          <img src="/images/olp.png"></img>
        </a>
      </div>
    </div>
    <hr>
    <div class="projectContainer">
      <div class="projectCopy">
        <h2><a href="https://geocitiesspelunkers.firebaseapp.com">Unnamed GeoCities spelunker/memorial thing</a></h2>
        <h4>What is it:</h4>
        <p>Memorial of the most interesting writing, music, and design on geocities.</p>
        <h4>How far along</h4>
        <p>Shows random page and lets you memorialize it if you think it deserves it</p>
        <h4>Next Feature</h4>
        <p>Wanted to get this out of my system so built one evening. Don't know what if anything is next. If you use it and want something or like it let me know.</p>
      </div>
      <div class="projectImage">
        <a href="https://geocitiesspelunkers.firebaseapp.com">
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
        this.$toast('Saved', {horizontalPosition: 'right', duration: 3000, closeable: true})
        this.email = ''
    }
  }
}
</script>

<style>
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
