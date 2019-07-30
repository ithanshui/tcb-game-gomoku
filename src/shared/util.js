const subscriber = {
  clientList: {},

  listen(key, fn) {
    if (!this.clientList[key]) {
      this.clientList[key] = [];
    }
    this.clientList[key].push(fn);
    return true;
  },

  // 触发对应事件
  trigger() {
    const key = Array.prototype.shift.apply(arguments),
      fns = this.clientList[key];

    if (!fns || fns.length === 0) {
      return false;
    }

    for (let fn of fns) {
      fn.apply(null, arguments);
    }

    return true;
  },

  // 移除相关事件
  remove(key, fn) {
    let fns = this.clientList[key];

    // 如果之前没有绑定事件
    // 或者没有指明要移除的事件
    // 直接返回
    if (!fns || !fn) {
      return false;
    }

    // 反向遍历移除置指定事件函数
    for (let l = fns.length - 1; l >= 0; l--) {
      let _fn = fns[l];
      if (_fn === fn) {
        fns.splice(l, 1);
      }
    }

    return true;
  }
};
/**
 * 生成指定长度的由0～9数字组成的随机字符串
 * 
 * @param {Number} length 字符串长度
 * @return {String}
 */
function genRandomNumber (length) {
  length = length || 5
  let str = ''
  for (let i = 0; i < length; ++i) {
    str += Math.floor(Math.random() * 10)
  }
  return str
}

/**
 * pollyfile: querystring.encode()
 * 
 * @param {Object} params 路由参数列表
 * @return {String}
 */
function querystring (params) {
  let result = ''
  Reflect.ownKeys(params)
    .forEach(key => {
      result += `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}&`
    })
  return result.slice(0, result.length - 1)
}

/**
 * pollyfill: Array.flat()
 * 
 * @param {Array} arr 高纬矩阵
 * @return {Array}
 */
function localFlat (arr) {
  return arr.reduce((arr, val) => arr.concat(val), [])
}

/**
 * 转化棋盘形式的表现形式：数组 => 字符串
 * 
 * @param {Array} arr 棋盘矩阵
 * @return {String} 
 */
function encodeArray (arr) {
  return localFlat(arr).join(',')
}

/**
 * 转化棋盘形式的表现形式：字符串 => 数组
 * 
 * @param {String} str 字符串化的棋盘
 * @param {Array} shape 棋盘形状
 * @return {Array}
 */
function decodeArray (str, shape) {
  const arr = str.split(',')
    .map(item => parseInt(item, 10))

  const [ row, col ] = shape
  const result = new Array(row)
  for (let i = 0; i < row; ++i) {
    result[i] = new Array(col)
    for (let j = 0; j < col; ++j) {
      result[i][j] = arr.shift()
    }
  }

  return result
}

/**
 * 比较棋盘的不同落子，返回坐标
 * 
 * @param {Array} arr1 棋盘矩阵
 * @param {Array} arr2 棋盘矩阵
 * @param {Array} shape 棋盘形状
 * @param {Array} 
 */
function diffArray (arr1, arr2, shape) {
  const [row, col] = shape
  for (let i = 0; i < row; ++i) {
    for (let j = 0; j < col; ++j) {
      if (arr1[i][j] !== arr2[i][j]) {
        return [i, j]
      }
    }
  }
  return [-1, -1]
}

/**
 * 判断新棋盘相较于旧棋盘，是否有更新
 * 
 * @param {Array} older 旧棋盘矩阵
 * @param {Array} newer 新棋盘矩阵
 * @param {Array} shape 棋盘形状
 * @return {Boolean}
 */
function isNewerArray(older, newer, shape) {
  const [row, col] = shape
  let newerNum = 0, olderNum = 0
  for (let i = 0; i < row; ++i) {
    for (let j = 0; j < col; ++j) {
      if (newer[i][j] === -1 || newer[i][j] === 1) {
        ++newerNum
      }
      if (older[i][j] === -1 || older[i][j] === 1) {
        ++olderNum
      }
    }
  }
  return newerNum > olderNum
}

module.exports = {
  subscriber,
  genRandomNumber,
  querystring,
  encodeArray,
  decodeArray,
  diffArray,
  isNewerArray,
}