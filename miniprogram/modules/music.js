const FALL_AUDIO_URL = '/audio/fall.mp3'
const BG_AUDIO_URL = '/audio/bgm.mp3'

class Music {
  constructor() {
    this.fallAudio = wx.createInnerAudioContext()
    this.fallAudio.autoplay = false
    this.fallAudio.loop = false
    this.fallAudio.src = FALL_AUDIO_URL

    this.bgAudio = wx.createInnerAudioContext()
    this.bgAudio.autoplay = true
    this.bgAudio.loop = true
    this.bgAudio.volume = 0.2
    this.bgAudio.src = BG_AUDIO_URL
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
