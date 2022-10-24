import { addCacheMsgRows } from './tools'
import { getChangeAllCard } from '../../eventsHandle/groupchatAdmin/setCard/tools'
import { handleMessage } from '../../eventsHandle'
import { bot, segment, operations } from './oicqOperations'
import { secToFormat } from '../time'
import { getDataBaseData, formSet } from '../../database'
import { nicknameFormCard } from '../groupchat'
import { returnOneOfContent } from '../methods'

import type { PreGroupchatMessage, GroupEvents } from '../../database/forms/interface'
import type {
    OriginGroupData,
    IncreaseData,
    BanData,
    DecreaseData,
    NoticeGroupPoke,
    HandleMessage
} from './interface'

const database = { getDataBaseData, formSet }
const { groups_config } = formSet

// 身份验证事件
const systemLoginSlider = () => process.stdin.once('data', input => bot.sliderLogin(input))
// 监听群聊消息
const messageGroup = async (data: OriginGroupData) => {
    const { group_id, sender, message_id, raw_message } = data
    const timestamp = +new Date()
    const row: PreGroupchatMessage = {
        userId: sender.user_id,
        msgId: message_id,
        timestamp,
        content: raw_message
    }
    // 写入数据
    addCacheMsgRows(group_id, row)
    const info: HandleMessage = {
        data,
        bot,
        segment,
        operations,
        database
    }
    handleMessage(info)
}
// 群成员增加时触发
const noticeGroupIncrease = async (dataInit: IncreaseData) => {
    const { group_id, user_id } = dataInit
    const { setCard: { isAuto, content } } = await getDataBaseData(groups_config.name, groups_config.retrieveData)(group_id)
    if (!isAuto) return
    // 欢迎新成员
    bot.sendGroupMsg(dataInit.group_id, content)
    // 自动修改群昵称
    const card = await getChangeAllCard(bot, group_id, user_id)
    bot.setGroupCard(group_id, user_id, card)
}
// 群禁言事件
const noticeGroupBan = async (data: BanData) => {
    const { group_id, operator_id, user_id, duration } = data
    const { data: o_data } = await bot.getGroupMemberInfo(group_id, operator_id)
    const operator_card = o_data.card ? o_data.card : o_data.nickname
    const ban = {
        // 全员禁言事件
        whole: async () => {
            if (duration === 0) return `<${operator_card}>关闭了全员禁言`
            return `<${operator_card}>开启了全员禁言`
        },
        // 管理员与成员之间发生的禁言事件
        single: async () => {
            // duration为0时代表此操作是解除禁言
            const { data: u_data } = await bot.getGroupMemberInfo(group_id, user_id)
            const user_card = u_data.card ? u_data.card : u_data.nickname
            if (duration === 0) return `${user_card}，被<${operator_card}>解除了禁言`
            return `${user_card}，被<${operator_card}>禁言${secToFormat(duration)}`
        }
    }
    const belong = user_id === 0 ? 'whole' : 'single'
    ban[belong]().then(message => bot.sendGroupMsg(group_id, message))
}
// 群成员减少事件
const noticeGroupDecrease = (data: DecreaseData) => {
    const { group_id, operator_id, member } = data
    const f = async () => {
        const other_card = member.card ? member.card : member.nickname
        const other_id = member.user_id
        // 自己退群
        if (operator_id === other_id) return `<${other_card}>离开了群聊`
        // 被踢出群
        const gmlMap = await bot.gml.get(group_id)
        const operator_card = gmlMap.get(Number(operator_id)).card
        return `<${other_card}>被<${operator_card}>踢出了群聊`
    }
    f().then(message => bot.sendGroupMsg(group_id, message))
}
// 群戳一戳事件
const noticeGroupPoke = async (data: NoticeGroupPoke) => {
    const { group_id, self_id, user_id, target_id, operator_id, action, suffix } = data
    // 如果戳一戳的目标人物是小秋，则不作任何处理
    if (self_id === user_id || self_id === target_id) return
    const { data: other } = await bot.getGroupMemberInfo(group_id, user_id)
    const { data: user } = await bot.getGroupMemberInfo(group_id, operator_id)
    const usernames = {
        nickname: user.nickname,
        card: user.card
    }
    const othernames = {
        nickname: other.nickname,
        card: other.card
    }
    const msg = [
        `${nicknameFormCard(usernames)}${action}${nicknameFormCard(othernames)}${suffix}`,
        `天啦噜 ${nicknameFormCard(usernames)}${action}${nicknameFormCard(othernames)}${suffix}`,
        `${nicknameFormCard(usernames)}${action}${nicknameFormCard(othernames)}，但到底${action}什么呢？据小秋看来，应该是${nicknameFormCard(othernames)}${suffix}`
    ]
    bot.sendGroupMsg(group_id, returnOneOfContent(msg))
}
// 只触发被监听群聊的事件
const processEvents = (name: GroupEvents, fn: Function) => {
    return async (data: OriginGroupData) => {
        const config = await getDataBaseData(groups_config.name, groups_config.retrieveData)(data.group_id)
        const { events } = config
        if (events[name]) fn(data)
    }
}
const registerEvents = (): void => {
    //监听并输入滑动验证码ticket
    bot.on('system.login.slider', systemLoginSlider)
    const events = [
        // 监听群聊消息
        ['message.group', messageGroup, 'message'],
        // 群成员增加时触发
        ['notice.group.increase', noticeGroupIncrease, 'increase'],
        // 群禁言事件
        ['notice.group.ban', noticeGroupBan, 'ban'],
        // 群踢人、退群事件
        ['notice.group.decrease', noticeGroupDecrease, 'decrease'],
        // 群戳一戳事件
        ['notice.group.poke', noticeGroupPoke, 'poke']
    ] as const
    events.forEach(ev => {
        const [name, fn, eventsAlias] = ev
        bot.on(name, processEvents(eventsAlias, fn))
    })
}

export { registerEvents }
