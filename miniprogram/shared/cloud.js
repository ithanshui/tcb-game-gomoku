import config from './config.js'

let loaded = false

if (!loaded) {
  wx.cloud.init({
    env: config.env
  })
  loaded = true
}

export const db = wx.cloud.database()

export const $ = db.command.aggregate