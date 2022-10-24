import type { GroupchatsId } from '../../../lib/interface'

// 存储当前正处于禁止发言期间的成员
const persons = new Map<string, boolean>([])
// 检测某位成员是否已经处于禁止发言期间
const judgeMemberNotSpeak = (gId: GroupchatsId, uId: number) => {
    const id = String(gId) + String(uId)
    return !!persons.get(id)
}

export {
    persons,
    judgeMemberNotSpeak
}
