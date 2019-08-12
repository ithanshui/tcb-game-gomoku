const tcb = require('tcb-admin-node')
const app = tcb.init({
  env: tcb.getCurrentEnv(),
  timeout: 5000
})
const db = app.database()

exports.main = async (event, context) => {
  // 任务
}
