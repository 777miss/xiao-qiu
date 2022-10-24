import { nicknameFormCard } from '../../lib/groupchat'
import { getDataBaseData, formSet } from '../../database'

import type { HandleMessage } from '../../lib/oicq/interface'
import type { GroupAt, GroupBasisInfo, InfoTemp, MemberBasisInfo } from '../../lib/interface'

// 格式化一些指令所需信息
const getUserInfo = (info: HandleMessage) => {
    const { sender } = info.data
    const user: MemberBasisInfo = {
        id: sender.user_id,
        sex: sender.sex != 'female',
        role: sender.role,
        card: sender.card,
        nickname: sender.nickname,
        name: nicknameFormCard({
            nickname: sender.nickname,
            card: sender.card
        })
    }
    return user
}
const member = 'member' as const
const getOtherInfo = (
    id = 10000,
    sex = true,
    card = '',
    role = member,
    nickname = '',
    name = ''
) => {
    const other: MemberBasisInfo = { id, sex, card, role, nickname, name }
    return other
}
const getGroupInfo = (info: HandleMessage) => {
    const { group_id, group_name } = info.data
    const group: GroupBasisInfo = {
        id: group_id,
        name: group_name
    }
    return group
}
const getWantOriginData = (
    info: HandleMessage,
    user: MemberBasisInfo,
    other: MemberBasisInfo,
    group: GroupBasisInfo,
    reg: RegExp
) => {
    const { bot, data, operations, segment } = info
    const { raw_message } = data
    const wantOriginData = {
        bot,
        segment,
        user,
        other,
        group,
        raw_message,
        reg,
        operations,
        database: {
            getDataBaseData,
            formSet
        }
    }
    return wantOriginData
}
const getInfoTemp = (info: HandleMessage, user: MemberBasisInfo, at: GroupAt) => {
    const { operations } = info
    const infoTemp: InfoTemp = {
        user,
        other: {
            id: 10000,
            card: '',
            role: 'member',
            sex: true,
            nickname: '',
            name: ''
        },
        defined: {},
        operations: {
            at: at,
            face: operations.face,
            promiseImage: operations.promiseImage
        }
    }
    return infoTemp
}

export {
    getUserInfo,
    getOtherInfo,
    getGroupInfo,
    getWantOriginData,
    getInfoTemp
}
