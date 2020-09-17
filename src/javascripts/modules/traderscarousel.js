import Flickity from 'flickity'
require('flickity-imagesloaded')
import detectIt from 'detect-it'

export default class traderscarousel {
  constructor(el) {
    let prevBtns = el.getElementsByClassName("js-prev")
    let nextBtns = el.getElementsByClassName("js-next")

    var flkty = new Flickity( el, {
      cellAlign: 'left',
      draggable: true,
      groupCells: 4,
      groupCells: true,
      pageDots: false,
      imagesLoaded: true,
      prevNextButtons: detectIt.hasTouch,
      wrapAround: false,
    });

    for (let prevBtn of prevBtns) {
  prevBtn.addEventListener('click', e => {
    e.preventDefault()
    flkty.previous()
  })
}
  for (let nextBtn of nextBtns) {
    nextBtn.addEventListener('click', e => {
      e.preventDefault()
      flkty.next()
    })
  }


  }
}
