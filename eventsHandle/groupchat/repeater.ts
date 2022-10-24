/**
 * [检测复读]指令：
 * 当群聊中发生了复读事件后，小秋会根据复读的人数及消息数作出相应回应。
 * （该指令会自动进行检测，因此无法主动开启/关闭。在主动进行复读时，小秋会避开复读已开发的指令文字，
 * 理论上来讲不会造成这种情况，因为每条指令始终都对应着一条回复）
 */
import path from 'path'

import { menu } from '../../lib/oicq/menuKeywords'
import { operations } from '../../lib/oicq/oicqOperations'
import { returnOneOfContent } from '../../lib/methods'

import type { GroupchatsId, OriginData } from '../../lib/interface'
import type { PreGroupchatMessage, CommandsName } from '../../database/forms/interface'

type Repeater = (
    bot: OriginData['bot'],
    id: GroupchatsId,
    card: string,
    operations: OriginData['operations']
) => Promise<void>

const { promiseImage, face } = operations

// 用于分析群聊中复读的情况
const getSecondRepeatItems = (arr: PreGroupchatMessage[]) => {
    // 得到每个重复的消息及它们被重复的次数
    const container = new Map<string, number>([])
    // 统计每个重复的消息都是由哪些用户发出的
    const user = new Set()
    const result = {
        // 被复读的消息
        msg: '',
        // 被复读消息的最大复读次数
        times: 0,
        // 被复读消息总共有多少人进行复读
        userCounts: 0
    }
    arr.forEach(({ userId, content }) => {
        const counts = container.get(content)
        // 如果该消息没有出现过，则默认出现过一次
        if (!counts) return container.set(content, 1)
        const num = counts + 1
        // 如果未超过当前最高的复读次数，则只更新该消息自身所对应的复读次数
        if (num < result.times) return container.set(content, num)
        // 如果超过了当前最高的复读次数，则更新result对象(因为此时统计到了最新数据)
        result.msg = content
        result.times = num
        container.set(content, num)
        // 用于统计都是哪些人复读的消息
        user.add(userId)
    })
    result.userCounts = user.size
    return result
}
const reason1 = [
    `你有孤独和烈酒，所以在这复读走一走？`,
    `小秋发现你很无聊哎`,
    `别复读了，整一局？${promiseImage(path.resolve('./assets/images/emoji/送你花花1.jpg'))}`,
    `别复读了，整一局？${face(98)}`,
    `别复读了，整一局？${promiseImage(path.resolve('./assets/images/emoji/比心1.jpg'))}`,
    `别复读了，整一局？${face(179)}`
]
const reason2 = [
    `${path.resolve('./assets/images/emoji/复读1.jpg')}`,
    `${path.resolve('./assets/images/emoji/不要这样先生1.jpg')}`,
    `${path.resolve('./assets/images/emoji/复读2.jpg')}`,
    `${path.resolve('./assets/images/emoji/两狗对视1.jpg')}`,
    `${path.resolve('./assets/images/emoji/以德服人1.jpg')}`,
    `${path.resolve('./assets/images/emoji/帅者的肯定1.jpg')}`
]

// 每次复读均有100分钟的冷却时间
let isRepeat = true
const repeater: Repeater = async (bot, id, card, operations) => {
    // 是否在冷却时间内
    if (!isRepeat) return
    // 复读功能有80%的几率触发
    if (Math.random() >= 0.2) return
    const { getHistoryGroupMsg, promiseImage } = operations
    // 以本群最近的10条消息为样本进行分析
    const latest = getHistoryGroupMsg(id, 10)
    const { msg, times, userCounts } = getSecondRepeatItems(latest)
    // 只有复读次数大于3才认定此行为的本质是复读
    if (times < 3) return
    // 如果复读的次数大于3，且复读的用户等于1，则提醒该用户不要复读(造成这种情况的原因是某位成员在独自进行复读)
    // 如果复读的次数大于3，且复读的用户等于2，则小秋发送一张图片，主动打断复读(造成这种情况的原因是只有两位用户在复读)
    // 如果复读的次数大于3，且复读的用户大于等于3，则小秋也加入复读(造成这种情况的原因是有多位用户在复读)
    isRepeat = false
    // 定时清除冷却时间(小秋检测复读的冷却时间为100分钟)
    setTimeout(() => {
        isRepeat = true
    }, 1000 * 60 * 60 * 100)
    const repeatGo = [
        () => bot.sendGroupMsg(id, `${card}，${returnOneOfContent(reason1)}`),
        () => bot.sendGroupMsg(id, `${promiseImage(returnOneOfContent(reason2))}`)
    ]
    const who = repeatGo[userCounts - 1]
    if (who) return who()
    // 当全部判断通过后，此时已经可以让小秋加入复读，但若被复读消息的内容是某个已开发指令的名称，则不进行复读
    // 无论是否与指令名称冲突，均进入冷却时间内
    const isConflict = Object.keys(menu) as CommandsName[]
    const ok = isConflict.find(name => name === msg)
    if (ok) return
    bot.sendGroupMsg(id, msg)
}

export { repeater }
