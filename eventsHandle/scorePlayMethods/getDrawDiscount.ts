/**
 * [查积分抽奖折扣]指令：
 * 查询当前群聊中积分抽奖池的折扣数及折扣时间
 */
import { getWholeDate } from '../../lib/time'
import { isDiscount } from './draw/tools'

import type { SendContent, CommandFn } from '../../lib/interface'

const sendContent: SendContent = {
    name: '查询限时折扣',
    reg: [
        /^查询积分抽奖折扣$/,
        /^查询积分抽奖池折扣$/,
        /^积分抽奖池折扣$/,
        /^积分抽奖折扣$/,
        /^抽奖折扣$/,
        /^积分折扣$/
    ],
    role: 'member',
    deverDefined: ({ operations: { at }, defined: { discount, lastTime } }) => [
        [
            `${at('user')} 小秋查询到当前尚不处于折扣期间哦~`,
            `${at('user')} 积分抽奖池当前未进行限时折扣`,
            `${at('user')} 小秋发现当前不属于折扣期间`
        ],
        [
            `${at('user')} 哇 现在正是奖池的折扣时间呀！${lastTime}前都是${discount}折哦~`,
            `${at('user')} 小秋听说${lastTime}前都是${discount}折呦`,
            `${at('user')} 这不巧了嘛 ${lastTime}前，积分抽奖池都是${discount}折的折扣哦~`
        ]
    ]
}
const fn: CommandFn = async originData => {
    const { group } = originData
    const { flag, discount, timestamp } = await isDiscount(group.id)
    if (!flag) return { items: 1 }
    const lastTime = getWholeDate(new Date(timestamp!))
    return { items: 2, args: { discount, lastTime } }
}
const getDrawDiscount = { fn, sendContent }

export { getDrawDiscount }
