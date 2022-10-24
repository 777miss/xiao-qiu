/**
 * [发放积分]指令：
 * 为指定成员发放积分
 */
import { setPacksack } from './tools'

import { AuthId } from '../../../lib/interface'
import type { SendContent, CommandFn } from '../../../lib/interface'

const sendContent: SendContent = {
    name: '发放积分',
    reg: [
        /^发放(?<num>\d*)积分\[CQ:at,qq=(?<qq>\d*),text=.*\]\s*$/,
        /^发放积分(?<num>\d*)\[CQ:at,qq=(?<qq>\d*),text=.*\]\s*$/
    ],
    role: [AuthId.FuncJin],
    member: ({ user: { name }, operations: { at } }) => [
        `${at('user')} 此操作仅供特定用户使用`,
        `${at('user')} 您暂无此权限`,
        `${name}，反了你了`
    ],
    admin: ({ operations: { at } }) => [
        `${at('user')} 就算你是管理也不行 此操作仅供特定用户使用`,
        `${at('user')} 抱歉 您无此权限~`
    ],
    owner: ({ operations: { at } }) => [
        `${at('user')} 听说就连群主也无法触发此指令哦！`,
        `${at('user')} 糟糕 居然是红灯[尊贵的群主大人，您暂时无法使用此指令]`
    ],
    deverDefined: ({ user: { name }, operations: { at }, defined: { score } }) => [
        [
            `${at('user')} 小秋提示您，积分发放范围必须在1~1000万之间`,
            `${at('user')} 积分发放范围必须在1~1000万之间`
        ],
        [
            `${at('other')} Hi ${name}为您发放${score}积分`,
            `${at('other')} 人品大爆发 ${name}为您发放${score}积分`
        ]
    ]
}
const fn: CommandFn = originData => {
    const { group, other, raw_message, reg } = originData
    const num = reg.exec(raw_message)?.groups?.num
    const score = Number(num)
    if (score <= 0 || score > 10000000) return { items: 1, args: {} }
    setPacksack(group.id, other.id, { score })
    return { items: 2, args: { score } }
}
const addScore = { fn, sendContent }

export { addScore }
