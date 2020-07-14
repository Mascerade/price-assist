class Profile {
  static signedIn = false
  static profileImg = ''
  static displayname = ''
  static savedProducts = []
  static itemModelToTitle = {}

  static getAllData () {
    return {
      signedIn: this.signedIn,
      profileImg: this.profileImg,
      displayName: this.displayName,
      savedProducts: this.savedProducts,
      itemModelToTitle: this.itemModelToTitle
    }
  }
}

export { Profile }
