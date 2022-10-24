// 使用数组结构替代数据库中存储的群聊消息
import { groupchatsId } from '../user'

import type { PreGroupchatMessage } from '../../database/forms/interface'
import type { GroupchatsId } from '../interface'

type CacheGroupMsg = {
    [k in GroupchatsId]: PreGroupchatMessage[]
}

const cacheGroupMsg = {} as CacheGroupMsg
groupchatsId.forEach(id => (cacheGroupMsg[id] = []))
// 只缓存最近100条消息
const addCacheMsgRows = (groupId: GroupchatsId, content: PreGroupchatMessage) => {
    if (cacheGroupMsg[groupId].length >= 100) cacheGroupMsg[groupId].shift()
    cacheGroupMsg[groupId].push(content)
}

export {
    cacheGroupMsg,
    addCacheMsgRows
}
