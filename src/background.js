/* eslint-disable no-unused-vars */
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

// Consts for the different servers
const localServer = 'localhost';
const timelessServer = 'timeless-apps.com';
const piDevServer = '10.0.0.203';
var currentItemModel;
const retailerData = {};

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

// This is the port used for the content script communication
var portFromCS;
global.browser = require('webextension-polyfill');

chrome.runtime.onConnect.addListener(connected);

function connected(p) {
  portFromCS = p;
  portFromCS.onMessage.addListener(message => {
    console.log(message);
    if (message.message === 'get data') {
      // Make request to the network and process scrapers
      const networkScrapers = new XMLHttpRequest();
      const processScrapers = new XMLHttpRequest();
      retailerData.itemModel = message.itemModel;
      retailerData.retailer = message.retailer;
      retailerData.price = message.price;
      checkProductSaved();

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
        // After getting the network scrapers, send it to the GUI
        console.log('here in network');
        console.log(networkScrapers.response);
        portFromCS.postMessage({ message: 'add retailers', data: JSON.parse(networkScrapers.responseText) });
      };

      processScrapers.onload = e => {
        // After getting the process scrapers, send it to the GUI
        console.log('here in process');
        console.log(processScrapers.response);
        portFromCS.postMessage({ message: 'add retailers', data: JSON.parse(processScrapers.responseText) });
      };
    } else if (message.message === 'save product') {
      // Make a PUT request that saves the item model to the user's database
      if (firebase.auth().currentUser != null) {
        firebase
          .auth()
          .currentUser.getIdToken(/* forceRefresh */ true)
          .then(function(idToken) {
            const sendItemModel = new XMLHttpRequest();
            sendItemModel.open('PUT', 'http://' + piDevServer + ':5002');
            sendItemModel.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            sendItemModel.send(JSON.stringify({ uid_token: idToken, item_model: message.itemModel }));
            sendItemModel.onload = e => {
              console.log(sendItemModel.response, sendItemModel.status);
              if (sendItemModel.status === 204) {
                // Send back the fact that we saved the product
                portFromCS.postMessage({ message: 'saved product', onlyToggle: false });
              } else if (sendItemModel.status === 404) {
                // Send back the fact that the user is not signed in
                portFromCS.postMessage({ message: 'need to create account' });
              }
            };
          });
      } else {
        // Send back the fact that the user is not signed in
        console.log('You must authenticate with Google by clicking on the Chrome Extension icon.');
        portFromCS.postMessage({ message: 'need to create account' });
      }
    } else if (message.message === 'remove product') {
      // Make a DELETE request to remove the product from the user
      if (firebase.auth().currentUser != null) {
        firebase
          .auth()
          .currentUser.getIdToken(/* forceRefresh */ true)
          .then(function(idToken) {
            const deleteReq = new XMLHttpRequest();
            deleteReq.open('DELETE', 'http://' + piDevServer + ':5002/del_item_model');
            deleteReq.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            deleteReq.send(JSON.stringify({ uid_token: idToken, item_model: message.itemModel }));
            deleteReq.onload = e => {
              console.log(deleteReq.response, deleteReq.status);
              if (deleteReq.status === 204) {
                portFromCS.postMessage({ message: 'removed product' });
              }
            };
          });
      }
    }
  });
}

// The chrome messages are used for communcation with the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request.message);
  if (request.message === 'sign in') {
    // Signs the user through their Google account and also creates
    // the user in our backend if they do not already exist
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        const token = result.credential.accessToken;
        const user = result.user;
        checkProductSaved();
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = error.credential;
      });
  } else if (request.message === 'set data') {
    // Used simply to check if a user is signed in
    if (firebase.auth().currentUser != null) {
      console.log('authenticated!');
    } else {
      console.log('unauthenticated!');
    }
  } else if (request.message === 'sign out') {
    // Simply signs the user out of the application
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

function checkProductSaved() {
  if (firebase.auth().currentUser != null) {
    firebase
      .auth()
      .currentUser.getIdToken(/* forceRefresh */ true)
      .then(function(idToken) {
        const sendUID = new XMLHttpRequest();
        sendUID.open('GET', 'http://' + piDevServer + ':5002?uid_token=' + idToken);
        sendUID.send();
        sendUID.onload = e => {
          if (sendUID.status === 200) {
            const data = JSON.parse(sendUID.responseText);
            data.item_models.forEach(itemModel => {
              console.log(retailerData.itemModel, itemModel);
              if (retailerData.itemModel === itemModel) {
                portFromCS.postMessage({ message: 'saved product', onlyToggle: true });
              }
            });
            // If there was problem getting the data from the user
            // it means that the user does not exist, so we need to make
            // a POST request
          } else if (sendUID.status === 404) {
            createNewUser(idToken);
          }
          console.log(sendUID.response, sendUID.status);
        };
      })
      .catch(function(error) {
        // Handle error
        console.log('Error singing in: ', error);
      });
  }
}

function createNewUser(idToken) {
  // Add a user using the uid token
  const postUser = new XMLHttpRequest();
  postUser.open('POST', 'http://' + piDevServer + ':5002');
  postUser.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  postUser.send(JSON.stringify({ uid_token: idToken }));
  postUser.onload = e => {
    console.log(postUser.response, postUser.status);
  };
}
