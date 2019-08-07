import canvas from './../shared/canvas.js'
import { getWindowRect } from './../shared/util.js'
import { BG_COLOR } from './../shared/contants.js'

export default async function drawBackground() {
  const { winWidth, winHeight } = await getWindowRect()
  
  const context = canvas.getContext('2d')
  context.fillStyle = BG_COLOR
  context.fillRect(0, 0, winWidth, winHeight)
}