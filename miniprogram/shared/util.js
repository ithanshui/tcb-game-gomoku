let winWidth = 0,
  winHeight = 0

export async function getWindowRect() {
  const promise = new Promise(resolve => {
    if (winHeight || winWidth) {
      resolve({ winHeight, winWidth})
    }

    wx.getSystemInfo({
      success: function (res) {
        winHeight = res.windowHeight
        winWidth = res.windowWidth
        resolve({ winHeight, winWidth })
      },
      fail: function (err) {
        console.err(err)
      }
    })
  })
  
  return promise
}