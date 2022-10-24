/**
 * [:]指令：
 * 使用在线聊天Api，与另一位机器人对话，其表现形式类似于语音助手。使用该指令会自动消耗当前用户1积分
 */
import request from 'request'

import { setPacksack } from '../scorePlayMethods/packsack/tools'

import type { GroupAt } from '../../lib/interface'
import type { SendContent, CommandFn } from '../../lib/interface'

const successTip = '\n[您消耗了1积分]'
const msg = (at: GroupAt, names: string) => [
    `${at('user')} 您的积分不足以完成此次对话`,
    `${names}，您的积分太少啦，不能够继续发起本次会话哦~`
]
const sendContent: SendContent = {
    name: '在线聊天',
    reg: /^:/,
    role: 'member',
    member: ({ user: { name }, operations: { at } }) => msg(at, name),
    admin: ({ user: { name }, operations: { at } }) => msg(at, name),
    owner: ({ user: { name }, operations: { at } }) => msg(at, name),
    deverDefined: ({ user: { name }, operations: { at }, defined }) => [
        [
            `${at('user')} 呜呜 必须输入有效内容才可以进行对话哦~\n[此次未消耗积分]`,
            `${at('user')} 咦？暂时没有发现您所输入的聊天内容哦~\n[此次未消耗积分]`,
            `${name} 主动一点呀，您可以输入更多的聊天内容来重新尝试发起此会话~\n[此次未消耗积分]`
        ],
        [
            `${at('user')} ${defined.content}${successTip}`,
            `${name}，${defined.content}${successTip}`
        ]
    ]
}
const fn: CommandFn = originData =>
    new Promise(async res => {
        const { group, user, raw_message, database } = originData
        const { getDataBaseData, formSet: { user_packsack } } = database
        const value = await getDataBaseData(user_packsack.name, user_packsack.retrieveData)(group.id)
        const curUser = value[user.id]
        if (!curUser) return res(undefined)
        const { score } = curUser
        if (Number(score) < 1) return res(undefined)
        const content = raw_message.replace(/:|\s/g, '')
        if (!content) return res({ items: 1, args: {} })
        const url = 'https://api.ownthink.com/bot?appid=xiaosi&userid=user&spoken=' + encodeURIComponent(content)
        request(url, (_: unknown, __: unknown, data: string) => {
            setPacksack(group.id, user.id, { score: -1 })
            const content = JSON.parse(data).data.info.text
            res({ items: 2, args: { content } })
        })
    })
const xiaoqiuChat = { fn, sendContent }

export { xiaoqiuChat }
