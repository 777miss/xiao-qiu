/**
 * [抽奖]指令：
 * 用于在积分抽奖池中进行一次抽奖
 */
import { judge, luckly } from './tools'
import { setPacksack } from '../packsack/tools'
import { formatNumCount, isDecimals } from '../../../lib/methods'

import type { SendContent, CommandFn } from '../../../lib/interface'

// 每位用户只能在上一次抽奖完成后，再进行下一次抽奖
const drawPlaceholder = new Map<string, number>()

const sendContent: SendContent = {
    name: '抽奖',
    reg: /^抽奖$/,
    role: 'member',
    deverDefined: ({ user: { name }, defined: { reason, explain, score }, operations: { at } }) => [
        [
            `${at('user')} ${reason}`
        ],
        [
            `${at('user')} 小秋恭喜您抽到了(${explain})\n[本次抽奖积分变化：${score}积分]`,
            `${at('user')} 小秋帮您抽奖完成啦，您抽到的是(${explain})\n[本次抽奖积分变化：${score}积分]`,
            `呀 ${name}人品大爆发，抽到了(${explain})\n[本次抽奖积分变化：${score}积分]`
        ]
    ]
}
const fn: CommandFn = async originData => {
    const { group, user, database } = originData
    const isOk = await judge(group.id, user.id, 1, database, drawPlaceholder)
    const { flag, reason } = isOk
    if (!flag) return { items: 1, args: { reason } }
    // 记录本次抽奖是否完成
    const drawFlag = `${group.id}${user.id}`
    const count = 1
    drawPlaceholder.set(drawFlag, count)
    const { all, advance } = await luckly(group.id)
    await setPacksack(group.id, user.id, all)
    // 得到一次抽奖所消耗的积分
    // 确认更改数据后，清除原先所记录的抽奖标识
    drawPlaceholder.delete(drawFlag)
    const r = all.score
    return {
        items: 2,
        args: {
            explain: advance.explain,
            score: formatNumCount(isDecimals(r) ? Number(r.toFixed(1)) : r)
        }
    }
}
const draw = { fn, sendContent }

export { draw }
