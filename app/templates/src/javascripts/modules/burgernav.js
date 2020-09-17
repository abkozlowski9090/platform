import * as bodyScrollLock from 'body-scroll-lock'

export default class BurgerNav {
  constructor(el) {
    // https://www.npmjs.com/package/body-scroll-lock
    const disableBodyScroll = bodyScrollLock.disableBodyScroll
    const enableBodyScroll = bodyScrollLock.enableBodyScroll
    const targetElement = document.querySelector("#nav")

    el.addEventListener('click', (e) => {
      e.preventDefault()
      // Enable / Disable body scrolling if the nav is open/closed
      if(document.body.classList.contains('nav-closed')) {
        disableBodyScroll(targetElement);
      } else {
        enableBodyScroll(targetElement);
      }
      document.body.classList.toggle('nav-closed')
    })
  }
}
