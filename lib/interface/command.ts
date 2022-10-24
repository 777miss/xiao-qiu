// 有关Oicq的类型，本文件使用any来替代（例如bot、segment、...），具体api请参考其官方文档
//// <reference path="../../node_modules/oicq/client.d.ts" />

import type { DataBase } from '../../database/interface'
import type { AuthIdType } from '../user'
import type { OicqOperations } from '../oicq/interface'
import type { CommandsName } from '../../database/forms/interface'
import type { GroupchatsId } from './account'
import type { GetObject } from './toolsType'

// 每个指令的配置项
type Role = 'member' | 'admin' | 'owner'
type LowestRole = 'member' | 'admin' | 'owner'
type GroupAt = (who: 'user' | 'other') => string
type PersonInfo = {
    card: string
    nickname: string
    role: Role
}

type MemberBasisInfo = {
    id: number
    sex: boolean
    // card、nickname有可能为空，所以使用name兜底
    name: string
} & PersonInfo
type OriginMemberBasisInfo = {
    user_id: number
    sex: string
} & PersonInfo
type GroupBasisInfo = {
    id: GroupchatsId
    name: string
}

type InfoTemp = {
    user: MemberBasisInfo
    other: MemberBasisInfo
    defined: GetObject<string>
    operations: {
        at: GroupAt
        face: OicqOperations['face']
        promiseImage: OicqOperations['promiseImage']
    }
}

type ReturnsMsg = (infoTemp: InfoTemp) => string[]
type SendContent = {
    // 当前指令的名称
    name: CommandsName
    // 触发该指令的条件
    reg: RegExp | RegExp[]
    // 能够触发该指令的角色
    role: Role | AuthIdType
    // 触发者是普通成员
    member?: ReturnsMsg
    // 触发者是管理员
    admin?: ReturnsMsg
    // 触发者是群主
    owner?: ReturnsMsg
    // 自定义参数
    deverDefined?: (infoTemp: InfoTemp) => string[][]
    // 当存在被执行人时，是否希望检查小秋与被执行人的权限
    // 指定了该值，则代表小秋执行当前指令时会校验小秋与被执行人的权限是否相同；若未指定，则代表无需进行相同权限判断
    equal?: ReturnsMsg,
    // 表示执行该指令时小秋所需的最低身份
    // 指定了该值，则代表小秋最低身份必须为admin；若未指定该值，则代表小秋最低身份只需是member即可
    level?: ReturnsMsg
}
// 每个指令所对应的处理函数的形参、返回值
type OriginData = {
    bot: any
    segment: any
    user: MemberBasisInfo
    other: MemberBasisInfo
    group: GroupBasisInfo
    raw_message: string
    reg: RegExp
    operations: OicqOperations
    database: DataBase
}
type ReturnConfig = {
    items?: number
    args?: GetObject<unknown>
    noMsg?: boolean
}
type CommandFn = (
    originData: OriginData
) => undefined | void | ReturnConfig | Promise<ReturnConfig | undefined>

export {
    Role,
    LowestRole,
    GroupAt,
    MemberBasisInfo,
    OriginMemberBasisInfo,
    SendContent,
    GroupBasisInfo,
    InfoTemp,
    OriginData,
    CommandFn
}
