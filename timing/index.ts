import { bot, versions } from '../lib/oicq'
import { clearCurMaxScore } from './clearCurMaxScore'
import { self, groupchatsId, autoGroupchatsName } from '../lib/user'

const { uin } = self
// 定时任务
const timing = () => {
    // 每次启动时，5分钟后自动将群昵称修改为当前版本的版本号
    setTimeout(
        () => autoGroupchatsName.forEach(v => bot.setGroupCard(v, uin, versions)),
        1000 * 60 * 5
    )
    // 凌晨12点自动清空每日积分获取上限
    clearCurMaxScore(groupchatsId)
}

export { timing }
