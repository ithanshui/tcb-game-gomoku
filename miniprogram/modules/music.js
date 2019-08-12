import { getTempFileURL } from './../shared/cloud.js'
import config from './../shared/config.js'

const { fallAudioID, bgAudioID } = config.audio

class Music {
  constructor() {
    this.fallAudio = wx.createInnerAudioContext()
    this.bgAudio = wx.createInnerAudioContext()
    this.init()
  }

  async init() {
    // 任务
  }

  playFallAudio() {
    this.fallAudio.play()
  }

  playBgAudio() {
    this.bgAudio.play()
  }
}

const music = new Music()
wx.onShow(() => music.playBgAudio())
wx.onAudioInterruptionEnd(() => music.playBgAudio())

export default music
