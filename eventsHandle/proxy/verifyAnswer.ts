import { persons } from '../groupchatAdmin/checkDeadPerson/tools'

import type { VerifyProxy } from './interface'

// 存储正在进行人机验证的用户
const answerTip = '答案中不应该带有修饰性词语，否则判断为错误'
// 检测当前消息是否为人机验证的作答消息
const verifyAnswer: VerifyProxy = info => {
    const { bot, gId, uId, operations, raw_message } = info
    // 如果没有添加人机验证，则直接返回false
    if (!persons) return false
    const id = String(gId) + String(uId)
    // 当前用户是否为正在进行人机验证的成员
    const member = persons.get(id)
    if (!member) return false
    const { answer, times, isFailed, token } = member
    const { doAt: at, delMsg } = operations
    // 如果当前用户3分钟内未作答，或3分钟内的3次作答机会全部错误，此时会在15秒后踢出本成员
    // 但这15秒中，用户还有可能发送消息，所以只要检测到这位成员发送的消息，就立即撤回
    if (isFailed) {
        delMsg(gId, uId, 1)
        bot.sendGroupMsg(gId, `${at(uId)}，请耐心等待15秒计时结束~`)
        return true
    }
    // 如果属于正在进行人机验证的成员，则对该条消息进行验证
    const isTrue = answer.find(r => r === raw_message.trim())
    // 如果作答成功
    if (isTrue) {
        // 关闭之前开启的定时器
        clearTimeout(token)
        // 删除id
        persons.delete(id)
        bot.sendGroupMsg(gId, `${at(uId)}，小秋检测到您已成功完成人机验证，恭喜~`)
        return true
    }
    const nextTimes = times + 1
    persons.set(id, { ...member, times: nextTimes })
    // 如果次数已用尽
    if (nextTimes >= 3) {
        persons.set(id, { ...member, times: nextTimes, isFailed: true })
        setTimeout(() => {
            const have = persons.get(id)
            if (!have) return
            // 关闭定时器
            clearTimeout(have.token)
            // 清除该id
            persons.delete(id)
            bot.setGroupKick(gId, uId)
        }, 1000 * 15)
        bot.sendGroupMsg(gId, `${at(uId)}，检测到您所提交的三个答案全部错误，因此15秒后您将被踢出此群聊\n\n[如误判，请添加QQ二群191515766进行说明]`)
        return true
    }
    bot.sendGroupMsg(gId, `${at(uId)}，本次回答错误，您还有${3 - nextTimes}次机会\n[温馨提示：${answerTip}]`)
    return true
}

export { verifyAnswer }
