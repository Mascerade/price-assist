import Vue from 'vue'
import App from './PopupApp'
import { bus } from '../bus'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})

chrome.runtime.sendMessage({ message: 'get profile' }, function (response) {
  bus.popupSendProfile(response.profile)
})
