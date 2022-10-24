/**
 * 每个指令都对应着sendContent配置对象与fn处理函数，其中
 *      - sendContent标识该指令的触发方式、触发角色、返回的内容等
 *      - fn则表示该指令会触发的处理函数（fn会收到固定参数originData，originData中包含了用到的所有基本信息）
 */
// 限制sendContent与fn函数的形参、及其返回值
import type { SendContent, CommandFn } from '../interface'

// sendContent为一个配置对象
const sendContent: SendContent = {
    // 当前指令的名称，用于开启/关闭当前指令
    name: '小秋你好',
    // reg代表触发该指令的正则。其值可以是一个正则表达式，也可以是一个由正则表达式组成的数组
    reg: /reg/gi,
    // role代表发起者应拥有怎样的角色才可以触发该指令。其值必须是一个最低角色权限（如果role的值为数字数组，则代表只有特定用户可以触发该指令）
    // 例如role: [123789456]，代表只有账号为123789456的用户可以触发该指令
    role: 'member',
    /**
     * member函数、admin函数、owner函数、deverDefined函数、equal函数、level函数：
     *      以上函数的形参全部遵循infoTemp类型
     *          仅deverDefined函数的infoTemp中多了一项defined
     */
    // 当发起者是member时，会自动调用该函数。member必须返回一个字符串数组，当发送消息时，会从当前数组中随机抽取一条进行发送
    member: () => [],
    // 当发起者是admin时，会自动调用该函数。admin必须返回一个字符串数组，当发送消息时，会从当前数组中随机抽取一条进行发送
    admin: () => [],
    // 当发起者是owner时，会自动调用该函数。owner必须返回一个字符串数组，当发送消息时，会从当前数组中随机抽取一条进行发送
    owner: () => [],
    // 不管发起者是谁，只要处理函数fn中返回了{ items }，则自动调用该函数。
    // 且deverDefined必须返回一个二维字符串数组，当发送消息时，会从当前数组(二维数组)中的一个随机数组中随机抽取一条进行发送
    deverDefined: () => [[], []],
    // 当机器人小秋与被执行人权限相同时，会自动触发该函数
    equal: () => [],
    // 表示当前指令对小秋的最低权限要求
    level: () => []
}
// 当前指令的事件处理函数
const fn: CommandFn = originData => { }
// 对其进行组合(指令的函数名称应当与所在文件的名称一致)
const commandFileName = { fn, sendContent }

export { commandFileName }
