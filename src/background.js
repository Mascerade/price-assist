/* eslint-disable no-unused-vars */
import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { Profile } from './ProfileInfo'

// Consts for the different servers
const localServer = 'localhost'
const timelessServer = 'timeless-apps.com'
const piDevServer = '10.0.0.203'
var currentUser
const retailerData = {}

// Create Firebase Configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCrRLkjeoTBbhl64pejxogzaRZ3CZWGNl4',
  authDomain: 'price-assist-1a368.firebaseapp.com',
  databaseURL: 'https://price-assist-1a368.firebaseio.com',
  projectId: 'price-assist-1a368',
  storageBucket: 'price-assist-1a368.appspot.com',
  messagingSenderId: '845920076305',
  appId: '1:845920076305:web:ea25f99645ffeaa044a7b0',
  measurementId: 'G-VB5F70PF1H'
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

// Database reference
var database = firebase.database()

// This is the port used for the content script communication
var portFromCS
global.browser = require('webextension-polyfill')

chrome.runtime.onConnect.addListener(connected)

// Event handler for if the user signs in or out
firebase.auth().onAuthStateChanged(function (user) {
  console.log(user)
  if (user) {
    currentUser = user
    Profile.signedIn = true
    Profile.displayName = user.displayName
    Profile.profileImg = user.photoURL
    checkProductSaved()
    console.log(Profile.profileImg)
  }
})

/*
This port is connected to the CONTENT SCRIPT only.
It serves the purpose of:
  * Making requests to the server in order to get retailer data ('get data')
  * Saving products when the user clicks the 'Save Product' button ('save product')
  * Removing a product when the user clicks 'Unsave Product' ('Remove Product')
*/
function connected (p) {
  portFromCS = p
  portFromCS.onMessage.addListener(message => {
    console.log(message)
    if (message.message === 'get data') {
      // Make request to the network and process scrapers
      const networkScrapers = new XMLHttpRequest()
      const processScrapers = new XMLHttpRequest()
      retailerData.itemModel = message.itemModel
      retailerData.retailer = message.retailer
      retailerData.price = message.price
      checkProductSaved()

      const url1 =
        'http://' +
        localServer +
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
        '&return_type=json'

      const url2 =
        'http://' +
        localServer +
        ':5000/price-assist/api/process-scrapers' +
        '?retailer=' +
        message.retailer +
        '&item_model=' +
        message.itemModel +
        '&price=' +
        message.price +
        '&title=' +
        message.title +
        '&return_type=json'

      networkScrapers.open('GET', url1)
      processScrapers.open('GET', url2)
      networkScrapers.send()
      processScrapers.send()

      networkScrapers.onload = e => {
        // After getting the network scrapers, send it to the GUI
        console.log('here in network')
        console.log(networkScrapers.response)
        portFromCS.postMessage({ message: 'add retailers', data: JSON.parse(networkScrapers.responseText) })
      }

      processScrapers.onload = e => {
        // After getting the process scrapers, send it to the GUI
        console.log('here in process')
        console.log(processScrapers.response)
        portFromCS.postMessage({ message: 'add retailers', data: JSON.parse(processScrapers.responseText) })
      }
    } else if (message.message === 'save product') {
      // Make a PUT request that saves the item model to the user's database
      if (currentUser != null) {
        currentUser.getIdToken(/* forceRefresh */ true)
          .then(function (idToken) {
            // Create the request
            const sendItemModel = new XMLHttpRequest()
            sendItemModel.open('PUT', 'http://' + piDevServer + ':5002')
            sendItemModel.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
            sendItemModel.send(JSON.stringify({ uid_token: idToken, item_model: message.itemModel }))
            sendItemModel.onload = e => {
              console.log(sendItemModel.response, sendItemModel.status)
              if (sendItemModel.status === 204) {
                // Save the item model in Profile and send back the fact that we saved the product
                Profile.savedProducts.push(message.itemModel)
                portFromCS.postMessage({ message: 'saved product', onlyToggle: false })
              } else if (sendItemModel.status === 404) {
                // Send back the fact that the user is not signed in
                portFromCS.postMessage({ message: 'need to create account' })
              }
            }
          })

        // Update the item model to title object in the Profile class
        getItemModelToTitle()
      } else {
        // Send back the fact that the user is not signed in
        console.log('You must authenticate with Google by clicking on the Chrome Extension icon.')
        portFromCS.postMessage({ message: 'need to create account' })
      }
    } else if (message.message === 'remove product') {
      // Make a DELETE request to remove the product from the user
      if (currentUser != null) {
        removeItemModel(message.itemModel)
      }
    }
  })
}

