/* eslint-disable no-unused-vars */
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
var user;

// Consts for the different servers
const localServer = 'localhost';
const timelessServer = 'timeless-apps.com';
const piDevServer = '10.0.0.203';

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

// Database reference
var database = firebase.database();

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

      const url1 =
        'http://' +
        piDevServer +
        ':5000/price-assist/api/network-scrapers' +
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
        ':5000/price-assist/api/process-scrapers' +
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
    } else if (message.message === 'save product') {
      if (firebase.auth().currentUser != null) {
        firebase
          .auth()
          .currentUser.getIdToken(/* forceRefresh */ true)
          .then(function(idToken) {
            const sendItemModel = new XMLHttpRequest();
            sendItemModel.open('PUT', 'http://' + localServer + ':5002');
            sendItemModel.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            sendItemModel.send(JSON.stringify({ uid_token: idToken, item_model: message.itemModel }));
            sendItemModel.onload = e => {
              console.log(sendItemModel.response, sendItemModel.status);
            };
          });
      } else {
        console.log('You must authenticate with Google by clicking on the Chrome Extension icon.');
      }
    }
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request.message);
  if (request.message === 'sign in') {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        const token = result.credential.accessToken;
        user = result.user;
        firebase
          .auth()
          .currentUser.getIdToken(/* forceRefresh */ true)
          .then(function(idToken) {
            const sendUID = new XMLHttpRequest();
            sendUID.open('GET', 'http://' + localServer + ':5002?uid_token=' + idToken);
            sendUID.send();
            sendUID.onload = e => {
              if (sendUID.status === 404) {
                createNewUser(idToken);
              }
              console.log(sendUID.response, sendUID.status);
            };
          })
          .catch(function(error) {
            // Handle error
            console.log('Error singing in: ', error);
          });
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = error.credential;
      });
  } else if (request.message === 'set data') {
    if (firebase.auth().currentUser != null) {
      console.log('authenticated!');
    } else {
      console.log('unauthenticated!');
    }
  } else if (request.message === 'sign out') {
    firebase
      .auth()
      .signOut()
      .then(function() {
        console.log('successfully signed out');
      })
      .catch(function(error) {
        console.log(error);
      });
  }
});

function createNewUser(idToken) {
  const postUser = new XMLHttpRequest();
  postUser.open('POST', 'http://' + localServer + ':5002');
  postUser.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  postUser.send(JSON.stringify({ uid_token: idToken }));
  postUser.onload = e => {
    console.log(postUser.response, postUser.status);
  };
}
