<template>
  <div id="container">
    <pa-user-view v-if="signedIn" />
    <div v-else>
      <p id="sign-in">Sign In with Google</p>
      <button @click="signIn" class="btn btn-outline-dark">Sign In!</button>
      <button @click="setData" class="btn btn-outline-dark">Set Data!</button>
      <button @click="signOut" class="btn btn-outline-dark">Sign Out!</button>
    </div>
  </div>
</template>

<script>
import UserView from './UserView'
export default {
  data () {
    return {
      signedIn: true
    }
  },
  methods: {
    signIn () {
      chrome.runtime.sendMessage({ message: 'sign in' }, function (response) {})
    },
    setData () {
      chrome.runtime.sendMessage({ message: 'set data' }, function (response) {})
    },
    signOut () {
      chrome.runtime.sendMessage({ message: 'sign out' }, function (response) {})
    }
  },
  components: {
    'pa-user-view': UserView
  }
}
</script>

<style lang="scss" scoped>
#container {
  display: flex;
  flex-flow: column;
  align-items: center;
  height: 325px;
  width: 325px;
}

p {
  font-size: 20px;
  text-align: center;
}
</style>
