<template>
	<main>
		<h2>You're In</h2>
		<p>I'll email you from time to time maybe. Don't know. This whole thing is a real work in progress. <router-link :to="{path: '/'}">Main page</router-link></p>
	</main>
</template>

<script>
import { db } from '../plugins/firebase.js'

export default {
  firebase: {
    newsletter: db.ref('newsletterSignups')
  },
  mounted () {
    this.$firebaseRefs.newsletter.push({email: this.$route.query.email})
  }
}
</script>

<style lang="css" scoped>
</style>