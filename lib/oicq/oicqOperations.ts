// @ts-ignore
import { createClient, segment, cqcode } from 'oicq'

import { getDataBaseData } from '../../database/tools'
import { belong } from '../time'
import { self } from '../user'
import { cacheGroupMsg } from './tools'

import type { OicqOperations } from './interface'
import type { UnitChi } from '../time/interface'

const { uin, pwd } = self

// 创建客户端(传递机器人(小秋)的账号)
const bot = createClient(uin)
// 登录
bot.login(pwd)
// 艾特
const doAt: OicqOperations['doAt'] = id => segment.toCqcode(segment.at(id))
// 发送表情
const face: OicqOperations['face'] = order => segment.toCqcode(segment.face(order))
// 查询某个群聊的历史消息,如果未指定查询的条数，则默认为当前群聊中的全部历史消息
// 从后面往前查historyMsg: [1, 2, 3, 4, 5, 6]，如果是3，则返回4 5 6 条消息
const getHistoryGroupMsg: OicqOperations['getHistoryGroupMsg'] = (gId, counts?) => {
    const arrs = cacheGroupMsg[gId]
    if (!counts) return arrs
    // 返回指定的条数
    const len = counts >= arrs.length ? 0 : arrs.length - counts
    const msg = arrs.slice(len)
    return msg
}
// 撤回
const delMsg: OicqOperations['delMsg'] = async (groupId, otherId, num) => {
    // num为0则代表删除全部消息(全部消息 === 最近30条消息)
    const preMessage = cacheGroupMsg[groupId]
    const row = num === 0 ? 30 : num
    let i = preMessage.length - 1
    let beCountMsg = 0
    while (i >= 0) {
        if (beCountMsg === row) break
        if (preMessage[i].userId === otherId) {
            const [single] = preMessage.splice(i, 1)
            bot.deleteMsg(single.msgId)
            beCountMsg++
        }
        i--
    }
    // 返回已撤回的消息条数
    return beCountMsg
}
// 禁言，传入单位(分钟、小时、天数) 以及 持续时间(1、2、...)
const banMember: OicqOperations['banMember'] = (groupId, otherId, unit, dur) =>
    bot.setGroupBan(groupId, otherId, belong[unit as UnitChi].sec(dur))

// 获取指定文件中的图片，以备发送(返回图片的CQ码，可以单独发送，也可以内嵌在字符串中发送)
// 在聊天记录中发送图片，需要使用segment.image，而不是cqcode.image
const promiseImage: OicqOperations['promiseImage'] = imgPath => cqcode.image(imgPath)

const operations = {
    getDataBaseData,
    doAt,
    face,
    getHistoryGroupMsg,
    delMsg,
    banMember,
    promiseImage
}

export {
    bot,
    segment,
    operations
}
