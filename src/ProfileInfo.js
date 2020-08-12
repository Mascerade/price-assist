// The Profile class is an organized way of storing the user's profile information

class Profile {
  static signedIn = false
  static profileImg = ''
  static displayName = ''
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

  static clearData () {
    this.signedIn = false
    this.profileImg = ''
    this.displayName = ''
    this.savedProducts = []
    this.itemModelToTitle = {}
  }
}

export { Profile }
