/**
 * [文案]指令：
 * 使用一言Api随机获取指定类型的文案
 */
import request from 'request'

import type { YiYanApi } from './interface'
import type { SendContent, CommandFn } from '../../lib/interface'

type WritingType = keyof typeof reqContent

const reqContent = {
    动画: 'a',
    漫画: 'b',
    游戏: 'c',
    文学: 'd',
    原创: 'e',
    网络: 'f',
    其它: 'g',
    影视: 'h',
    诗词: 'i',
    哲学: 'k'
}

const sendContent: SendContent = {
    name: '文案',
    reg: /^文案：(?<c>.*)\s*$/,
    role: 'member',
    deverDefined: ({ user: { name }, defined: { message }, operations: { at } }) => [
        [
            `${at('user')} 小秋发现您还没有输入文案类型`,
            `${name}，必须输入一个文案类型才可以哦~`,
            `${at('user')} 哎呀 没有文案类型的话，小秋无法帮您寻找哦~`
        ],
        [
            `${at('user')} 小秋发现您的文案类型有误，您可以尝试更换类型后重新进行搜索`,
            `${name}，哎呀 该类型走丢了，请换个类型重新尝试吧~`,
            `${at('user')} 暂时没有找到该文案类型哦`
        ],
        [`${name}，${message}`, `${message}`]
    ]
}

const fn: CommandFn = originData => {
    const { raw_message, reg } = originData
    return new Promise(resolve => {
        const type = reg.exec(raw_message)?.groups?.c as WritingType
        if (!type) return resolve({ items: 1, args: {} })
        const flag = Object.keys(reqContent).includes(type)
        if (!flag) return resolve({ items: 2, args: {} })
        const c = reqContent[type]
        request(`https://v1.hitokoto.cn`, { qs: { c, encode: 'json' } }, (err: unknown, rep: unknown, data: string) => {
            if (!!data) {
                const { from, from_who, hitokoto }: YiYanApi = JSON.parse(data)
                const writer = from_who ? from_who : ''
                const message = `${hitokoto}\n——${writer}《${from}》`
                resolve({ items: 3, args: { message } })
            }
        }
        )
    })
}
const getCopyWriting = { fn, sendContent }

export { getCopyWriting }
