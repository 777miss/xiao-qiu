/**
 * [我的背包]指令：
 * 发送当前用户背包中的积分、道具卡数量
 */
import { isDecimals } from '../../../lib/methods'

import type { SendContent, CommandFn } from '../../../lib/interface'

const sendContent: SendContent = {
    name: '我的背包',
    reg: [
        /^我的背包$/,
        /^我的积分$/,
        /^查询背包$/,
        /^背包查询$/,
        /^查询积分$/,
        /^积分查询$/,
        /^查看背包$/,
        /^查看积分$/
    ],
    role: 'member',
    deverDefined: ({ defined: { score, ban, delMsg, see, immune }, operations: { at } }) => [
        [
            `${at('user')} 小秋查询到您的背包如下~\n积分：${score}分\n禁言卡：${ban}张，免疫卡：${immune}张\n撤回卡：${delMsg}张，康康卡：${see}张`,
            `${at('user')}\n积分${score}\n禁言卡${ban}张\n免疫卡${immune}张\n撤回卡${delMsg}张\n康康卡${see}张`,
            `${at('user')} 您的背包情况为：${score}积分，${ban}张禁言卡、${immune}张免疫卡，${delMsg}张撤回卡、康康卡${see}张！`
        ],
        [
            `${at('user')} 小秋查询到您的背包如下哦~\n积分：${score}分\n禁言卡：${ban}张\n免疫卡：${immune}张\n撤回卡：${delMsg}张\n康康卡：${see}张`,
            `${at('user')} 哇 太多了叭 羡慕啊\n积分：${score}分\n禁言卡：${ban}张\n免疫卡：${immune}张\n撤回卡：${delMsg}张\n康康卡：${see}张`
        ]
    ]
}
const fn: CommandFn = async originData => {
    const { group, user: { id }, database } = originData
    const { getDataBaseData, formSet: { user_packsack } } = database
    const value = await getDataBaseData(user_packsack.name, user_packsack.retrieveData)(group.id)
    const all = value[id] || { score: 0, card: { ban: 0, immune: 0, delMsg: 0, see: 0 } }
    const { score: myScore, card } = all
    const { ban, immune, delMsg, see } = card
    const score = isDecimals(myScore) ? myScore.toFixed(1) : myScore
    if ([ban, immune, delMsg, see].find(v => v >= 100))
        return { items: 2, args: { score, ban, immune, delMsg, see } }
    return { items: 1, args: { score, ban, immune, delMsg, see } }
}
const getPacksack = { fn, sendContent }

export { getPacksack }
