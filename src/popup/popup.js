import Vue from 'vue'
import App from './App'
import { bus } from '../bus'

global.browser = require('webextension-polyfill')
Vue.prototype.$browser = global.browser

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})

chrome.runtime.sendMessage({ message: 'get profile' }, function (response) {
  bus.popupSendProfile(response.profile)
})
