const FontFaceObserver = require('fontfaceobserver')

const Fonts = () => {
  let link = document.createElement('link')
  link.href = 'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,300i,400,400i,600,600i,700,700i'
  link.rel = 'stylesheet'

  document.head.appendChild(link)

  link = document.createElement('link')
  link.href = 'https://fonts.googleapis.com/css?family=Fira+Mono:400,600,700'
  link.rel = 'stylesheet'

  document.head.appendChild(link)

  const sourceSans = new FontFaceObserver('Source Sans Pro')

  sourceSans.load().then(() => {
    document.documentElement.classList.add('loaded')
  })
}

export default Fonts