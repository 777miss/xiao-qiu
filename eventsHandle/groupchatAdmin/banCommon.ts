/**
 * [禁言]指令：
 * 禁言指定成员，禁言的时间由时间单位决定
 */
import path from 'path'

import { belong } from '../../lib/time'

import type { SendContent, CommandFn } from '../../lib/interface'

const sendContent: SendContent = {
    name: '禁言',
    reg: /^禁言(?<durStr>\d*)(?<unit>.*)\[CQ:at,qq=\d*,text=.*\]\s*$/,
    role: 'admin',
    member: ({ user: { name }, operations: { at } }) => [
        `${at('user')} 想啥呢 禁言指令得管理/群主才可以触发哦~`,
        `${at('other')} ${name}要禁言你`,
        `${at('user')} 抱歉 您没有禁言权限哦`
    ],
    deverDefined: ({ user: { name, sex }, defined: { dur, max, unit }, operations: { at, face, promiseImage } }) => [
        [
            `${at('user')} 最低禁言的时间单位为1`,
            `${at('user')} ${sex ? '老弟' : '老妹'}，你这单位不太对劲啊${promiseImage(path.resolve('./assets/images/emoji/给你一小巴掌1.jpg'))}`,
            `${name}，小秋提示您 最低可禁言的时间单位为1`
        ],
        [
            `${at('user')} 怎么还有按年为单位禁言的啊！`,
            `${at('user')} 禁言单位不能是年`,
            `${at('user')} 禁言${dur}年？？${face(291)}`,
            `${name}，事不能做的太绝 哪有按年禁言的呀`
        ],
        [
            `${at('user')} 单位错误`,
            `${name} 单位错了！单位错了！`,
            `${at('user')} 小秋检测到您输入的禁言时间单位错误${face(283)}`,
            `${at('user')} 小秋暂时还不认识当前时间单位哦~`
        ],
        [
            `${at('user')} 不行~最长禁言时间为${max}${unit}`,
            `${name}，超过最长禁言时间${max}${unit}了`,
            `${at('user')} 小秋提示您最长禁言时间为${max}${unit}${promiseImage(path.resolve('./assets/images/emoji/我突然烦你了拜拜1.jpg'))}`
        ]
    ],
    equal: ({ user: { name: username }, other: { name: othername }, operations: { at, face } }) => [
        `${at('user')} 对不起，小秋无法帮您进行禁言${face(187)}`,
        `${at('other')} ${username}要禁言你`,
        `${at('user')} 别搞事 我可不敢禁言${othername}`
    ],
    level: ({ operations: { at } }) => [
        `${at('user')} 抱歉 小秋权限不足 暂时不能帮您执行禁言操作哦~`,
        `${at('user')} 小秋暂时无法为您执行禁言操作`
    ]
}
const fn: CommandFn = originData => {
    const { group, other, raw_message, reg, operations: { banMember } } = originData
    // 禁言时间的单位只能是分钟、小时、秒
    const { durStr, unit } = reg.exec(raw_message)?.groups!
    const dur = Number.parseFloat(durStr)
    if (dur < 1) return { items: 1 }
    if (unit === '年') return { items: 2, args: { dur } }
    if (unit !== '分钟' && unit !== '小时' && unit !== '天') return { items: 3 }
    // 最多只能禁言30天的时间(30天，720小时，43200分钟)
    if (dur > belong[unit].max) return { items: 4, args: { max: belong[unit].max, unit } }
    banMember(group.id, other.id, unit, dur)
    return { noMsg: true }
}
const banCommon = { fn, sendContent }

export { banCommon }
