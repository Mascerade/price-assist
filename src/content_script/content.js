import Vue from 'vue';
import Content from './ContentApp'

const div = document.createElement("div")
div.id = "price-assist"
document.body.insertBefore(div, document.body.firstChild);

new Vue({
  el: "#price-assist",
  render: h => { return h(Content); }
});

