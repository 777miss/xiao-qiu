/**
 * [获取积分方式]指令：
 * 查询获取积分的途径有哪些
 */
import type { SendContent, CommandFn } from '../../lib/interface'

const way = `①通过每日签到\n[详见:菜单-群聊相关]\n\n②为小秋提出有效建议(15积分)\n[详见:菜单-群聊相关-提建议]\n\n③为小秋找出有效bug(30积分)\n[详见:菜单-群聊相关-提建议]`
const sendContent: SendContent = {
    name: '获取积分方式',
    reg: [
        /^获取积分$/,
        /^获取积分方式$/
    ],
    role: 'member',
    deverDefined: () => [
        [
            `现有的积分获取方式为：\n${way}`,
            `小秋查询到的积分获取方式是：\n${way}`
        ]
    ]
}
const fn: CommandFn = () => ({ items: 1 })
const getScoreWay = { fn, sendContent }

export { getScoreWay }
