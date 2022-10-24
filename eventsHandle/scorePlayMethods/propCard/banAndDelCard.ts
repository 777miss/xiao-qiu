/**
 * [禁言卡]、[撤回卡]指令：
 * 禁言卡会自动禁言指定成员5分钟，撤回卡会自动撤回指定成员的1条消息
 */
import { setPacksack } from '../packsack/tools'

import type { SendContent, CommandFn } from '../../../lib/interface'

const sendContent: SendContent = {
    name: '道具卡',
    reg: /^(?<type>(禁言)|(撤回))卡\[CQ:at,qq=(?<qq>\d*),text=.*\]\s*$/,
    role: 'member',
    member: ({ user: { name }, operations: { at } }) => [
        `小小${name} 可笑可笑，您的背包为空，所以小秋不能帮您使用此道具哦~`,
        `${name}，您背包目前为空，暂时无法使用，赶快去获取吧~`,
        `${at('user')} 您的背包中尚不存在此道具哦，因此无法使用`
    ],
    admin: ({ user: { name }, operations: { at } }) => [
        `小小管理 ${name}，可笑可笑，背包为空，所以小秋不能帮您使用此道具哦~`,
        `${name}，您还没有此道具卡，赶快去获取吧~`,
        `${at('user')} 管理大哥 你背包里还没有道具卡呢，因此小秋无法使用`
    ],
    owner: ({ user: { name }, operations: { at } }) => [
        `小小群主 ${name}，可笑可笑，背包为空，所以不能使用！！`,
        `${name}，您还没有此道具卡哎，赶快去获取吧~`,
        `${at('user')} 我说群主啊 你背包里还没有道具卡呢，小秋不能帮您使用`
    ],
    deverDefined: ({ user: { name: username }, other: { name: othername }, operations: { at } }) => [
        [
            `${at('user')} 小秋发现您的背包中不存在禁言卡，所以无法使用`,
            `${at('user')} 不要妄图欺骗小秋哦 因为您背包中不存在禁言卡，所以无法使用`,
            `${username}，你还没有禁言卡呢，赶快去获取吧~`
        ],
        [
            `${at('user')} 很不幸，对方<${at('other')}>自动消耗一张免疫卡，免除了此次禁言`,
            `${at('user')} 唉 真不凑巧 <${at('other')}>自动消耗一张免疫卡，竟然免除了此次禁言`,
            `${at('user')} 芭比Q啦，<${at('other')}>自动消耗一张免疫卡，免除了此次禁言`
        ],
        [
            `${at('user')} 小秋发现您的背包中还没有撤回卡哦，所以无法使用~`,
            `${at('user')} 小秋看到您的撤回卡数量为0，所以无法使用~`,
            `${username}，你还没有撤回卡呢，赶快去获取吧~`
        ],
        [
            `${at('user')} 灰常抱歉，<${at('other')}>自动消耗一张免疫卡，免除了此次撤回`,
            `${at('user')} <${at('other')}>自动消耗一张免疫卡，免除了此次撤回`,
            `${at('user')} 芭比Q啦，<${at('other')}>自动消耗一张免疫卡，免除了此次撤回`
        ],
        [
            `${at('user')} 小秋没有看到${othername}发言哦~\n[撤回卡已自动消耗]`,
            `${at('user')} 咦 是我眼花了吗？好像${othername}没有发言哦~\n[撤回卡已自动消耗]`,
            `${at('user')} 小秋检测到${othername}没有发言啊\n[撤回卡已自动消耗]`
        ]
    ],
    equal: ({ other: { name, role }, operations: { at } }) => [
        `${at('user')} 先不扣你的卡了 下次不准向${name}使用了`,
        `${at('user')} 飘了是吧 还敢对${name}用道具卡？？`,
        `${at('user')} 再向${role === 'admin' ? '管理' : '群主'}使用道具卡 小心我干你`
    ],
    level: () => [
        `对不起，小秋权限不足，您暂时无法发挥此卡的最大价值\n[暂未扣除此道具卡数量]`,
        `呜呜呜 就连小秋都好难过，使用道具卡失败，因为小秋无此权限~\n[暂未扣除此道具卡数量]`,
        `哭了 小秋竟然没有权限去帮您使用此卡\n[暂未扣除此道具卡数量]`
    ]
}
const fn: CommandFn = async originData => {
    const { group, user, other, raw_message, operations, reg, database } = originData
    const { getDataBaseData, formSet: { user_packsack } } = database
    const { delMsg, banMember } = operations
    const value = await getDataBaseData(user_packsack.name, user_packsack.retrieveData)(group.id)
    const curUser = value[user.id]
    if (!curUser) return
    const { card } = curUser
    const type = reg.exec(raw_message)?.groups?.type
    const allOtherCard = value[other.id]?.card
    if (type === '禁言') {
        if (!card.ban) return { items: 1 }
        setPacksack(group.id, user.id, { card: { ban: -1 } })
        if (allOtherCard?.immune) {
            setPacksack(group.id, other.id, { card: { immune: -1 } })
            setPacksack(group.id, user.id, { card: { ban: -1 } })
            return { items: 2 }
        }
        // 对方无免疫卡，且自己拥有禁言卡时，视为使用成功
        banMember(group.id, other.id, '分钟', 5)
        return { noMsg: true }
    }
    if (!card.delMsg) return { items: 3 }
    setPacksack(group.id, user.id, { card: { delMsg: -1 } })
    if (allOtherCard?.immune) {
        setPacksack(group.id, other.id, { card: { immune: -1 } })
        setPacksack(group.id, user.id, { card: { delMsg: -1 } })
        return { items: 4 }
    }
    // 对方无免疫卡，且自己拥有撤回卡时，视为使用成功
    const count = await delMsg(group.id, other.id, 1)
    if (!count) return { items: 5 }
    return { noMsg: true }
}
const banAndDelCard = { fn, sendContent }

export { banAndDelCard }
