/**
 * [警告]指令：
 * 撤回指定成员的全部消息，并禁言15分钟
 */
import path from 'path'

import type { SendContent, CommandFn } from '../../lib/interface'

const sendContent: SendContent = {
    name: '警告',
    reg: /^警告\[CQ:at,qq=(?<qq>\d*),text=.*\]\s*$/,
    role: 'admin',
    member: ({ user: { name }, other: { role }, operations: { at, promiseImage } }) => [
        `${at('user')} 等你成为管理就可以警告别人了`,
        `${at('user')} 这指令只有管理or群主才可以触发哦~`,
        `${at('user')} 想弄${role === 'admin' ? '管理' : '群主'}搞事情？`,
        `${at('other')} ${name}想要警告你${promiseImage(path.resolve('./assets/images/emoji/麻了1.jpg'))}`
    ],
    admin: ({ user: { name }, operations: { at } }) => [
        `${at('other')} 小秋发现管理员${name}对您发出了[警告]指令，因此小秋已撤回您1小时内所有消息，并禁言以作警告`,
        `${at('other')} 呜呜呜 小秋被臭管理逮到了，${name}对您发出了[警告]指令，因此小秋已撤回您1小时内所有消息，并禁言以作警告`,
        `${at('other')} 请务必文明发言。[本次已撤回您1小时内所有消息，并禁言以作警告]`
    ],
    owner: ({ user: { name }, operations: { at } }) => [
        `${at('other')} 小秋发现群主大人${name}对您发出了[警告]指令，因此小秋已撤回您1小时内所有消息，并禁言以作警告`,
        `${at('other')} 呜呜呜 小秋被臭群主逮到了，${name}对您发出了[警告]指令，因此小秋已撤回您1小时内所有消息，并禁言以作警告`,
        `${at('other')} 请务必文明发言。[本次已撤回您1小时内所有消息，并禁言以作警告]`
    ],
    equal: ({ user: { name: username }, other: { name: othername }, operations: { at, face } }) => [
        `${at('user')} 嗯？？大家都是同道中人，干嘛要禁言${othername}呢`,
        `${at('user')} 糟了 小秋无法帮您进行警告`,
        `${at('other')} ${username}要警告你！${face(278)}`
    ],
    level: ({ operations: { at } }) => [
        `${at('user')} 抱歉 小秋权限不足 暂时不能帮您执行警告操作哦~`,
        `${at('user')} 小秋暂无此权限`
    ]
}
const fn: CommandFn = originData => {
    const { group, other, operations } = originData
    operations.delMsg(group.id, other.id, 0)
    operations.banMember(group.id, other.id, '分钟', 15)
}
const alert = { fn, sendContent }

export { alert }
