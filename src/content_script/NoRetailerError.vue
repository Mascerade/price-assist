<template>
  <div id="wrapper">
    <img :src="questionImgSrc" alt="Could Not Find Price :(">
    <p>Could Not Find Any Other Products</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      questionImgSrc: 'chrome-extension://ginjedfmofjnnljikpcgealoahjdifmo/content_script/images/question.svg'
    }
  }
}
</script>

<style lang="css" scoped>
#wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
}

img {
  height: 250px;
  width: 200px;
}

p {
  font-family: "Muli";
  font-size: 18px;
}
</style>
