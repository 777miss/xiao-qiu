// 测试版配置
import { tuple } from '../methods/types'

import type { AuthIdInType } from './interface'
import type { BotAccount } from '../interface'

// 账号与密码
const self: BotAccount = {
    uin: 111111,
    pwd: '111111'
}
const g1 = 222
// 要监听的群聊ID
const groupchatsId = tuple(g1)
// 要修改群昵称的群聊ID
const autoGroupchatsName = tuple(g1)
// 数据库配置
const connectionDbConfig = {
    host: '',
    user: '',
    password: '',
    database: ''
}
// 绝对权限(特定用户)
const AuthId = {
    FuncJin: 333
} as const
type AuthIdType = AuthIdInType<typeof AuthId>
interface GroupsId {
    groupchatsId: typeof g1
    autoGroupchatsName: typeof g1
}

export {
    self,
    groupchatsId,
    autoGroupchatsName,
    connectionDbConfig,
    AuthId,
    AuthIdType,
    GroupsId
}
