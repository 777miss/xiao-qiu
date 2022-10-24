/**
 * [撤回]指令：
 * 撤回指定成员的消息，撤回的条数可选，默认为全部
 */
import path from 'path'

import type { SendContent, CommandFn } from '../../lib/interface'

const sendContent: SendContent = {
    name: '撤回',
    reg: /^撤回(?<num>\d*)\[CQ:at,qq=(?<qq>\d*),text=.*\]\s*$/,
    role: 'admin',
    member: ({ operations: { at, promiseImage } }) => [
        `${at('user')} 想啥呢 撤回指令得管理/群主才可以触发哦~`,
        `${at('user')} 抱歉 您暂无撤回权限${promiseImage(path.resolve('./assets/images/emoji/轻轻敲打沉睡的心灵1.jpg'))}`,
        `${at('user')} 小秋检测到您暂无撤回权限`
    ],
    deverDefined: ({ user: { sex }, other: { name }, defined: { count }, operations: { at, face, promiseImage } }) => [
        [
            `${at('user')} 请输入有效条数`,
            `${at('user')} ${sex ? '老弟' : '老妹'}，这撤回条数不对啊${promiseImage(path.resolve('./assets/images/emoji/您可蒜了吧1.jpg'))}`,
            `${at('user')} 小秋提示您请输入一个合法的撤回条数`
        ],
        [
            `${at('user')} 检测到${name}并没有发送${count}条消息，建议减少要撤回的消息条数`,
            `${at('user')} 超载了！${name}并没有发送${count}条消息\n[建议减少要撤回的消息条数]`,
            `${at('user')} 撤回条数的太多啦，您可以减少要撤回的消息条数 然后重新进行尝试${promiseImage(path.resolve('./assets/images/emoji/我突然烦你了拜拜1.jpg'))}`
        ],
        [
            `${at('other')} 已撤回您${count}条消息，请注意言辞 文明且积极发言，下次不再警告${face(179)}`,
            `${at('other')} 小秋已撤回您${count}条消息，请不要再次发送类似的言论`,
            `${at('other')} 您被小秋撤回了${count}条消息，小秋提醒您一定要遵守群规哦~`
        ]
    ],
    equal: ({ user: { name }, operations: { at, face } }) => [
        `${at('user')} 对不起 小秋无法帮您撤回消息`,
        `${at('other')}，${name}要撤回你消息哎${face(174)}`
    ],
    level: ({ operations: { at } }) => [
        `${at('user')} 抱歉 小秋权限不足 暂时不能帮您撤回消息~`,
        `${at('user')} 呜呜 小秋权限不足 暂时不能帮您撤回消息~`
    ]
}
const fn: CommandFn = async originData => {
    const { group, raw_message, reg, operations: { delMsg } } = originData
    // 被艾特的人、以及要撤回几条
    const { qq, num } = reg.exec(raw_message)?.groups!
    const otherId = Number(qq)
    // 默认撤回全部
    if (num === '') {
        const rows = await delMsg(group.id, otherId, 0)
        return rows === 0 ? { items: 2, args: { count: 1 } } : undefined
    }
    // 撤回的条数小于等于0
    const row = Number(num)
    if (row <= 0) return { items: 1 }
    // 正确条数(不考虑当前群聊是否有消息产生，因为在使用撤回指令时，已经产生了消息)
    const count = await delMsg(group.id, otherId, row)
    // 撤回失败，因为对方没有发送消息
    if (count === 0) return { items: 2, args: { count: row } }
    // 撤回成功
    return { items: 3, args: { count } }
}
const delMemberMessage = { fn, sendContent }

export { delMemberMessage }
