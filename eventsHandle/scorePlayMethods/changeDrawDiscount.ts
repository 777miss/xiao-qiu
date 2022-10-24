/**
 * [修改积分抽奖折扣]指令：
 * 用于修改积分抽奖的折扣数（5-9折）
 */
import {
    getAssignTimestamp,
    transformTimeNameEn,
    getWholeDate,
    getSpecificTimeMS
} from '../../lib/time'

import { AuthId, GroupAt } from '../../lib/interface'
import type { SendContent, CommandFn } from '../../lib/interface'
import type { GroupsConfig } from '../../database/forms/interface'
import type { UnitChi } from '../../lib/time/interface'
import type { OicqOperations } from '../../lib/oicq/interface'

const member = (at: GroupAt, sex: boolean, face: OicqOperations['face']) => {
    const male = [
        `${at('user')} 好哥哥 你干嘛要开启折扣呀${face(104)}`,
        `${at('user')} 小秋不能帮您开启哦~${face(104)}`,
        `${at('user')} 呜呜呜 因为不能帮哥哥开启折扣，所以小秋的心好痛${face(104)}`
    ]
    const female = [
        `${at('user')} 小秋只会帮我的好闺蜜开启哦~${face(104)}`,
        `${at('user')} 呜呜 答应做小秋的闺蜜，小秋就帮您开启哦${face(104)}`,
        `${at('user')} 呜呜呜 因为不能帮给小姐姐使用折扣了，所以小秋的心好痛痛${face(104)}`
    ]
    return sex ? male : female
}
const sendContent: SendContent = {
    name: '抽奖限时折扣',
    reg: /^积分抽奖池开启(?<discount>\d+)折，为期(?<dur>\d*)(?<unit>.*)$/,
    role: [AuthId.FuncJin],
    member: ({ user: { sex }, operations: { at, face } }) => member(at, sex, face),
    admin: ({ user: { sex }, operations: { at, face } }) => member(at, sex, face),
    owner: ({ user: { sex }, operations: { at, face } }) => member(at, sex, face),
    deverDefined: ({ operations: { at }, defined: { unit, dur, discount, lastTime } }) => [
        [
            `${at('user')} ${discount}折不行哦，小秋能够帮您开启的折扣数必须要处于5-9期间`,
            `${at('user')} 哎呀 小秋暂时只能开启5-9折，还不支持${discount}折哦~`,
            `${at('user')} ${discount}折不行啊，折扣数必须位于5-9之间哦~`
        ],
        [
            `${at('user')} 给个时间单位哦~`,
            `${at('user')} 听说没有准确的时间，是不能够开启积分抽奖池限时折扣的`,
            `${at('user')} 咦 没有具体的期限是不能开启限时折扣哦~`
        ],
        [
            `${at('user')} 小秋认为${unit}不是合格的时间单位哦~`,
            `${at('user')} 小秋暂时还不认识${unit}哎~`,
            `${at('user')} 不能够是${unit}哦，换个时间单位再试试吧`
        ],
        [
            `${at('user')} ${unit}不合法哦，换个时间再试试吧`,
            `${at('user')} ${unit}太小了呀，尝试换个大一点的时间`,
            `${at('user')} 小秋觉得${unit}不符合折扣期限，换个时间段再试试吧~`
        ],
        [
            `积分奖池已开启为期${dur}${unit}的限时折扣(${discount}折)，快来抽奖吧~${lastTime}`,
            `${at('user')} 小秋已将奖池折扣改为${discount}折，并且会持续${dur}${unit}哦${lastTime}`,
            `哇 积分抽奖池${discount}折来袭，持续${dur}${unit}，赶紧来抽奖吧！${lastTime}`,
            `${at('user')} 小秋已开启积分抽奖池的限时折扣，听说连续水群的抽中概率更高哦~${lastTime}`
        ]
    ]
}
const fn: CommandFn = async originData => {
    const { bot, group, raw_message, reg, database } = originData
    const { getDataBaseData, formSet: { groups_config } } = database
    const { dur, unit, discount: drawDiscount } = reg.exec(raw_message)?.groups!
    const discount = Number(drawDiscount) as GroupsConfig['draw']['discount']
    if (discount < 5 || discount > 9) return { items: 1, args: { discount } }
    const timeKey = transformTimeNameEn[unit as UnitChi]
    if (!dur) return { items: 2 }
    if (!timeKey) return { items: 3, args: { unit } }
    if (Number(dur) <= 0) return { items: 4, args: { dur } }
    const initTime = { mins: 0, hours: 0, days: 0 }
    const nextTime = { ...initTime, [timeKey]: dur }
    const timestamp = getAssignTimestamp(nextTime)
    const config = await getDataBaseData(groups_config.name, groups_config.retrieveData)(group.id)
    const draw = { ...config.draw, discount, timestamp }
    await getDataBaseData(groups_config.name, groups_config.updateData)(group.id, { ...config, draw })
    const lastTime = `\n[${getWholeDate(new Date(timestamp))}分会自动关闭]`
    setTimeout(() => {
        bot.sendGroupMsg(group.id, '小秋已关闭积分抽奖池限时折扣')
    }, getSpecificTimeMS(nextTime))
    return { items: 5, args: { unit, dur, lastTime, discount } }
}
const changeDrawDiscount = { fn, sendContent }

export { changeDrawDiscount }
