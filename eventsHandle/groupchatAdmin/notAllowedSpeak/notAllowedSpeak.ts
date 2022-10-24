/**
 * [禁止发言]指令：
 * 当某成员被禁止发言后，其所发出的每一条消息都会被小秋撤回（但并不会将该成员禁言）
 */
import { persons, judgeMemberNotSpeak } from './tools'

import type { SendContent, CommandFn } from '../../../lib/interface'

const sendContent: SendContent = {
    name: '禁止发言',
    reg: /^禁止发言\[CQ:at,qq=\d*,text=.*\]\s*$/,
    role: 'admin',
    member: ({ other: { name }, operations: { at, face } }) => [
        `${at('user')} 要造反了吗？??`,
        `${at('user')} 你居然要禁止${name}发言${face(34)}`,
        `${at('user')} 等你成为管理or群主就可以禁止别人发言了~`
    ],
    deverDefined: ({ user: { name: username }, other: { name: othername }, operations: { at, face } }) => [
        [
            `${at('user')} 不带这么玩的 ${othername}已经处于禁止发言期间了`,
            `${at('user')} 别闹 小秋看到${othername}已经被禁止发言了`,
            `${at('user')} 不可以对${othername}同时使用两次[禁止发言]指令哦`
        ],
        [
            `${at('other')} 您现在已进入禁止发言期间`,
            `${username}已将${othername}列入禁止发言名单${face(178)}`,
            `${at('other')} 你已进入禁止发言期间，在此期间 您发送的所有消息都会被一一撤回`
        ]
    ],
    equal: ({ other: { name }, operations: { at, face } }) => [
        `${at('user')} 本是同根生 相煎何太急`,
        `${at('user')} 小心${name}干你嗷${face(178)}`,
        `${at('user')} 都是同行 别这样`
    ],
    level: ({ operations: { at } }) => [
        `${at('user')} 抱歉 小秋暂时无法帮您完成此操作`,
        `${at('user')} 哎呀 小秋还没有[禁止发言]指令的权限呢`
    ]
}
const fn: CommandFn = originData => {
    const { group, other } = originData
    const isHave = judgeMemberNotSpeak(group.id, other.id)
    // 如果已经处于禁止发言期间了
    if (isHave) return { items: 1 }
    const id = String(group.id) + String(other.id)
    persons.set(id, true)
    return { items: 2 }
}
const notAllowedSpeak = { fn, sendContent }

export { notAllowedSpeak }
