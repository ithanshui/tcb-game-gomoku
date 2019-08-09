import './sdk/cloudsdk.js'
import main from './modules/main'
import chessmen from './modules/chessmen'

wx.onTouchStart(event => {
  const { pageX, pageY } = event.changedTouches[0]
  console.log(chessmen.putDown(pageX, pageY, 'white'))
  main.render()
})

// const canvas = wx.createCanvas()
// const ctx = canvas.getContext('2d')

// const canvas2 = wx.createCanvas()
// const ctx2 = canvas2.getContext('2d')

// const { windowHeight, windowWidth } = wx.getSystemInfoSync()

// function clearAll() {
//   ctx.clearRect(0, 0, windowWidth, windowHeight)
// }

// function drawBackground() {
//   ctx.fillStyle = 'white'
//   ctx.fillRect(0, 0, windowWidth, windowHeight)
// }

// function drawRect(pageX, pageY) {
//   ctx2.beginPath()
//   ctx2.fillStyle = 'blue'
//   // ctx2.fillRect(0, 0, 20, 20)
//   ctx2.arc(pageX, pageY, 8, 0, 2 * Math.PI)
//   ctx2.fill()

//   ctx.drawImage(
//     canvas2,
//     0, 0, 20, 20,
//     pageX, pageY, 20, 20
//   )
//   console.log('test')
// }

// clearAll()
// drawBackground()

// wx.onTouchStart(event => {
//   const { pageX, pageY } = event.changedTouches[0]
//   clearAll()
//   drawBackground()
//   drawRect(pageX, pageY)
// })