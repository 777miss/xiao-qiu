/**、
 * [斗地主]指令：
 * 发送指定关键词后，小秋会随机发送一条有关斗地主的语句，仅作为一种娱乐玩法而存在
 */
import type { SendContent, CommandFn } from '../../lib/interface'

const arr = [
    '十七张牌，你能秒我？',
    '得得得得得得得得得得',
    '搞快点 搞快点',
    '这四百万是我最后的倔强',
    '心态崩了呀',
    '就这？',
    '这谁顶得住啊',
    '顶不住也要顶',
    '我能怎么办，我也很绝望啊',
    '快点啊，等到我花儿都谢了',
    '你的牌打的也太好了',
    '你是MM还是GG',
    '大家好，很高兴见到各位',
    '不要走，决战到天亮',
    '不好意思，我要离开一会',
    '嘿嘿 这局小秋一定会赢~'
]

const sendContent: SendContent = {
    name: '斗地主',
    reg: /^((王炸)|(炸弹)|(单牌)|(对牌)|(三张牌)|(三带一)|(三带二)|(三带一对)|(单顺)|(双顺)|(三顺)|(飞机带翅膀)|(飞机))$/,
    role: 'member',
    member: () => arr,
    admin: () => arr,
    owner: () => arr
}
const fn: CommandFn = () => { }
const landlords = { fn, sendContent }

export { landlords }
