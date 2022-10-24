/**
 * [菜单]指令：
 * 查看小秋菜单
 */
import { getCurDarkOrLights } from '../../lib/time'
import { getModeImg } from './tools'
import { self } from '../../lib/user'

import type { SendContent, CommandFn } from '../../lib/interface'

const sendContent: SendContent = {
    name: '菜单',
    reg: [
        /^小秋菜单$/,
        /^菜单$/
    ],
    role: 'member',
    deverDefined: ({ user: { name, sex }, operations: { at } }) => [
        [
            `小秋菜单如下`,
            `${at('user')} 小${sex ? '哥哥' : '姐姐'}，这就是小秋的全部功能啦`,
            `${name}，悄悄告诉你，这就是小秋的全部魔法哦`,
            `${at('user')} 还想让小秋学会什么？赶快通过[提建议]指令告诉我吧`,
            `${at('user')} 听说有的指令会触发彩蛋哦~`
        ]
    ]
}
// 菜单指令分为浅色和深色模式，每个模式下各包含5张图片，分别对应着菜单中的5个模块：
// 群聊相关、群管理操作、积分玩法、其它玩法、小秋相关
const classify = [
    ['qlxg', '群聊相关'],
    ['qglcz', '群管理操作'],
    ['jfwf', '积分玩法'],
    ['qtwf', '其它玩法'],
    ['xqxg', '小秋相关']
]
const fn: CommandFn = async originData => {
    const { bot, group, segment } = originData
    // 获取当前是白天还是黑天
    const flag = getCurDarkOrLights()
    const arr = getModeImg(classify, 'menu', flag)
    // 拿到路径后，因菜单较长，所以使用转发聊天记录的形式发出
    const info = {
        user_id: self.uin,
        nickname: '小秋菜单现有五个分类哦~'
    }
    const result = arr.map(([url]) => ({
        ...info,
        message: segment.image(url)
    }))
    const menuIntroduce = {
        ...info,
        message: '截止当前，小秋菜单共包含4个分类，每个分类下皆拥有若干指令\n（若某个指令序号后面带有符号☆，则代表该指令只能由特定用户进行触发）'
    }
    result.push(menuIntroduce)
    const forward = await bot.makeForwardMsg([...result])
    bot.sendGroupMsg(group.id, segment.xml(forward.data.data.data))
    return { items: 1 }
}
const menu = { fn, sendContent }

export { menu }
