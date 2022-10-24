/**
 * [开启/关闭指令]指令：
 * 用于切换某个指令的状态，当某个指令被关闭后，再次尝试触发时，小秋不会作出任何回应
 */
import { AuthId, GroupAt } from '../../lib/interface'
import type { CommandsName } from '../../database/forms/interface'
import type { SendContent, CommandFn } from '../../lib/interface'

const member = (sex: boolean, name: string, at: GroupAt) => {
    const male = [
        `${at('user')} 小秋收到的指示是，当前指令只能由长的最帅的人触发哦~`,
        `${name}哥哥，您不能使用当前指令`,
        `${at('user')} 听说颜值在30以下的哥哥是不能触发该指令的哦`
    ]
    const female = [
        `很抱歉，乘风破浪的${name}姐姐，小秋不能帮您使用该指令`,
        `${name}，啊这 我的小迷妹也喜欢用这个指令吗`,
        `${at('user')} 当前指令只能由颜值99.999以下的小姐姐触发哦~`
    ]
    return sex ? male : female
}
const admin = (sex: boolean, at: GroupAt) => {
    const male = [
        `${at('user')} 想要触发当前指令，光是管理员可不够，还不能做个小小的男同哦~`,
        `${at('user')} 兄弟 这个指令就算是管理也不能用哦~`,
        `${at('user')} 等你成为群主了再来试着触发当前指令吧~`
    ]
    const female = [
        `${at('user')} 呜呜 好姐姐，这个指令太丑了，您不能使用它`,
        `${at('user')} 小秋认为您如果使用这个指令，会降低你的管理员姐姐身份哦~`,
        `${at('user')} 尊贵的管理姐姐，您不能使用当前指令`
    ]
    return sex ? male : female
}
const sendContent: SendContent = {
    name: '切换指令',
    reg: [
        /^(开启|关闭)指令&#91;(?<who>.*)&#93;$/,
        /^(开启|关闭)&#91;(?<who>.*)&#93;指令$/,
        /^(开启|关闭)(?<who>.*)指令$/
    ],
    role: [AuthId.FuncJin],
    member: ({ user: { name, sex }, operations: { at } }) => member(sex, name, at),
    admin: ({ user: { sex }, operations: { at } }) => admin(sex, at),
    owner: ({ user: { name, sex }, operations: { at } }) => member(sex, name, at),
    deverDefined: ({ operations: { at }, defined: { text, state } }) => [
        [
            `${at('user')} 小秋没有查询到您所输入的指令`,
            `${at('user')} 您输入的指令无效，请重新输入后再次尝试`,
            `${at('user')} 小秋发现没有当前指令，所以无法对其进行操作哦`
        ],
        [
            `${at('user')} 哎呀 小秋没有糊涂哦，当前指令已经是关闭状态啦`,
            `${at('user')} 小秋认为已经关闭的指令就不需要再次关闭了`,
            `${at('user')} 咦 是在考验小秋吗？当前指令已经是关闭状态了哦`
        ],
        [
            `${at('user')} 哎呀 小秋没有糊涂哦，当前指令已经是开启状态啦`,
            `${at('user')} 小秋认为已经开启的指令就不需要再次开启了，嘻嘻`,
            `${at('user')} 咦 是在考验小秋吗？当前指令已经是开启状态了哦`
        ],
        [
            `${at('user')} 小秋帮您把${text}变为了${state}状态哦`,
            `${at('user')} nice！小秋已经把${text}改为了${state}状态`,
            `${at('user')} 小秋将${text}改为了${state}状态，还不快夸夸人家`
        ]
    ]
}
const fn: CommandFn = async originData => {
    const { group, raw_message, reg, database } = originData
    const { getDataBaseData, formSet: { switch_commands } } = database
    const text = reg.exec(raw_message)?.groups?.who! as CommandsName
    const state = /开启/g.test(raw_message)
    const whole = await getDataBaseData(switch_commands.name, switch_commands.retrieveData)(group.id)
    const cur = whole[text]
    if (cur === undefined) return { items: 1 }
    if (state === false && cur === false) return { items: 2 }
    if (state === true && cur === true) return { items: 3 }
    whole[text] = !cur
    await getDataBaseData(switch_commands.name, switch_commands.updateData)(group.id, whole)
    return { items: 4, args: { text: `[${text}]`, state: state ? '开启' : '关闭' } }
}
const switchCommand = { fn, sendContent }

export { switchCommand }
