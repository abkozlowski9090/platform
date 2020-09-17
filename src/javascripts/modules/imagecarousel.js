import Flickity from 'flickity'
require('flickity-imagesloaded')

export default class imagecarousel {
  constructor(el) {


    var flkty = new Flickity( el, {
      freeScroll: true,
      contain: true,
      pageDots: false,
      prevNextButtons: false,
      wrapAround: false,
      autoPlay: false,
      groupCells: true,
    });


  }
}
