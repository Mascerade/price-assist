import Vue from 'vue';
import Content from './ContentApp';
import { getData } from './eventBus'

const div = document.createElement('div');
div.id = 'price-assist';
document.getElementById('main').appendChild(div);

/* eslint-disable no-new */
var app = new Vue({
  el: '#price-assist',
  render: h => {
    return h(Content);
  },
});

getData();
