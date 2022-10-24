import type { GroupchatsId } from '../../../lib/interface'
import type { CheckDeadPerson } from './interface'

// 存储当前人机验证的成员(包含其所对应的题目及答案)
const persons = new Map<string, CheckDeadPerson>([])
// 判断某位成员是否已经处于人机验证环节中
const inCheckDeadOf = (gId: GroupchatsId, oId: number) => {
    const id = String(gId) + String(oId)
    return !!persons.get(id)
}

export {
    persons,
    inCheckDeadOf
}
