/**
 * [小秋小秋]指令：
 * 查看小秋是否处于在线状态
 */
import { getCurTime, getCurTimeAlias } from '../../lib/time'

import type { GroupAt } from '../../lib/interface'
import type { SendContent, CommandFn } from '../../lib/interface'

const male = (at: GroupAt, name: string) => [
    `小秋一直在`,
    `${at('user')} ${getCurTimeAlias()}`,
    `披荆斩棘的${name}，你好呀`,
    `${at('user')} Hi，你想做我的小迷弟吗？`,
    `${at('user')} 兄弟，${getCurTime()}了，你想干啥`,
    `${name}哥哥好`,
    `小秋暂时不在哦，${getCurTime()}了，眯一会~`
]
const female = (at: GroupAt, name: string) => [
    `${at('user')} 来了来了，请问小秋可以做你的闺蜜吗`,
    `${at('user')} 姐姐是想小秋了嘛~`,
    `小秋一直在的哦`,
    `乘风破浪的${name}，你好`,
    `${at('user')} 如果小秋会魔法的话，那你会做小秋的迷妹嘛`,
    `小秋来啦`
]
const reg = [
    /^小秋小秋$/,
    /^在吗小秋$/,
    /^你好小秋$/,
    /^小秋你好$/,
    /^嘿小秋$/,
    /^小秋在吗$/,
    /^嘿，小秋$/,
    /^小秋同学$/,
    /^秋总$/,
    /^小秋$/,
    /^小小秋$/,
    /^秋秋$/
]
const admin = (at: GroupAt, name: string, sex: boolean) => {
    const maleFn = () => {
        const arrs = male(at, name)
        const text = [
            `${at('user')} 管理哥哥，小秋一直在这里哦`,
            `${at('user')} 管理哥哥你好，我叫小秋~`,
            `${at('user')} 小秋好想拥有一个身为管理员的小迷弟哦~`
        ]
        return [...arrs, ...text]
    }
    const femaleFn = () => {
        const arrs = female(at, name)
        const text = [
            `${at('user')} 管理姐姐，小秋会一直陪伴你哦`,
            `${at('user')} 管理姐姐你好，我叫小秋，你可以叫我秋秋哦`,
            `${at('user')} 小秋也想拥有一个身为管理员的小迷妹哦~`
        ]
        return [...arrs, ...text]
    }
    const result = sex ? maleFn() : femaleFn()
    return result
}
const owner = (at: GroupAt, name: string, sex: boolean) => {
    const maleFn = () => {
        const arrs = male(at, name)
        const text = [
            `${at('user')} 群主大人，小秋一直在哦`,
            `${at('user')} 如果群主是小秋的小迷弟就好咯~`
        ]
        return [...arrs, ...text]
    }
    const femaleFn = () => {
        const arrs = female(at, name)
        const text = [
            `${at('user')} 群主姐姐，小秋会一直陪伴你哦`,
            `${at('user')} 如果群主是小秋的小迷妹就太棒啦~`
        ]
        return [...arrs, ...text]
    }
    const result = sex ? maleFn() : femaleFn()
    return result
}
const sendContent: SendContent = {
    name: '小秋你好',
    reg,
    role: 'member',
    member: ({ user: { name, sex }, operations: { at } }) => sex ? male(at, name) : female(at, name),
    admin: ({ user: { name, sex }, operations: { at } }) => admin(at, name, sex),
    owner: ({ user: { name, sex }, operations: { at } }) => owner(at, name, sex)
}
const fn: CommandFn = () => { }
const isXiaoQiuOnline = { fn, sendContent }

export { isXiaoQiuOnline }
