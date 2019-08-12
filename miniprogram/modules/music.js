import { getTempFileURL } from './../shared/cloud.js'
const FALL_AUDIO_ID = 'cloud://wuziqi-9koeb.7775-wuziqi-9koeb-1259633363/fall.mp3'
const BG_AUDIO_ID = 'cloud://wuziqi-9koeb.7775-wuziqi-9koeb-1259633363/bgm.mp3'

class Music {
  constructor() {
    this.fallAudio = wx.createInnerAudioContext()
    this.bgAudio = wx.createInnerAudioContext()
    this.init()
  }

  async init() {
    Promise.all([
      getTempFileURL(FALL_AUDIO_ID),
      getTempFileURL(BG_AUDIO_ID)
    ])
    .then(values => {
      const [fallUrl, bgUrl] = values
      if (bgUrl) {
        this.bgAudio.autoplay = true
        this.bgAudio.loop = true
        this.bgAudio.volume = 0.2
        this.bgAudio.src = bgUrl
      }

      if (fallUrl) {
        this.fallAudio.autoplay = false
        this.fallAudio.loop = false
        this.fallAudio.src = fallUrl
      }
    })
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
