import Flickity from 'flickity'
require('flickity-imagesloaded')

export default class testimonialsslider {
  constructor(el) {

    var flkty = new Flickity( el, {
      cellAlign: 'left',
      contain: true,
      fade: true,
      wrapAround: true,
      adaptiveHeight: false,
      pageDots: true,
      prevNextButtons: false,
    });
  }
}
