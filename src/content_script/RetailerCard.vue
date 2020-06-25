<template>
  <div class="price-assist-card">
    <div class="price-assist-inner-card">
      <p class="price-assist-title">{{ retailer['title'] }}</p>
      <div class="price-assist-price-img-container">
        <p class="price-assist-price">Price: {{ retailer['price'] }}</p>
        <img class="price-assist-price-money-img" src="https://dl.dropbox.com/s/mcck683ko4gniuo/money_stack.png?dl=0" alt="Money" />
      </div>
      <a class="price-assist-product-button" :href="retailer['link']" target="_blank">Product 💰</a>
    </div>
    <hr class="price-assist-hr" />
  </div>
</template>

<script>
// import 'typeface-quicksand';
export default {
  props: ['retailer']
}
</script>

<style lang="css" scoped>
.price-assist-card {
  font-family: 'Quicksand';
  height: 140px;
  width: 100%;
  margin-bottom: 7px;
  border-radius: 8px;
}

.price-assist-inner-card {
  display: flex;
  flex-flow: column;
  padding-right: 5px;
  padding-left: 5px;
}

.price-assist-title {
  font-family: 'Quicksand';
  font-size: 24px;
  font-weight: 400;
  margin-top: 8px;
  margin-left: 8px;
  margin-bottom: 0;
}

.price-assist-price-img-container {
  display: flex;
  flex-flow: row;
  align-items: center;
}

.price-assist-price {
  font-family: 'Quicksand';
  font-size: 18px;
  font-weight: 400;
  margin-left: 8px;
  margin-top: 5px;
  padding-top: 8px;
}

.price-assist-price-money-img {
  height: 40px;
  animation: vertical-mover 1s infinite alternate;
  margin-left: 10px;
}

.price-assist-product-button {
  font-family: 'Quicksand';
  color: white;
  width: 100px;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 80px;
  padding-right: 80px;
  background-color: #06bcfb;
  background-image: linear-gradient(315deg, #06bcfb 0%, #4884ee 74%);
  border-radius: 8px;
  font-size: 18px;
}

.price-assist-product-button:active,
.price-assist-product-button:link,
.price-assist-product-button:visited {
  color: white;
}

.price-assist-product-button:hover {
  cursor: pointer;
}

.price-assist-product-button:link {
  text-decoration: none;
}

.price-assist-hr {
  width: 90%;
  border-top: 0;
  border-right: 0;
  border-left: 0;
  height: 1px;
}
</style>

<style lang="css" scoped>
* {
  all: initial;
  * {
    all: unset;
  }
}
</style>
