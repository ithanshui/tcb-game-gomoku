import canvas from './../shared/canvas.js'
import { getWindowRect } from './../shared/util.js'
import { HEAD_COLOR } from './../shared/contants.js'

async function drawText(text) {
  const { winWidth, winHeight } = await getWindowRect()
  const ctx = canvas.getContext('2d')
  ctx.textAlign = 'center'
  ctx.font = "16px Arial"
  ctx.fillStyle = 'white'
  ctx.fillText(text, winWidth * 0.5, winHeight * 0.08)
}

export default async function drawHead() {
  const { winWidth, winHeight } = await getWindowRect()
  const context = canvas.getContext('2d')
  context.fillStyle = HEAD_COLOR
  context.fillRect(0, 0, winWidth, winHeight * 0.2)

  drawText('在线对战五子棋')
}