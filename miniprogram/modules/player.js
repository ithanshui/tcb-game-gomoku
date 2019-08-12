import main from './main.js'
import chessmen from './chessmen.js'
import head from './head.js'
import { db, $ } from './../shared/cloud.js'
import { 
  genRandomNumber, 
  encodeArray, 
  decodeArray, 
  diffArray,
  sleep
} from './../shared/util.js'
import { 
  CHESS_BLACK_NUM, 
  CHESS_WHITE_NUM, 
  CHESS_EMPTY_NUM,
  CHESS_BLACK_COLOR,
  CHESS_WHITE_COLOR
} from './../shared/contants.js'

const COLLECTION = 'rooms'

class Player {
  constructor() {
    this.color = ''
    this.lines = 15
    this.roomid = ''
    this.docid = ''
    this.canRun = false
    this.log = []

    this.watcher = {
      player: null, // 针对player开启的监听器
      remote: null // 针对远程更新开启的监听器
    }
    
    this.init()
  }

  async init() {
    for (let i = 0; i < this.lines; ++i) {
      this.log[i] = []
      for (let j = 0; j < this.lines; ++j) {
        this.log[i][j] = CHESS_EMPTY_NUM
      }
    }

    const identity = await this.judgeIdentity()
    console.log('identity is', identity)

    wx.onTouchStart((event) => this.handleTouch(event))

    if (identity === 'owner') {
      this.waitPlayerJoinGame()
    } else {
      chessmen.updateTitle('等待对手下棋')
      main.render()
      await this.updatePeopleField()
      this.listenRemoteRefresh()
    }
  }

  async judgeIdentity() {
    // 任务

    let room = null
    if (!rooms.length) {
      room = await this.createEmptyRoom()
    } else {
      room = rooms[0]
    }

    this.color = rooms.length ? CHESS_WHITE_COLOR : CHESS_BLACK_COLOR
    this.roomid = room.roomid
    this.docid = room._id
    this.canRun = false

    head.updateText(`房间号 ${this.roomid}`)
    main.render()

    return rooms.length ? 'player' : 'owner'
  }

  async createEmptyRoom() {
    // 任务
  }

  async updatePeopleField() {
    // 任务
  }

  async handleTouch(event) {
    if (!this.canRun) {
      console.log('没有轮到你')
      return
    } else {
      this.canRun = false
    }

    const { clientX, clientY } = event.touches[0]
    const { success, col, row } = chessmen.putDown(clientX, clientY, this.color)
    if (!success) {
      console.log('请点击正确的位置')
      return
    }
    
    this.log[row][col] = this.color === CHESS_BLACK_COLOR ? CHESS_BLACK_NUM : CHESS_WHITE_NUM
    chessmen.updateTitle('等待对手下棋')
    main.render()
    console.log('触摸后，更新本地棋盘', row, col, this.log[row][col])

    const canJudge = this.judgeWinOrLose(row, col, this.log)
    if (canJudge) {
      this.exit(row, col, this.log)
    }

    // 任务
  }

  waitPlayerJoinGame() {
    // 任务
  } 

  listenRemoteRefresh() {
    this.watcher.remote = 
      db.collection(COLLECTION)
        .where({
          _id: this.docid
        })
        .watch({
          onChange: snapshot => {
            // 任务：监听远程棋盘更新
            const docChange = snapshot.docChanges[0]
            const doc = snapshot.docs[0]
            // 判定棋盘更新状态、以及更新字段是否是chessmen

            // 判定棋盘的nextcolor是否符合要求
            
            // 任务：更新本地棋盘状态、判定输赢、打开锁
          },
          onError: error => {}
        })
  }

  judgeWinOrLose(x, y, log) {
    if (!Array.isArray(log)) {
      log = this.log
    }
    const { lines } = this
    let num = 0, target = log[x][y]
    if (target !== CHESS_BLACK_NUM && target !== CHESS_WHITE_NUM) {
      return false
    }

    // 垂直方向
    num = 0
    for (let i = y - 1; i >= 0 && target === log[x][i]; --i) {
      ++num
    }
    for (let i = y + 1; i < lines && target === log[x][i]; ++i) {
      ++num
    }
    if (num >= 4) {
      console.log('垂直方向，胜利')
      return true
    }

    // 水平方向
    num = 0
    for (let i = x - 1; i >= 0 && target === log[i][y]; --i) {
      ++num
    }
    for (let i = x + 1; i < lines && target === log[i][y]; ++i) {
      ++num
    }
    if (num >= 4) {
      console.log('水平方向，胜利')
      return true
    }

    // 左倾斜方向
    num = 0
    for (
      let i = x - 1, j = y - 1;
      i >= 0 && j >= 0 && target === log[i][j];
      --i, --j
    ) {
      ++num
    }
    for (
      let i = x + 1, j = y + 1;
      i < lines && j < lines && target === log[i][j];
      ++i, ++j
    ) {
      ++num
    }
    if (num >= 4) {
      console.log('左倾斜方向，胜利')
      return true
    }

    // 右倾斜方向
    num = 0
    for (
      let i = x - 1, j = y + 1;
      i >= 0 && j < lines && target === log[i][j];
      --i, ++j
    ) {
      ++num
    }
    for (
      let i = x + 1, j = y - 1;
      i < lines && j >= 0 && target === log[i][j];
      ++i, --j
    ) {
      ++num
    }
    if (num >= 4) {
      console.log('右倾斜方向，胜利')
      return true
    }

    return false
  }
  
  async exit(row, col) {
    this.watcher.remote.close()
    this.canRun = false

    const target = this.log[row][col]
    const color = target === CHESS_BLACK_NUM 
      ? CHESS_BLACK_COLOR
      : CHESS_WHITE_COLOR
    const map = {
      [CHESS_BLACK_COLOR]: '黑棋',
      [CHESS_WHITE_COLOR]: '白棋'
    }

    // 任务：给予输赢提示


    chessmen.updateTitle('2秒后自动退出')
    main.render()
    await sleep(2000)
    
    // 任务：删除记录
    const that = this
    wx.exitMiniProgram({
      complete: () => {
        // 
      }
    })
  }
}

export default new Player()
