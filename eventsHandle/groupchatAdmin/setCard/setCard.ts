/**
 * [改群昵称]指令：
 * 修改指定成员的群昵称。由于群昵称可遵循的规则较多，但小秋采用的是 地区简称-性别-昵称 形式，其修改的规则或稍有不同
 */
import path from 'path'

import {
    isCardRule,
    getChangeAllCard,
    getChangeProvinceCard,
    getChangeSexCard,
    getChangeNicknameCard
} from './tools'

import type { SendContent, CommandFn } from '../../../lib/interface'

const sendContent: SendContent = {
    name: '改群昵称',
    reg: [
        /^改群昵称\[CQ:at,qq=\w*,text=@(?<card>.*)\]\s*$/,
        /^修改群昵称\[CQ:at,qq=\w*,text=@(?<card>.*)\]\s*$/,
        /^换群昵称\[CQ:at,qq=\w*,text=@(?<card>.*)\]\s*$/
    ],
    role: 'admin',
    member: ({ other: { name }, operations: { at, promiseImage } }) => [
        `${at('user')} 对不起 您的权限不足以修改${name}的群昵称`,
        `${at('user')} 很抱歉 小秋检测到您没有修改${name}群昵称的权限${promiseImage(path.resolve('./assets/images/emoji/万用表情/1.jpg'))}`,
        `${at('user')} 当前指令只能由管理/群主去使用哦~`
    ],
    deverDefined: ({ defined: { card, result }, operations: { at, face } }) => [
        [
            `${at('user')} 检测到<${card}>符合我群已制定的群昵称规则，因此无需更改`,
            `${at('user')} 抱歉 小秋暂时无法对已经符合群昵称规则的昵称进行更改`,
            `${at('user')} 小秋检测到群昵称<${card}>符合规则，因此无需更改${face(174)}`
        ],
        [
            `${at('other')} 小秋检测到群昵称<${card}>不符合我群已制定的规则，现已将其更改为<${result}>`,
            `${at('other')} 因为<${card}>不符合本群所制定的昵称规则，因此我已将其更改为<${result}>`,
            `${at('other')} 小秋已将您的原群昵称<${card}>更改为<${result}>`
        ],
        [
            `${at('other')} 小秋检测到群昵称<${card}>中的省份不符合规则，现已将其修改为<${result}>`,
            `${at('other')} 因为<${card}>的省份不符合本群所制定的昵称规则，因此我已将其修改为<${result}>`,
            `${at('other')} 小秋已将<${card}>中的省份给您修改为<${result}>`
        ],
        [
            `${at('other')} 小秋检测到群昵称<${card}>中的性别不符合规则，现已将其修改为<${result}>`,
            `${at('other')} 因为<${card}>的性别不符合本群所制定的昵称规则，因此我已将其修改为<${result}>`,
            `${at('other')} 小秋已将<${card}>中的性别给您修改为<${result}>`
        ],
        [
            `${at('other')} 小秋检测到群昵称<${card}>中的名称不符合规则，现已将其修改为<${result}>`,
            `${at('other')} 因为<${card}>的名称不符合本群所制定的昵称规则，因此我已将其修改为<${result}>`,
            `${at('other')} 小秋已将<${card}>中的名称给您更改为<${result}>`
        ]
    ],
    equal: ({ other: { name }, operations: { at } }) => [
        `${at('user')} 抱歉 小秋无法修改对方群昵称`,
        `小秋暂时无法修改${name}的群昵称`,
        `${at('user')} 别对自己人修改群昵称呀`
    ],
    level: ({ other: { name } }) => [
        `小秋权限不够哦，无法修改${name}的群昵称`,
        `很抱歉 小秋暂无此权限`,
        `抱歉 小秋暂时无法使用该指令去修改${name}的群昵称`
    ]
}
const bar = [
    {
        type: 'none',
        getCard: getChangeAllCard,
        items: 2
    },
    {
        type: 'province',
        getCard: getChangeProvinceCard,
        items: 3
    },
    {
        type: 'sex',
        getCard: getChangeSexCard,
        items: 4
    },
    {
        type: 'nickname',
        getCard: getChangeNicknameCard,
        items: 5
    }
]
// 修改用户群昵称
const fn: CommandFn = async originData => {
    const { bot, group, other: { id, card, nickname } } = originData
    const { flag, reason } = await isCardRule(bot, group.id, id)
    // 群昵称符合规则
    if (flag) return { items: 1, args: { card } }
    const { getCard, items } = bar.find(({ type }) => type === reason)!
    const result = await getCard(bot, group.id, id)
    bot.setGroupCard(group.id, id, result)
    return { items, args: { card: card ? card : nickname, result } }
}
const setCard = { fn, sendContent }

export { setCard }
