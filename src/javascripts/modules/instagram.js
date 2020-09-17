require('instafetch.js');

export default class Instagram {
  constructor(el) {
    let accessToken = "3103181559.1677ed0.261c1993e8964a3583ba387912c2c52e"

    // Initialize Instafeed.js
    let feed = instafetch.init({
      accessToken: accessToken,
      target: 'instafetch',
      numOfPics: 4,
      caption: false
    })


  }
}
