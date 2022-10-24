/**
 * [晚安]指令：
 * 问候
 */
import request from 'request'

import { getCurTime } from '../../lib/time'

import type { SendContent, CommandFn } from '../../lib/interface'

const sendContent: SendContent = {
    name: '晚',
    reg: [
        /^晚安小秋$/,
        /^小秋晚安$/,
        /^晚安$/,
        /^晚安兄弟们$/
    ],
    role: 'member',
    deverDefined: ({ user: { name, sex }, defined: { hours, mins, text }, operations: { at } }) => [
        [
            `${at('user')} 这？？都${hours}:${mins}了，这个年纪你能睡得着吗？`,
            `${at('user')} ${hours}:${mins}，这个年纪你睡得下吗？`,
            `${at('user')} ${sex ? '哥哥' : '姐姐'}先睡吧！${hours}:${mins}分，小秋这时候还在上班哦`
        ],
        [
            `${at('user')} ${text}`,
            `${name}，${text}`
        ]
    ]
}
const fn: CommandFn = () =>
    new Promise(resolve => {
        const [hours, mins] = getCurTime().split(':')
        const nHours = Number(hours)
        if (nHours > 6 && nHours < 21) return resolve({ items: 1, args: { hours, mins } })
        request.get('https://api.lovelive.tools/api/SweetNothings', (err: unknown, req: unknown, text: string) => {
            resolve({ items: 2, args: { text } })
        })
    })
const goodNight = { fn, sendContent }

export { goodNight }
