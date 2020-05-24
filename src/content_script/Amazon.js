/* eslint-disable no-unused-expressions */
var BreakException = {};
class Amazon {
  constructor() {
    this.category;
    this.price;
    this.title;
    this.itemModel;
    this.imgSrc;
    this.validCategories = ['All', 'Electronics', 'Computers'];
  }

  extractCategory() {
    const allOptions = document.getElementsByTagName('option');
    try {
      allOptions.forEach(option => {
        if (option.selected) {
          this.category = option.textContent.trim();
          throw BreakException;
        }
      });
    } catch (e) {
      if (e !== BreakException) throw e;
    }
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
    this.price = this.price.trim();
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

  extractAllInfo() {
    this.extractPrice();
    this.extractTitle();
    this.extractItemModel();
    this.extractImgSrc();
    console.log(`Price: ${this.price} \nItem Model: ${this.itemModel} \nTitle: ${this.title} \nImage Source: ${this.imgSrc}`);
  }
}

const amazon = new Amazon();

export { amazon };
