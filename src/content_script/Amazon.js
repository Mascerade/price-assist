class Amazon {
  constructor() {
    this.itemModel;
  }

  getItemModel() {
    const rowContent = document.getElementsByClassName('a-size-base');

    // Gets the item_model through this loop
    for (let i = 0; i < rowContent.length; i++) {
      if (rowContent[i].textContent.includes('Item model number')) {
        this.itemModel = rowContent[i + 1].textContent;
      }
    }
  }
}

const amazon = new Amazon();

export { amazon };
