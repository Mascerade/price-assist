<template>
  <div id="container">
    <pa-user-view v-show="signedIn" @removeProduct="removeProduct" @signOut="signOut"
    :profileImg="profileImg" :displayName="displayName"
    :savedProducts="savedProducts" :itemModelToTitle="itemModelToTitle" />
    <div id="notSigned" v-show="!signedIn">
      <div id="google">
        <img :src="googleImgPath" alt="Gooogle">
        <p id="sign-in">Sign In</p>
      </div>
      <button @click="signIn" class="btn btn-outline-primary">Sign In!</button>
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
      itemModelToTitle: {},
      // IMAGES
      googleImgPath: 'chrome-extension://ginjedfmofjnnljikpcgealoahjdifmo/popup/images/google-icon.svg'
    }
  },
  created () {
    bus.$on('popupProfile', (profile) => {
      this.profileImg = profile.profileImg
      this.displayName = profile.displayName
      this.savedProducts = profile.savedProducts
      this.itemModelToTitle = profile.itemModelToTitle
      console.log(this.itemModelToTitle)
      this.signedIn = profile.signedIn
    })
    // Sent by this file (PopupApp)
    // Updates the itemModels that are saved
    bus.$on('updatePopupItemModels', (products) => {
      this.savedProducts = products
    })
  },
  methods: {
    signIn () {
      chrome.runtime.sendMessage({ message: 'sign in' }, function (response) {})
    },
    signOut () {
      chrome.runtime.sendMessage({ message: 'sign out' }, function (response) {})
      this.signedIn = false
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
  justify-content: center;
  height: 250px;
  width: 300px;
}

#notSigned {
  display: flex;
  flex-flow: column;
  align-items: center;
}

#google {
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px
}

#google > img {
  height: 60px;
  width: 60px;
  margin-right: 10px;
}

#google > p {
  font-size: 25px;
  text-align: center;
  margin: 0;
  margin-left: 10px;
}

</style>
