/**
 * [解除禁止发言]指令：
 * 为某位成员解除禁止发言
 */
import { persons, judgeMemberNotSpeak } from './tools'

import type { SendContent, CommandFn } from '../../../lib/interface'

const sendContent: SendContent = {
    name: '解除禁止发言',
    reg: /^解除禁止发言\[CQ:at,qq=\d*,text=.*\]\s*$/,
    role: 'admin',
    member: ({ other: { name }, operations: { at, face } }) => [
        `${at('user')} 听我说谢谢你 但是你还是不能使用该指令`,
        `${at('user')} 想啥呢 小秋没法帮您解除哦${face(34)}`,
        `${at('user')} ${name}不需要解除哦~`
    ],
    deverDefined: ({ user: { name: username }, other: { name: othername }, operations: { at } }) => [
        [
            `${at('user')} 不带这么玩的 ${othername}尚不处于禁止发言期间`,
            `${at('user')} 别闹，小秋没发现${othername}处于禁止发言期间`,
            `${at('user')} 等${othername}进入了禁止发言期间再来使用该指令吧！`
        ],
        [
            `${at('other')} 呜呼啦呼 你已被解除禁止发言`,
            `${at('other')} 人品大爆发 您被${username}解除了禁止发言`,
            `${at('other')} ${username}已解除您的禁止发言`
        ]
    ],
    equal: ({ other: { name }, operations: { at, face } }) => [
        `${at('user')} 本是同根生 相煎何太急`,
        `${at('user')} 小心${name}干你嗷${face(178)}`,
        `${at('user')} 都是同行 别这样`
    ],
    level: ({ operations: { at } }) => [
        `${at('user')} 抱歉 小秋暂时无法帮您完成此操作`,
        `${at('user')} 哎呀 小秋还没有[解除禁止发言]指令的权限呢`
    ]
}
const fn: CommandFn = originData => {
    const { group, other } = originData
    const isHave = judgeMemberNotSpeak(group.id, other.id)
    // 如果已经处于禁止发言期间了
    if (!isHave) return { items: 1 }
    const id = String(group.id) + String(other.id)
    persons.delete(id)
    return { items: 2 }
}
const relieveNotAllowedSpeak = { fn, sendContent }

export { relieveNotAllowedSpeak }
