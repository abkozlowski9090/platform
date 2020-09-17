import Isotope from 'isotope-layout'
import imagesLoaded from 'imagesloaded'
// import detectIt from 'detect-it'

export default class masonrygrid {
  constructor(el) {
    const masoryEl = el

    imagesLoaded( masoryEl, function(e) {
      setupMasonryLayout()
    });

    function setupMasonryLayout() {
      let iso = new Isotope( masoryEl, {
        itemSelector: '.archive-listing',
        percentPosition: true,
        layoutMode: 'masonry',
        masonry: {
          columnWidth: '.grid-sizer'
        }
      });
    }

  }
}
