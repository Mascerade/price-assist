import Vue from 'vue';
import Content from './ContentApp';
import { amazon } from './Amazon';

const retailerDict = {
  Amazon: amazon,
};

let retailerName;
const url = window.location.toString();
if (url.includes('www.amazon.com')) {
  retailerName = 'Amazon';
}

const retailer = retailerDict[retailerName];
retailer.extractAllInfo();

const div = document.createElement('div');
div.id = 'price-assist';
document.getElementsByTagName('body')[0].appendChild(div);

/* eslint-disable no-new */
new Vue({
  el: '#price-assist',
  render: h => {
    return h(Content);
  },
});
