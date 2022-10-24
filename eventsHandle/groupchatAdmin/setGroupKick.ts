/**
 * [踢]指令：
 * 将指定成员从群聊中移除
 */
import type { SendContent, CommandFn } from '../../lib/interface'

const sendContent: SendContent = {
    name: '踢',
    reg: /^踢\[CQ:at,qq=(?<qq>\d*),text=.*\]\s*$/,
    role: 'admin',
    member: ({ user: { sex }, operations: { at } }) => [
        `${at('user')} ${sex ? '哥哥' : '姐姐'}，等你当管理or成为群主就行了`,
        `${at('user')} 抱歉 您权限不足`,
        `${at('user')} 小秋检测到您暂无此权限`
    ],
    deverDefined: ({ other: { name }, operations: { at } }) => [
        [
            `${at('user')} 已撤回1小时内${name}发送的所有消息并将其踢出了群聊`,
            `${at('user')} 小秋已撤回1小时内${name}发送的所有消息并将其踢出了群聊`,
            `${at('user')} ${name}已被您撤回1小时内所有消息并被踢出了群聊`
        ]
    ],
    equal: ({ user: { name }, operations: { at } }) => [
        `${at('user')} 对不起 小秋无法帮您进行踢出`,
        `${at('other')} ${name}居然要把你踢出去`,
        `${at('user')} 小秋暂时无法帮您使用[踢]指令`
    ],
    level: ({ operations: { at } }) => [
        `${at('user')} 抱歉 小秋权限不足 暂时不能帮您执行踢出操作哦~`,
        `${at('user')} 呜呜 小秋权限不足 暂时不能帮您执行踢出操作哦~`
    ]
}
const fn: CommandFn = originData => {
    const { bot, group, other, operations } = originData
    operations.delMsg(group.id, other.id, 0)
    bot.setGroupKick(group.id, other.id)
    return { items: 1 }
}
const setGroupKick = { fn, sendContent }

export { setGroupKick }
