import canvas from './../shared/canvas.js'
import { getWindowRect } from './../shared/util.js'
import { HEAD_COLOR } from './../shared/contants.js'

class Chessmen {
  constructor(winWidth, winHeight) {
    console.log(winWidth, winHeight)
    this.x = 0.05 * winWidth
    this.y = 0.15 * winHeight
    this.width = 0.9 * winWidth
    this.height = 0.8 * winHeight

    this.titleHeight = 0.3 * this.height
    this.mainHeight = 0.7 * this.height

    this.titleCanvas = wx.createCanvas()
    this.mainCanvas = wx.createCanvas()
  }

  drawTitle(title) {
    const ctx = this.titleCanvas.getContext('2d')
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, this.width, this.titleHeight)

    const ctx2 = this.titleCanvas.getContext('2d')
    ctx2.fillStyle = 'white'
    ctx2.textAlign = 'center'
    ctx2.font = "18px Arial"
    ctx2.fillStyle = 'black'
    ctx2.fillText('⌛️ 等待对手 ⌛️', this.width * 0.5, this.titleHeight * 0.5)
  }
  
  drawMain(num = 15) {
    // const ctx = this.mainCanvas.getContext('2d')
    // ctx.fillStyle = 'green'
    // ctx.fillRect(0, 0, this.width, this.mainHeight)

    // 绘制棋盘背景
    const ctx1 = this.mainCanvas.getContext('2d')
    const width = num * 20,
      height = num * 20
    const x = (this.width - width) / 2,
      y = (this.mainHeight - height) / 2

    ctx1.fillStyle = '#ffc53d'
    ctx1.fillRect(x, y, width, height)

    // 绘制棋盘线条 
    const ctx2 = this.mainCanvas.getContext('2d')
    const padding = 10
    for (let i = 0; i < num; ++i) {
      // 水平线条
      ctx2.moveTo(padding + x, y + padding + i * 20)
      ctx2.lineTo(x + 290, y + padding + i * 20)
      ctx2.stroke()
      
      // 垂直线条
      ctx2.moveTo(padding + i * 20 + x, padding + y)
      ctx2.lineTo(padding + i * 20 + x, y + 290)
      ctx2.stroke()
    }
  }

  async draw() {
    this.drawTitle()
    this.drawMain(15)
    
    const ctx = canvas.getContext('2d')
    ctx.drawImage(
      this.titleCanvas, 
      0, 0, this.width, this.titleHeight, 
      this.x, this.y, this.width, this.titleHeight
    )
    ctx.drawImage(
      this.mainCanvas, 
      0, 0, this.width, this.mainHeight, 
      this.x, this.y + this.titleHeight, this.width, this.mainHeight
    )
  }
}

export default async function drawChessmen () {
  const { winWidth, winHeight } = await getWindowRect()
  const chessmen = new Chessmen(winWidth, winHeight)
  await chessmen.draw()
}