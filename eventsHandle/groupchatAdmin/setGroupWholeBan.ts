/**
 * [全员禁言]指令：
 * 开启/关闭全员禁言，禁言的单位同[禁言]指令相同
 */
import { belong, secToFormat, getWholeDate } from '../../lib/time'

import type { SendContent, CommandFn } from '../../lib/interface'

const sendContent: SendContent = {
    name: '全员禁言',
    reg: /^(开启|关闭)全员禁言(?<dur>\d*)(?<unit>.*)$/,
    role: 'admin',
    member: ({ operations: { at } }) => [
        `${at('user')} 造反啊？小小成员 可笑可笑`,
        `${at('user')} 这全员禁言 说开就开？`,
        `${at('user')} 您无此权限~`
    ],
    deverDefined: ({ user: { sex }, defined, operations: { at } }) => [
        [
            `${at('user')} 全员禁言已被关闭`,
            `${at('user')} 小秋已关闭全员禁言~`,
            `${at('user')} ，${sex ? '哥哥' : '姐姐'} 小秋已经把全员禁言关闭了`
        ],
        [
            `${at('user')} 哎呀 最低全员禁言时间单位为1哦~`,
            `${at('user')} 小秋检测到了非法的时间单位，请重新尝试`,
            `${at('user')} 呜呜呜 小秋还不认识当前的时间单位哦~`
        ],
        [
            `${at('user')} 全员禁言${defined.dur}年，还让不让群友活了啊`,
            `${at('user')} 小秋不能帮您进行全员禁言${defined.dur}年`,
            `${at('user')} 全员禁言${defined.dur}年，这不符合美少女小秋的风格哦~`
        ],
        [
            `${at('user')} 请输入正确的时间单位`,
            `${at('user')} 小秋提示您 请输入正确的时间单位`,
            `${at('user')} 哎呀 小秋还不认识这个时间单位呢~`
        ],
        [
            `${at('user')} 最长可全员禁言时间为${defined.bMax}${defined.unit}`,
            `${at('user')} 小秋提醒您，最长可全员禁言时间为${defined.bMax}${defined.unit}`,
            `${at('user')} 呜呜 小秋最多只能帮您全员禁言${defined.bMax}${defined.unit}哦~`
        ],
        [
            `${at('user')} 芜湖 您已开启全员禁言${defined.time}\n${defined.nextTime}`,
            `小秋已开启全员禁言${defined.time}\n${defined.nextTime}`
        ]
    ],
    level: ({ operations: { at } }) => [
        `${at('user')} 抱歉 小秋权限不足 暂时不能帮您执行全员禁言操作哦~`,
        `${at('user')} 呜呜 小秋权限不足 暂时不能帮您执行全员禁言操作哦~`
    ]
}
const fn: CommandFn = originData => {
    const { bot, group, raw_message, reg } = originData
    // oicq1.x中无法得知当前是否处于全员禁言状态
    if (/^关闭全员禁言/gi.test(raw_message)) {
        bot.setGroupWholeBan(group.id, false)
        return { items: 1 }
    }
    const { dur, unit } = reg.exec(raw_message)?.groups!
    const durNum = Number.parseFloat(dur)
    if (durNum < 1) return { items: 2 }
    if (unit === '年') return { items: 3, args: { dur } }
    if (unit !== '分钟' && unit !== '小时' && unit !== '天') return { items: 4 }
    // 最多只能禁言30天的时间(30天，720小时，43200分钟)
    const bMax = belong[unit].max
    const bSec = belong[unit].sec(durNum)
    const bMs = bSec * 1000
    if (durNum > bMax) return { items: 5, args: { bMax, unit } }
    bot.setGroupWholeBan(group.id, true)
    const nextTime = getWholeDate(new Date(+new Date() + bMs))
    setTimeout(() => {
        bot.setGroupWholeBan(group.id, false)
    }, bMs)
    return { items: 6, args: { time: secToFormat(bSec), nextTime: `[${nextTime}]自动关闭` } }
}
const setGroupWholeBan = { fn, sendContent }

export { setGroupWholeBan }
