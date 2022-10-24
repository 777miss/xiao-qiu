import { judgeMemberNotSpeak } from '../groupchatAdmin/notAllowedSpeak/tools'

import type { VerifyProxy } from './interface'

const verifyAllowedSpeak: VerifyProxy = info => {
    const { gId, uId, operations: { delMsg } } = info
    const isHave = judgeMemberNotSpeak(gId, uId)
    if (!isHave) return false
    // 处于禁止发言期间，直接撤回消息
    delMsg(gId, uId, 1)
    return true
}

export { verifyAllowedSpeak }
