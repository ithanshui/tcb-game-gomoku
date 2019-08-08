import canvas from './../shared/canvas.js'
import { getWindowRect, getWindowRectSync } from './../shared/util.js'
import { HEAD_COLOR } from './../shared/contants.js'

class Chessmen {
  constructor(winWidth, winHeight) {
    this.x = 0.05 * winWidth
    this.y = 0.15 * winHeight
    this.width = 0.9 * winWidth
    this.height = 0.8 * winHeight

    this.titleHeight = 0.3 * this.height
    this.mainHeight = 0.7 * this.height

    // 棋盘在其上canvas的偏移量
    this.chessmenOffX = 0
    this.chessmenOffY = 0
    this.chessmenPadding = 10
    this.chessmenLog = []

    for (let i = 0; i < 15; ++i) {
      this.chessmenLog[i] = []
      for (let j = 0; j < 15; ++j) {
        this.chessmenLog[i][j] = 0
      }
    }

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
    const ctx = this.mainCanvas.getContext('2d')
    ctx.fillStyle = 'green'
    ctx.fillRect(0, 0, this.width, this.mainHeight)

    // 绘制棋盘背景
    const ctx1 = this.mainCanvas.getContext('2d')
    const width = num * 20,
      height = num * 20
    
    this.chessmenOffX = (this.width - width) / 2
    this.chessmenOffY = (this.mainHeight - height) / 2

    ctx1.fillStyle = '#ffc53d'
    ctx1.fillRect(this.chessmenOffX, this.chessmenOffY, width, height)

    // 绘制棋盘线条 
    const ctx2 = this.mainCanvas.getContext('2d')

    for (let i = 0; i < num; ++i) {
      // 水平线条
      ctx2.moveTo(this.chessmenPadding + this.chessmenOffX, this.chessmenOffY + this.chessmenPadding + i * 20)
      ctx2.lineTo(this.chessmenOffX + 290, this.chessmenOffY + this.chessmenPadding + i * 20)
      ctx2.stroke()
      
      // 垂直线条
      ctx2.moveTo(this.chessmenPadding + i * 20 + this.chessmenOffX, this.chessmenPadding + this.chessmenOffY)
      ctx2.lineTo(this.chessmenPadding + i * 20 + this.chessmenOffX, this.chessmenOffY + 290)
      ctx2.stroke()
    }
  }

  _putDown(row, col, color) {
    if (col < 0 || col > 14 || row < 0 || row > 14) {
      return {
        success: false
      }
    }

    if (this.chessmenLog[col][row] === 1) {
      return {
        success: false
      }
    } else {
      this.chessmenLog[col][row] = 1
    }

    const circleY = this.chessmenPadding + this.chessmenOffY + row * 20
    const circleX = this.chessmenPadding + this.chessmenOffX + col * 20
    const R = 8

    const ctx = this.mainCanvas.getContext('2d')
    ctx.beginPath()
    ctx.arc(circleX, circleY, 8, 0, 2 * Math.PI, false)
    ctx.fillStyle = color || 'black'
    ctx.fill()

    const ctx2 = canvas.getContext('2d')
    ctx2.drawImage(
      this.mainCanvas,
      0, 0, this.width, this.mainHeight,
      this.x, this.y + this.titleHeight, this.width, this.mainHeight
    )

    return {
      success: true,
      col,
      row
    }
  }

  putDown(_x, _y, color) {
    // 计算(_x, _y)相当于Main部分的坐标值(x, y)
    const x = _x - this.x - this.chessmenOffX
    const y = _y - this.titleHeight - this.y - this.chessmenOffY
    if (x <= 0 || y <= 0) {
      return {
        success: false
      }
    }

    let col = Math.round((x - this.chessmenPadding) / 20),
      row = Math.round((y - this.chessmenPadding) / 20)

    return this._putDown(row, col, color)
  }

  draw() {
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

const { winWidth, winHeight } = getWindowRectSync()
const chessmen = new Chessmen(winWidth, winHeight)

export default chessmen