<template>
  <footer class="unset" id="price-assist-footer">
    <a target="_blank" href="http://www.timeless-apps/track-prices/index.html">Track Prices</a>
    <p>|</p>
    <a v-if="!productSaved" @click.prevent="saveProduct" href="">Save Product</a>
    <a v-else @click.prevent="removeProduct" href="">Unsave Product</a>
  </footer>
</template>

<script>
import { bus } from './bus';
export default {
  props: ['productSaved'],
  methods: {
    saveProduct() {
      bus.sendSaveProduct();
    },
    removeProduct() {
      bus.sendRemoveProduct();
    },
  },
};
</script>

<style lang="css">
#price-assist-footer {
  display: flex;
  height: 40px;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

#price-assist-footer > a {
  margin-right: 3%;
  margin-left: 3%;
  padding: 7px;
  font-family: 'Muli';
  background-color: #f977ce;
  background-image: linear-gradient(315deg, #f977ce 0%, #c373f2 74%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

#price-assist-footer > p {
  font-family: 'Muli';
  background-color: #f977ce;
  background-image: linear-gradient(315deg, #f977ce 0%, #c373f2 74%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 25px;
}

.unset {
  all: initial;
  * {
    all: unset;
  }
}
</style>
