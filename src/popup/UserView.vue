<template>
  <div id="wrapper">
    <div id="header">
      <img id="profileImg" :src="profileImg" alt="Profile Image">
      <h4 id="name">Jason Acheampong</h4>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      profileImg: 'https://lh3.googleusercontent.com/ogw/ADGmqu9CohlcoBgcFIjT__icy6vLfyusMxjm0m05nJhd=s32-c-mo',
    }
  }
}
</script>

<style lang="css">
#wrapper {
  width: 100%;
  height: 100%;
  border-top: 10px solid;
  border-image-slice: 1;
  border-width: 5px;
  border-image-source: linear-gradient(315deg, #06bcfb 0%, #4884ee 74%);
}

#content {

}

#header {
  display: flex;
  flex-flow: row;
}
</style>
