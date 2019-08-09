import './sdk/cloudsdk.js'
import drawBackground from './modules/background.js'
import drawHead from './modules/head.js'
import chessmen from './modules/chessmen.js'
import player from './modules/palyer.js'

async function main () {
  await drawBackground()
  await drawHead()
  chessmen.draw()
}

main()
