/**
 * [小秋版本介绍]指令：
 * 获取小秋的版本介绍。
 * （只会发送当前所处的主版本号的版本介绍，例如当前处于2.x.x，则只会发送2.0.0-3.0.0之间所经历的版本变化，不会发送1.x.x的版本变化）
 */
import { getCurDarkOrLights } from '../../lib/time'
import { getModeImg } from './tools'
import { self } from '../../lib/user'

import type { SendContent, CommandFn } from '../../lib/interface'

const sendContent: SendContent = {
    name: '小秋版本介绍',
    reg: [
        /^小秋版本介绍$/,
        /^小秋多大了$/,
        /^小秋几岁了$/,
        /^小秋版本号$/,
        /^秋秋的版本介绍$/
    ],
    role: 'member',
    deverDefined: ({ operations: { at } }) => [
        [
            `这就是小秋的过往啦~`,
            `秋秋总共经历过以下版本哦`,
            `${at('user')} 想要再了解一下小秋吗`,
            `${at('user')} 这就是v2.x的全部内容啦`,
            `${at('user')} 遇到不懂的地方，记得向小秋发送[菜单]指令`,
            `${at('user')} 悄悄告诉你，小秋也希望当前版本没有bug哦·`
        ]
    ]
}
const classify = [['1', '1']]
// 版本介绍使用旧图变新图的方式
const fn: CommandFn = async originData => {
    const { bot, group, segment } = originData
    // 获取当前是白天还是黑天
    const flag = getCurDarkOrLights()
    const arr = getModeImg(classify, 'version', flag)
    // 拿到路径后，因菜单较长，所以使用转发聊天记录的形式发出
    const result = arr.map(([url]) => ({
        user_id: self.uin,
        nickname: '这就是小秋所经过的版本介绍了~',
        message: segment.image(url)
    }))
    const forward = await bot.makeForwardMsg([...result])
    bot.sendGroupMsg(group.id, segment.xml(forward.data.data.data))
    return { items: 1 }
}
const versions = { fn, sendContent }

export { versions }
