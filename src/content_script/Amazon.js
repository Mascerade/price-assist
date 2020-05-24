/* eslint-disable no-unused-expressions */

class Amazon {
  constructor() {
    this.category;
    this.price;
    this.title;
    this.itemModel;
    this.imgSrc;
  }

  extractCategory() {
    this.category = document.getElementsByClassName('nav-search-label')[0].textContent;
  }

  extractPrice() {
    // The reason for all the catch cases is because the price can have a very wide
    // selection of id's
    try {
      // Gets the price
      this.price = document.getElementById('priceblock_ourprice').textContent;
    } catch (err) {
      try {
        // In case the priceblock_ourprice doesn't contian the price, get the dealprice instead (backup)
        this.price = document.getElementById('priceblock_dealprice').textContent;
      } catch (err) {
        try {
          this.price = document.getElementById('priceblock_saleprice').textContent;
        } catch (err) {
          try {
            this.price = document.getElementById('availability').textContent;
          } catch (err) {
            this.price = 'Price Not Available';
          }
        }
      }
    }
  }

  extractTitle() {
    this.title = document.getElementById('productTitle').textContent.trim();
  }

  extractItemModel() {
    const rowContent = document.getElementsByClassName('a-size-base');
    // Gets the item_model through this loop
    for (let i = 0; i < rowContent.length; i++) {
      if (rowContent[i].textContent.includes('Item model number')) {
        this.itemModel = rowContent[i + 1].textContent.trim();
      }
    }
  }

  extractImgSrc() {
    this.imgSrc = document.getElementById('landingImage').src;
  }
}

const amazon = new Amazon();

export { amazon };
