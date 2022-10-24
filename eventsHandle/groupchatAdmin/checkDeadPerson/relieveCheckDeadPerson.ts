/**
 * [解除人机验证]指令：
 * 用于为某位成员手动解除人机验证，解除后，当前成员不受“人机验证”的任何限制
 */
import path from 'path'

import { persons, inCheckDeadOf } from './tools'

import type { SendContent, CommandFn } from '../../../lib/interface'

const sendContent: SendContent = {
    name: '解除人机验证',
    reg: /^\s*解除人机验证\[CQ:at,qq=(?<qq>\d*),text=.*\]\s*$/,
    role: 'admin',
    member: ({ user: { sex, name }, operations: { at, face, promiseImage } }) => [
        `${at('user')} 您的权限不足以进行解除人机验证的操作${promiseImage(path.resolve('./assets/images/emoji/反了你了1.jpg'))}`,
        `${name}，抱歉 小秋检测到您暂未拥有[解除人机验证]指令的权限`,
        `${at('other')}${sex ? '哥哥' : '姐姐'}，<${at('user')}>要对你进行人机验证${face(178)}`,
        `${at('user')} 要造反了？？？这[解除人机验证]可不能说用就用啊`,
        `${name}，迎难而上？？小心被反验证哦~`,
        `${at('user')} 抱歉 小秋不能帮您执行该指令`
    ],
    deverDefined: ({ user: { name: username, sex }, other: { name: othername }, operations: { at, face, promiseImage } }) => [
        [
            `${at('user')} 哎呀 ${othername}当前未在进行人机验证哦，因此无需解除`,
            `${at('user')} 小秋检测到${othername}未处于人机验证环节，可以不用解除哦${face(176)}`,
            `${at('user')} 不可以对未进行人机验证的成员进行解除哦~`,
            `${at('other')} 快谢谢${username}，虽然你没有在进行人机验证，但${sex ? '他' : '她'}还想帮你解除哦~${promiseImage(path.resolve('./assets/images/emoji/比心3.jpg'))}`
        ],
        [
            `${at('other')} ${username}已关闭您目前所处于的人机验证阶段${face(180)}`,
            `${at('other')} 您当前所进行的人机验证已关闭\n[来自${username}]`,
            `${at('other')} 人品大爆发 ${username}帮您解除了人机验证${promiseImage(path.resolve('./assets/images/emoji/朋友醒醒1.jpg'))}`
        ]
    ],
    equal: ({ other: { name }, operations: { at, face } }) => [
        `${at('user')} 大家都一样 不用给${name}解除${face(178)}`,
        `${at('user')} 哎呀 ${name}不需要小秋进行解除人机验证哦`,
        `${at('user')} 放心好啦 ${name}能够免疫人机验证`
    ],
    level: ({ operations: { at, promiseImage } }) => [
        `${at('user')} 抱歉 小秋暂时无法使用[解除人机验证]指令`,
        `${at('user')} 很抱歉 小秋权限不足${promiseImage(path.resolve('./assets/images/emoji/我一路向北。离开有你的季节1.jpg'))}`,
        `${at('user')} 抱歉 小秋暂时无法为其解除人机验证环节`
    ]
}
const fn: CommandFn = originData => {
    const { group, other } = originData
    // 判断是否已经处于人机验证当中
    const haved = inCheckDeadOf(group.id, other.id)
    if (!haved) return { items: 1 }
    // 否则进行关闭
    const id = String(group.id) + String(other.id)
    const { token } = persons.get(id)!
    clearTimeout(token)
    persons.delete(id)
    return { items: 2 }
}
const relieveCheckDeadPerson = { fn, sendContent }

export { relieveCheckDeadPerson }
