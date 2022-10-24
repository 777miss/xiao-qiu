import { getDataBaseData, formSet } from '../database'

import { repeater } from './groupchat/repeater'
import { commandsConfig } from './fns'
import { nicknameFormCard } from '../lib/groupchat'
import { getMenuHelp } from './arguments/menuHelp'
import { verifyAnswer, verifyAllowedSpeak } from './proxy'
import {
    getUserInfo,
    getOtherInfo,
    getGroupInfo,
    getWantOriginData,
    getInfoTemp
} from './arguments/info'
import {
    getRandomScope,
    otherIdFromCq,
    returnOneOfContent,
    tuple
} from '../lib/methods'

import { AuthIdType } from '../lib/user'
import type { HandleMessage } from '../lib/oicq/interface'
import type { CommandsName } from '../database/forms/interface'
import type { CommandsConfig } from './fns'
import type { ProxyArgs } from './proxy/interface'
import type { InfoTemp, SendContent, GroupchatsId, Role, GroupAt, LowestRole } from '../lib/interface'

type CurCommand = {
    reg: RegExp | null
    fn: Function | null
    sendContent: SendContent | null
}

// 代理队列
const proxyQueue = [verifyAnswer, verifyAllowedSpeak]
// 找出当前所触发的指令
const getCurCommand = (raw_message: string) => {
    const curCommand: CurCommand = {
        reg: null,
        fn: null,
        sendContent: null
    }
    for (const prop in commandsConfig) {
        const { fn, sendContent } = commandsConfig[prop as keyof CommandsConfig]
        // 考虑到有些文件只是单纯的暴露，所以不对其进行强制要求
        if (!sendContent) continue
        // 对发送的消息进行检测
        const regs = sendContent.reg
        const isArr = regs instanceof Array
        const reg = isArr
            ? regs.find(v => v.test(raw_message))
            : regs.test(raw_message)
                ? regs
                : false
        if (!reg) continue
        curCommand.fn = fn
        // 能够触发当前指令的正则可以有很多，但最终只需要被触发的那个
        curCommand.reg = reg
        curCommand.sendContent = sendContent
        break
    }
    if (!curCommand.reg) return false
    return curCommand
}
// 查询某个群中某个指令的状态(开启或关闭)
const getOneOfGroupCommandStatus = async (gId: GroupchatsId, command: CommandsName) => {
    const { switch_commands } = formSet
    const whole = await getDataBaseData(switch_commands.name, switch_commands.retrieveData)(gId)
    return whole[command]
}
// 小秋自身的相关信息
const getXiaoqiuSelfInfo = async (bot: any, gId: GroupchatsId, sId: number) => {
    const gmlMap = await bot.gml.get(gId)
    const selfXiaoqiu = gmlMap.get(sId)
    const selfIsMember = selfXiaoqiu.role === 'member'
    const xiaoqiu = {
        id: selfXiaoqiu.user_id,
        role: selfIsMember ? tuple('member')[0] : tuple('admin')[0]
    }
    return { xiaoqiu, gmlMap }
}
// 发起者是否对该指令拥有足够的权限
const judgeUserRole = (role: Role | AuthIdType, userRole: Role, userId: number) => {
    // 权限判断： member<admin<owner<authId
    const roleSet = {
        member: () => true,
        admin: () => userRole !== 'member',
        owner: () => userRole === 'owner'
    }
    if (typeof role === 'string') return roleSet[role]()
    else return !!role.find(id => id === userId)
}
// 小秋与被执行人的权限等级是否相同
/**
 * 只有当小秋的最低权限为管理，且被执行人的权限为管理员或群主时，返回true
 * 其它所有情况一律返回false
 */
const judgeXiaoqiuAndOtherEqualRole = (otherRole: Role, xiaoqiuRole: Role) =>
    xiaoqiuRole === 'admin' && otherRole !== 'member' ? true : false
// 小秋自身是否对该指令拥有足够权限
const judgeXiaoqiuSelfRole = (lowestRole: LowestRole, xiaoqiuRole: Role) => {
    // 指令最低权限为普通成员时，直接返回true
    if (lowestRole === 'member') return true
    // 当小秋为普通成员，且该指令最低权限为管理员、群主时，返回false
    return xiaoqiuRole === 'member' ? false : true
}

