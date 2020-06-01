/* eslint-disable no-unused-vars */
import * as firebase from 'firebase/app';
import 'firebase/auth';

// Create Firebase Configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCrRLkjeoTBbhl64pejxogzaRZ3CZWGNl4',
  authDomain: 'price-assist-1a368.firebaseapp.com',
  databaseURL: 'https://price-assist-1a368.firebaseio.com',
  projectId: 'price-assist-1a368',
  storageBucket: 'price-assist-1a368.appspot.com',
  messagingSenderId: '845920076305',
  appId: '1:845920076305:web:ea25f99645ffeaa044a7b0',
  measurementId: 'G-VB5F70PF1H',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let portFromCS;
global.browser = require('webextension-polyfill');

chrome.runtime.onConnect.addListener(connected);

function connected(p) {
  portFromCS = p;
  portFromCS.onMessage.addListener(message => {
    console.log(message);
    if (message.message === 'get data') {
      const networkScrapers = new XMLHttpRequest();
      const processScrapers = new XMLHttpRequest();
      const localServer = 'localhost:5000';
      const timelessServer = 'timeless-apps.com:5000';
      const piDevServer = '10.0.0.203:5000';

      const url1 =
        'http://' +
        piDevServer +
        '/price-assist/api/network-scrapers' +
        '?retailer=' +
        message.retailer +
        '&item_model=' +
        message.itemModel +
        '&price=' +
        message.price +
        '&title=' +
        message.title +
        '&image=' +
        message.imgSrc +
        '&return_type=json';

      const url2 =
        'http://' +
        piDevServer +
        '/price-assist/api/process-scrapers' +
        '?retailer=' +
        message.retailer +
        '&item_model=' +
        message.itemModel +
        '&price=' +
        message.price +
        '&title=' +
        message.title +
        '&return_type=json';

      networkScrapers.open('GET', url1);
      processScrapers.open('GET', url2);
      networkScrapers.send();
      processScrapers.send();

      networkScrapers.onload = e => {
        // When the request to the server is done, process the data here
        console.log('here in network');
        console.log(networkScrapers.response);
        portFromCS.postMessage({ message: 'add retailers', data: JSON.parse(networkScrapers.responseText) });
      };

      processScrapers.onload = e => {
        console.log('here in process');
        console.log(processScrapers.response);
        portFromCS.postMessage({ message: 'add retailers', data: JSON.parse(processScrapers.responseText) });
      };
    }
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('here');
});
