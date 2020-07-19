<template>
  <div id="container">
    <pa-user-view v-show="signedIn" @removeProduct="removeProduct" :profileImg="profileImg" :displayName="displayName" :savedProducts="savedProducts" :itemModelToTitle="itemModelToTitle" />
    <div v-show="!signedIn">
      <p id="sign-in">Sign In with Google</p>
      <button @click="signIn" class="btn btn-outline-dark">Sign In!</button>
      <button @click="setData" class="btn btn-outline-dark">Set Data!</button>
      <button @click="signOut" class="btn btn-outline-dark">Sign Out!</button>
    </div>
  </div>
</template>

<script>
import UserView from './UserView'
import { bus } from '../bus'

export default {
  data () {
    return {
      signedIn: false,
      profileImg: '',
      displayName: '',
      savedProducts: [],
      itemModelToTitle: {}
    }
  },
  created () {
    bus.$on('popupProfile', (profile) => {
      this.profileImg = profile.profileImg
      this.displayName = profile.displayName
      this.savedProducts = profile.savedProducts
      this.itemModelToTitle = profile.itemModelToTitle
      this.signedIn = profile.signedIn
    })
    bus.$on('updatePopupItemModels', (products) => {
      this.savedProducts = products
    })
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
    },
    removeProduct (itemModel) {
      chrome.runtime.sendMessage({ message: 'remove product', 'itemModel': itemModel }, function (response) {
        // Emits 'updatePopupItemModels' which we pick up
        // Had to do this because 'this' here is null
        bus.popupUpdateItemModels(response.profile.savedProducts)
      })
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
  height: 250px;
  width: 300px;
}

p {
  font-size: 20px;
  text-align: center;
}
</style>
