/* eslint-disable no-unused-vars */
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

      portFromCS.postMessage({ message: 'add gui' });
      networkScrapers.open('GET', url1);
      processScrapers.open('GET', url2);
      networkScrapers.send();
      processScrapers.send();

      networkScrapers.onload = e => {
        // When the request to the server is done, process the data here
        console.log('here in network');
        console.log(networkScrapers.response);
      };

      processScrapers.onload = e => {
        console.log('here in process');
        console.log(processScrapers.response);
      };
    }
  });
}
