/**
 * [签到]指令：
 * 签到被触发时，会根据当前群成员的签到天数自动发放积分
 * （每日仅可签到一次，凌晨12:00重置次数）
 */
import path from 'path'

import { setPacksack } from '../scorePlayMethods/packsack/tools'

import type { SendContent, CommandFn } from '../../lib/interface'

const sendContent: SendContent = {
    name: '签到',
    reg: [
        /^签到$/,
        /^冒泡$/,
        /^打卡$/,
        /^活跃$/,
        /^摸鱼$/,
        /^疯狂星期四$/,
        /^肯德基疯狂星期四$/,
        /^vme50$/,
        /^v我50$/,
        /^v50$/
    ],
    role: 'member',
    deverDefined: ({ user: { name }, defined: { score }, operations: { at, face, promiseImage } }) => [
        [
            `${at('user')} 您今日已经签过到了哦~`,
            `${at('user')} 不允许重复签到，请明日再来吧`,
            `${at('user')} 今日已签到过了~\n[每日凌晨12点重置签到次数]`
        ],
        [
            `${at('user')} 努力做一位前端追梦人吧！\n${score}`,
            `${at('user')} 加油 前端人！${score}${face(183)}`,
            `${name}，不积跬步无以至千里 今天也要多多敲代码哦~\n${score}`,
            `${at('user')} 听说vue3与vite搭配 风味更佳哦~\n${score}`,
            `${name}，我们都在努力奔跑，我们都是追梦人\n${score}`,
            `${at('user')} 欲速则不达 今天你准备怎么提升自己呢？${score}${promiseImage(
                path.resolve('./assets/images/emoji/加倍焦虑1.jpg')
            )}`
        ]
    ]
}
const fn: CommandFn = async originData => {
    const { group, user, database } = originData
    const { getDataBaseData, formSet: { user_packsack, groups_config } } = database
    const value = await getDataBaseData(user_packsack.name, user_packsack.retrieveData)(group.id)
    const curUser = value[user.id]
    // 获取当前群聊的每日积分上限
    const groupConfig = await getDataBaseData(groups_config.name, groups_config.retrieveData)(group.id)
    const { score: { dailyLimit } } = groupConfig
    const isMaxCurScore = curUser ? curUser.curInc >= dailyLimit : false
    const update = () => {
        setPacksack(group.id, user.id, { score: dailyLimit, curInc: dailyLimit })
        return `积分+${dailyLimit}`
    }
    if (isMaxCurScore) return { items: 1 }
    const score = `[${update()}]`
    return { items: 2, args: { score } }
}

const signIn = { fn, sendContent }

export { signIn }
