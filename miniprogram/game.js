import * as cloud from './shared/cloud.js'
import drawBackground from './modules/background.js'
import drawHead from './modules/head.js'
import drawChessmen from './modules/chessmen.js'

async function main () {
  const { db } = cloud

  await drawBackground()
  await drawHead()
  await drawChessmen()
}

main()
