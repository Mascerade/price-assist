<template>
  <div id="wrapper">
    <div id="header">
      <img id="profile-img" :src="profileImg" alt="Profile Image">
      <div id="name-wrapper">
        <h4 id="name">Jason Acheampong</h4>
      </div>
    </div>
    <div id="content">

    </div>
    <a id="sign-out" @click.prevent="signOut()">Sign Out</a>
  </div>
</template>

<script>
export default {
  data () {
    return {
      profileImg: 'https://lh3.googleusercontent.com/ogw/ADGmqu9CohlcoBgcFIjT__icy6vLfyusMxjm0m05nJhd=s32-c-mo',
    }
  },
  methods: {
    signOut () {
      console.log('have to sign out')
    }
  }
}
</script>

<style lang="css" scoped>
@import url('../styles/typeface-quicksand.css');
@import url('../styles/typeface-muli.css');
@import url('../styles/material-icons.css');

#wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-top: 10px solid;
  border-image-slice: 1;
  border-width: 5px;
  border-image-source: linear-gradient(315deg, #06bcfb 0%, #4884ee 74%);
  font-family: 'Muli'
}

#header {
  width: 100%;
  display: flex;
  flex-direction: row;
  padding-left: 5px;
  padding-right: 5px;
  margin-top: 3px;
}

#profile-img {
  height: 48px;
  width: 48px;
  border-radius: 50%;
}

#name-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

#content {
  flex: 1;
}

#sign-out {
  height: 30px;
  width: 100%;
  color: white;
  font-size: 18px;
  text-align: center;
  background-color: #ff4444;
}

#sign-out:hover {
  background-color: #CC0000;
  cursor: pointer;
}

</style>
