import chessmen from './chessmen.js'

import { 
  db, 
  $ 
} from './../shared/cloud.js'

import { 
  genRandomNumber, 
  encodeArray, 
  decodeArray, 
  diffArray, 
  isNewerArray 
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

    wx.onTouchStart((event) => this.handleTouch(event))

    if (identity === 'owner') {
      this.waitPlayerJoinGame()
    } else {
      this.listenRemoteRefresh()
    }
    // 
    // db.collection(COLLECTION)
    //   .where({
    //     _id: this.docid
    //   })
    //   .watch({
    //     onChange: snapshot => {
    //       console.log('收到快照', snapshot)
    //     },
    //     onError: error => {
    //       console.log('收到error', error)
    //     }
    //   })

  }

  async judgeIdentity() {
    const { list: rooms } = await db.collection(COLLECTION)
      .aggregate()
      .match({
        people: $.eq(1)
      })
      .limit(1)
      .end()

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

    return rooms.length ? 'player' : 'owner'
  }

  async createEmptyRoom() {
    const roomid = genRandomNumber(6)
    const { data } = await db.collection(COLLECTION)
      .where({ roomid })
      .get()
    if (data.length) {
      await this.createEmptyRoom()
      return
    }

    let room = {
      roomid,
      nextcolor: 'black',
      chessmen: encodeArray(this.log),
      createTimestamp: Date.now().toString(),
      people: 1
    }
    const res = await db.collection(COLLECTION).add({ data: room })

    return {
      ...room,
      _id: res._id
    }
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
    console.log('触摸后，更新本地棋盘', row, col, this.log[row][col])

    try {
      const res = await wx.cloud.callFunction({
        name: 'updateDoc',
        data: {
          collection: COLLECTION,
          docid: this.docid,
          data: {
            chessmen: encodeArray(this.log),
            nextcolor: this.color === CHESS_BLACK_COLOR ? CHESS_WHITE_COLOR : CHESS_BLACK_COLOR
          }
        }
      })
      console.log('云函数返回', res)
      console.log('触摸后，更新远程棋盘')
    } catch (error) {
      console.log('触摸后，更新远程棋盘 失败')
    }
    // todo: 判断输赢
  }

  waitPlayerJoinGame() {
    this.watcher.player = 
      db.collection(COLLECTION)
        .where({
          _id: this.docid
        })
        .watch({
          onChange: snapshot => {
            const { docs, docChanges } = snapshot
            console.log('waitPlayerJoinGame update')
            if (docChanges[0].dataType === 'update' && docs[0].people === 2) {
              this.canRun = true
              this.watcher.player.close()
              this.listenRemoteRefresh()
              console.log('玩家进入, 关闭player监听')
            }
          },
          onError: error => {}
        })
  } 

  listenRemoteRefresh() {
    this.watcher.remote = 
      db.collection(COLLECTION)
        .where({
          _id: this.docid
        })
        .watch({
          onChange: snapshot => {
            const docChange = snapshot.docChanges[0]
            const doc = snapshot.docs[0]

            if (
              docChange.dataType !== 'update'
              || !docChange.updatedFields
              || !docChange.updatedFields.chessmen
            ) {
              console.log('不是chessmen字段更新')
              return
            }

            if (doc.nextcolor !== this.color) {
              console.log('不轮到你')
              return
            } 

            const shape = [this.lines, this.lines]
            console.log('shape is', shape)
            const decoded = decodeArray(doc.chessmen, shape)
            const [x, y] = diffArray(decoded, this.log, shape)
            this.log[x][y] = decoded[x][y]
            console.log(x, y, decoded, this.log)
            chessmen._putDown(x, y, decoded[x][y] === CHESS_BLACK_NUM ? CHESS_BLACK_COLOR : CHESS_WHITE_COLOR)
            this.canRun = true
          },

          onError: error => {}
        })
  }
}

const player = new Player()
export default player