const handleMessage = async (info: HandleMessage) => {
    const { bot, data, operations } = info
    const { group_id, self_id, atme, raw_message, sender } = data
    // 只要对方艾特了小秋，则不执行任何操作，只发送有关[菜单]指令的内容
    if (atme) return bot.sendGroupMsg(group_id, `${operations.doAt(sender.user_id)}，${getMenuHelp(operations.promiseImage)}`)
    // 如果被代理了，则不进行任何操作
    // 被代理的情况例如：某条消息处于类似[人机验证]的情况时，此时不需要触发任何指令，只需要进行[人机验证]的逻辑即可
    const porxyInfo: ProxyArgs = {
        bot,
        gId: group_id,
        uId: sender.user_id,
        operations,
        raw_message
    }
    const isProxy = proxyQueue.find(fn => fn(porxyInfo))
    if (isProxy) return
    // 找出当前所触发的指令
    const curCommand = getCurCommand(raw_message)
    // 未开发的指令不予理睬(但同时，也只有未开发的指令才能够进入检测复读的函数中)
    if (!curCommand) return repeater(bot, group_id, sender.card, operations)
    // 得到各指令所对应的处理函数和权限
    const { fn, sendContent, reg } = curCommand
    if (!sendContent) return
    // 查看该指令在当前群聊中是否处于开启状态
    const commandStatus = await getOneOfGroupCommandStatus(group_id, sendContent.name)
    // 对于已关闭的指令，不做任何处理
    if (!commandStatus) return
    // 格式化信息
    const user = getUserInfo(info)
    const other = getOtherInfo()
    const group = getGroupInfo(info)
    const { xiaoqiu, gmlMap } = await getXiaoqiuSelfInfo(bot, group_id, self_id)
    // 用于发送消息
    const send = (msg: string) => bot.sendGroupMsg(group.id, msg)
    const finished = (infoTemp: InfoTemp, sendContentFn: typeof fn) =>
        send(returnOneOfContent(sendContentFn!(infoTemp)))
    const at: GroupAt = who => operations.doAt(who === 'user' ? user.id : other.id)
    const apponit = (items: number, info: InfoTemp) => {
        const sc = curCommand.sendContent!
        const whoDefined = sc.deverDefined!(info)[items - 1]
        send(whoDefined[getRandomScope(whoDefined.length)])
    }
    // 考虑到各功能的差异及兼容性，所以每个指令都会收到以下固定参数(供fn使用)
    const wantOriginData = getWantOriginData(info, user, other, group, reg!)
    const infoTemp = getInfoTemp(info, user, at)
    // 当前指令是否艾特了其他用户
    const cqCode = /\[CQ:at,qq=\d*,text=@.*\]/g
    const isAtOther = cqCode.test(raw_message)
    // 执行处理函数
    const handler = async (infoTemp: InfoTemp) => {
        /**
         * 每条指令的权限情况：
         * 1. 指令最低权限为普通成员，此时不对发起者进行权限判断，而是直接为其执行相应指令
         * 2. 指令最低权限为管理员，而发起者不是管理员或群主
         *      【此时会触发sendContent.member】
         * 3. 指令最低权限为特定用户，而发起者不是特定用户（出现这种情况是因为sendContent.role指定了QQ号，而不是指定的角色）
         *      【此时会触发sendContent.member/admin/owner】
         * 4. 指令最低权限为管理员，发起者也是管理员或群主，但小秋与被执行人的等级相等(小秋与被执行人都是管理员，因此无法触发)
         *      【此时会触发sendContent.equalLevel】
         * 5. 指令最低权限为管理员，发起者也是管理员或群主，但小秋自身不是管理员，所以也无法触发
         *      【此时会触发sendContent.level.fn】
         *
         * 注意：特定用户是独立于普通成员、管理员、群主之外的角色。例如某个指令只能由管理员/群主触发，此时如果由特定用户去触发，而这位特定用户
         *      恰好不是管理员/群主，则小秋不会执行当前指令，而是去触发sendContent.member
         */
        // 发起者是否对该指令拥有足够的权限
        const userSelfRole = judgeUserRole(sendContent.role, user.role, user.id)
        if (!userSelfRole) return finished(infoTemp, sendContent[user.role]!)
        // 只有在当前指令中艾特了其他用户，才对双方权限进行判断
        if (isAtOther) {
            // 是否需要进行检查
            if (sendContent.equal) {
                // 小秋与被执行人的权限等级是否相同
                const xiaoqiuAndOtherRole = judgeXiaoqiuAndOtherEqualRole(wantOriginData.other.role, xiaoqiu.role)
                if (xiaoqiuAndOtherRole) return finished(infoTemp, sendContent.equal)
            }
        }
        // 小秋自身是否对该指令拥有足够权限
        const lowestCommandRole = curCommand.sendContent!.level ? 'admin' : 'member'
        const xiaoqiuSelfRole = judgeXiaoqiuSelfRole(lowestCommandRole, xiaoqiu.role)
        if (!xiaoqiuSelfRole) return finished(infoTemp, sendContent.level!)
        // 三方身份校验完毕
        const result = await fn!(wantOriginData)
        // 不需要发送自定义消息
        if (typeof result !== 'object') return finished(infoTemp, sendContent[user.role]!)
        // 需要发送自定义消息，而不是发送预先准备好的消息
        const { noMsg, items, args } = result
        if (noMsg) return
        const definedArgs = Object.keys(args || {})
        definedArgs.forEach(v => (infoTemp.defined[v] = args[v]))
        return apponit(items, infoTemp)
    }
    // 只要是已开发的指令，看是否需要获取对方信息来决定应该如何执行整个流程
    // 判定标准：如果艾特了对方，则代表需要对方的信息
    if (!isAtOther) return handler(infoTemp)
    // 需要获取对方信息
    other.id = Number(otherIdFromCq(raw_message)!)
    const _info = gmlMap.get(Number(other.id))
    const othername = nicknameFormCard({
        nickname: _info.nickname,
        card: _info.card
    })
    const othersex = _info.sex != 'female'
    infoTemp.other = getOtherInfo(
        other.id,
        othersex,
        _info.card,
        _info.role,
        _info.nickname,
        othername
    )
    wantOriginData.other = infoTemp.other
    return handler(infoTemp)
}

export { handleMessage }
