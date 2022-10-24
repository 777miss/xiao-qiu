/**
 * [抽奖xx]指令：
 * 用于在积分抽奖池中进行多次抽奖
 */
import { judge, luckly } from './tools'
import { self } from '../../../lib/user'
import { setPacksack } from '../packsack/tools'
import { returnOneOfContent, formatNumCount, isDecimals } from '../../../lib/methods'

import type { CardResult, LucklyResult } from './interface'
import type { SendContent, CommandFn, ForwardRecord } from '../../../lib/interface'

type DrawResult = {
    content: string
    arr: LucklyResult[]
}

// 每位用户只能在上一次抽奖完成后，再进行下一次抽奖
const drawPlaceholder = new Map<string, number>()

const sendContent: SendContent = {
    name: '抽奖',
    reg: [/^抽奖x(?<count>\d+)$/, /^抽奖\*(?<count>\d+)$/, /^抽奖(?<count>\d+)次$/],
    role: 'member',
    member: ({ user: { name }, operations: { at } }) => [
        `${at('user')} 你身为一个群成员，你不知道抽奖次数最低为1吗？`,
        `小秋好伤心啊 因为${name}不知道最低抽奖次数是1次`,
        `${at('user')} 难道你要成为群主才知道抽奖次数最低是1次吗？`
    ],
    admin: ({ user: { name }, operations: { at } }) => [
        `${name}！你这管理别要了，最低抽奖次数只能是1次`,
        `${at('user')} 呜呜 这位管理，小秋好难过，因为您最少要进行的抽奖次数为1哦`,
        `管理员${name}真抠啊，连小秋都知道最低抽奖次数是1次`
    ],
    owner: ({ user: { name }, operations: { at } }) => [
        `群主别搞事，最低抽奖次数是1次`,
        `${name} 你咋回事，最低抽奖次数是1次！小秋可不怕你这个坏群主哦`,
        `${at('user')} 别搞事啊群主 最低的抽奖次数可是1次呀`
    ],
    deverDefined: ({ user: { name }, operations: { at }, defined: { reason, explain } }) => [
        [
            `${at('user')} ${reason}`
        ],
        [
            `${at('user')} 抽到这么多东西，小秋好羡慕啊。${explain}\n`,
            `吆西 ${name}人品大爆发，${explain}\n`,
            `${at('user')} 运气不错，羡慕你哦\n${explain}\n`
        ]
    ]
}
const fn: CommandFn = async originData => {
    const { bot, group, user, raw_message, segment, reg, database } = originData
    const count = Number(reg.exec(raw_message)?.groups?.count)
    if (count <= 0) return
    const isOk = await judge(group.id, user.id, count, database, drawPlaceholder)
    const { flag, reason } = isOk
    if (!flag) return { items: 1, args: { reason } }
    // 记录本次抽奖是否完成
    const drawFlag = `${group.id}${user.id}`
    drawPlaceholder.set(drawFlag, count)
    const result: DrawResult = { content: '', arr: [] }
    const process = async () => await luckly(group.id)
    for (let i = 0; i < count; i++) result.arr.push(await process())
    const end = { score: 0, card: { ban: 0, delMsg: 0, immune: 0, see: 0 } }
    result.arr.forEach((v, i) => {
        const { all, advance } = v
        end.score += all.score
        const arr = Object.keys(all.card) as (keyof CardResult)[]
        arr.forEach(v => (end.card[v] += all.card[v]))
        result.content += `${i + 1}：${advance.explain}\n`
    })
    end.score = Number(end.score.toFixed(1))
    await setPacksack(group.id, user.id, end)
    // 确认更改数据后，清除原先所记录的抽奖标识
    drawPlaceholder.delete(drawFlag)
    const r = end.score
    const text = (content: string) =>
        `抽奖记录为：\n${content}[本次抽奖积分变化：${formatNumCount(isDecimals(r) ? Number(r.toFixed(1)) : r)}积分]`
    // 抽奖次数超过10时，以转发聊天记录的形式发出
    if (count <= 10) return { items: 2, args: { explain: text(result.content) } }
    const arr = [
        `大家快看 ${user.name}居然抽到了这么多东西`,
        `羡慕啊 小机灵鬼${user.name} 这么多次抽奖居然没亏哎`,
        `hhh ${user.name}，快看看你都抽到了啥吧~`
    ]
    // 由于qq对每条消息的字数存在限制，所以此处以2000个字符为例，当超出此限制，则在聊天记录中对抽奖结果进行分割
    const rowMaxLength = 2000
    const drawCountResult: ForwardRecord[] = []
    const getFormat = (message: string) => ({
        user_id: self.uin,
        nickname: '抽奖结果',
        message
    })
    if (result.content.length <= rowMaxLength) {
        drawCountResult.push(getFormat(`@${user.card}，${text(result.content)}`))
    } else {
        const rule = Math.floor(result.content.length / rowMaxLength)
        Array.from({ length: rule }).forEach((v, i) => {
            const start = i * rowMaxLength
            const end = (i + 1) * rowMaxLength
            const boundary = i === rule ? result.content.length : end
            const text = result.content.slice(start, boundary)
            drawCountResult.push(getFormat(`【第${i + 1}条消息记录】\n\n${text}`))
        })
    }
    const forward = await bot.makeForwardMsg(drawCountResult)
    bot.sendGroupMsg(group.id, returnOneOfContent(arr))
    bot.sendGroupMsg(group.id, segment.xml(forward.data.data.data))
    return { noMsg: true }
}
const drawCount = { fn, sendContent }

export { drawCount }