// The chrome messages are used for communcation with the POPUP
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request.message)
  // Signs the user through their Google account and also creates
  // the user in our backend if they do not already exist
  if (request.message === 'sign in') {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        const token = result.credential.accessToken
        const user = result.user
        checkProductSaved()
      })
      .catch(error => {
        const errorCode = error.code
        const errorMessage = error.message
        const email = error.email
        const credential = error.credential
      })
  } else if (request.message === 'sign out') {
    // Signs the user out of the application
    firebase
      .auth()
      .signOut()
      .then(function () {
        Profile.clearData()
        console.log('successfully signed out')
      })
      .catch(function (error) {
        console.log(error)
      })
  } else if (request.message === 'get profile') {
    // Sends the profile data to the popup
    console.log(Profile.getAllData())
    const profile = Profile.getAllData()
    if (profile.signedIn) {
      sendResponse({ profile: profile })
    }
  } else if (request.message === 'remove product') {
    // Removes a given item model (sent by the popup)
    // removeItemModel returns a promise, so we have to wait for the response
    removeItemModel(request.itemModel).then(function (result) {
      if (result) {
        // Send back the profile
        sendResponse({ profile: Profile.getAllData() })
      }
    })
    // Makes sure that the message port stays open
    return true
  }
})

/*
Checks if the current product is saved or not.
This is used to change the content script GUI to either
'Unsave Product' or 'Save Product'.
This is run anytime the user signs in
*/
function checkProductSaved () {
  if (currentUser != null) {
    currentUser.getIdToken(/* forceRefresh */ true)
      .then(function (idToken) {
        // Creates the request to the user database
        const sendUID = new XMLHttpRequest()
        sendUID.open('GET', 'http://' + piDevServer + ':5002?uid_token=' + idToken)
        sendUID.send()
        sendUID.onload = e => {
          if (sendUID.status === 200) {
            const data = JSON.parse(sendUID.responseText)
            // Add the item models saved to the accounts to savedProducts to use in the popup
            Profile.savedProducts = data.item_models

            // If the current item model is in the list of item models already saved,
            // change the GUI
            data.item_models.forEach(itemModel => {
              console.log(retailerData.itemModel, itemModel)
              if (retailerData.itemModel === itemModel) {
                portFromCS.postMessage({ message: 'saved product', onlyToggle: true })
              }
            })

            // If there was problem getting the data from the user
            // it means that the user does not exist, so we need to make
            // a POST request
          } else if (sendUID.status === 404) {
            createNewUser(idToken)
          }
          console.log(sendUID.response, sendUID.status)
        }
      })
      .catch(function (error) {
        // Handle error
        console.log('Error singing in: ', error)
      })

    getItemModelToTitle()
  }
}

function removeItemModel (itemModel) {
  return new Promise(resolve => {
    currentUser.getIdToken(/* forceRefresh */ true)
      .then(function (idToken) {
        const deleteReq = new XMLHttpRequest()
        deleteReq.open('DELETE', 'http://' + piDevServer + ':5002/del_item_model')
        deleteReq.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
        deleteReq.send(JSON.stringify({ uid_token: idToken, item_model: itemModel }))
        deleteReq.onload = e => {
          console.log(deleteReq.response, deleteReq.status)
          if (deleteReq.status === 204) {
          // Remove the product from savedProducts in Profile and send the GUI that we removed the product
            for (let i = 0; i < Profile.savedProducts.length; i++) {
              if (Profile.savedProducts[i] === itemModel) {
                Profile.savedProducts.splice(i, 1)
              }
            }
            // Only if the content script has the item model, send a message to change the footer to Unsave
            if (itemModel === retailerData.itemModel) {
              portFromCS.postMessage({ message: 'removed product' })
            }
            // For the deleting from the popup, we want to know whether or not is succeeded
            resolve(true)
          } else if (deleteReq.status === 404) {
            resolve(false)
          }
        }
      })
  })
}

function createNewUser (idToken) {
  // Add a user using the uid token
  const postUser = new XMLHttpRequest()
  postUser.open('POST', 'http://' + piDevServer + ':5002')
  postUser.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
  postUser.send(JSON.stringify({ uid_token: idToken }))
  postUser.onload = e => {
    console.log(postUser.response, postUser.status)
  }
}

function getItemModelToTitle () {
  // Get the item model to title JSON for the popup
  const getTitles = new XMLHttpRequest()
  getTitles.open('GET', 'http://' + piDevServer + ':5003/item_model_data')
  getTitles.send()
  getTitles.onload = e => {
    if (getTitles.status === 200) {
      const data = JSON.parse(getTitles.responseText)
      Profile.itemModelToTitle = data
    }
  }
}
