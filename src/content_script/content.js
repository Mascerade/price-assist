import Vue from 'vue';
import Content from './ContentApp';
import { amazon } from './Amazon';

// const div = document.createElement('div');
// div.id = 'price-assist';
// document.getElementById('main').appendChild(div);

// /* eslint-disable no-new */
// new Vue({
//   el: '#price-assist',
//   render: h => {
//     return h(Content);
//   },
// });

amazon.extractAllInfo();
