<template>
  <div class="unset" id="price-assist-heading">
    <a href="http://www.timeless-apps.com/" target="_blank">
      <img id="price-assist-logo" src="https://dl.dropbox.com/s/7vleowye5psd2mj/only_logo_transparent_white.png?raw=0" alt="Logo" />
    </a>
    <h3>Price Assist</h3>
    <img :src="closeImgPath" id="price-assist-close-icon" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      closeImgPath: 'chrome-extension://ginjedfmofjnnljikpcgealoahjdifmo/content_script/images/close.png',
    };
  },
};
</script>

<style lang="css" scoped>
#price-assist-wrapper {
  height: 500px;
  width: 300px;
  font-family: 'Muli';
  font-weight: 300;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

#price-assist-heading {
  display: flex;
  font-family: 'Muli';
  font-style: normal;
  font-weight: 200;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  flex-flow: row;
  align-items: center;
  height: 50px;
  width: 100%;
  background-color: #1fd1f9;
  background-image: linear-gradient(315deg, #1fd1f9 10%, #b621fe 99%);
  color: white;
}

#price-assist-logo {
  height: 50px;
  width: 50px;
  margin-left: 10px;
}

#price-assist-heading > h3 {
  margin-left: 32px;
  font-size: 25px;
}

#price-assist-close-icon {
  position: absolute;
  margin-left: 250px;
  font-size: 40px;
}
</style>
