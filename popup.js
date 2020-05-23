// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCrRLkjeoTBbhl64pejxogzaRZ3CZWGNl4",
  authDomain: "price-assist-1a368.firebaseapp.com",
  databaseURL: "https://price-assist-1a368.firebaseio.com",
  projectId: "price-assist-1a368",
  storageBucket: "price-assist-1a368.appspot.com",
  messagingSenderId: "845920076305",
  appId: "1:845920076305:web:ea25f99645ffeaa044a7b0",
  measurementId: "G-VB5F70PF1H"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var provider = new firebase.auth.GoogleAuthProvider();

console.log('about to send message')

signInButton = document.getElementById("sign-in")
signInButton.addEventListener("click", sendFirebase);

function sendFirebase () {
  chrome.runtime.sendMessage({
    msg: "sign in",
    function (response) {}
  })
}