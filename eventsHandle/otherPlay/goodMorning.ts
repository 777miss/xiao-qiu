/**
 * [早]指令：
 * 问候
 */
import path from 'path'

import type { SendContent, CommandFn } from '../../lib/interface'

const sendContent: SendContent = {
    name: '早',
    reg: [
        /^早$/,
        /^早小秋$/,
        /^小秋早$/,
        /^小秋早安$/,
        /^早，小秋$/
    ],
    role: 'member',
    deverDefined: ({ user: { name }, defined: { img }, operations: { at } }) => [
        [
            `${at('user')} 早 小秋才刚睡醒哦~`,
            `早 ${name}`,
            `${name}，早安`
        ],
        [
            `${at('user')} 不早了，干活吧${img}`,
            `${name}，这还早啥？？？赶紧上号${img}`,
            `${at('user')} 不早了哦，一起来了解下React18新特性吧~${img}`
        ]
    ]
}
const fn: CommandFn = originData => {
    const { operations: { promiseImage } } = originData
    const hours = new Date().getHours()
    if (hours >= 6 && hours <= 10) return { items: 1 }
    const url = path.resolve('./assets/images/emoji/代码相关/goVScode.jpg')
    const img = promiseImage(url)
    return { items: 2, args: { img } }
}
const goodMorning = { fn, sendContent }

export { goodMorning }
