<template>
  <div id="wrapper">
    <img id="search-img" :src="searchImgPath" alt="Search">
    <p>Searching for the Best Prices...</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      searchImgPath: 'chrome-extension://ginjedfmofjnnljikpcgealoahjdifmo/content_script/images/search.jpg'
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

#search-img {
  height: 200px;
  width: 200px;
  animation: circle-movement 3s infinite linear;
}

#wrapper > p {
  font-family: "Muli";
  font-size: 18px;
  animation: scale-up 1s inifinte alternate;
  -webkit-animation: scale-up 1s infinite alternate;
}

@keyframes scale-up {
  0% { transform: scale(1); }
  100% { transform: scale(1.065)};
}

@-webkit-keyframes scale-up {
  0% { transform: scale(1); }
  100% { transform: scale(1.065);}
}

@keyframes circle-movement {
  from {
    transform: rotate(0deg)
               translate(-9px)
               rotate(0deg);
  }
  to {
    transform: rotate(360deg)
               translate(-9px)
               rotate(-360deg);
  }
}

</style>
