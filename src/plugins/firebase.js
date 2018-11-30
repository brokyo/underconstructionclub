import Vue from 'vue';
import VueFire from 'vuefire';
import Firebase from 'firebase';

Vue.use(VueFire);

const config = {
  apiKey: 'AIzaSyCnAXNBs-GYYgYVUqdeY941OkDxwct0INA',
  authDomain: 'underconstructionclub1.firebaseapp.com',
  databaseURL: 'https://underconstructionclub1.firebaseio.com',
  projectId: 'underconstructionclub1',
  storageBucket: '',
  messagingSenderId: '555911740372',
};

const firebase = Firebase.initializeApp(config);
const db = firebase.database();

export { db };
