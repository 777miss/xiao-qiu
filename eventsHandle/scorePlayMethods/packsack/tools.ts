import { getDataBaseData, formSet } from '../../../database'

import type { CardResult } from '../draw/interface'
import type { GroupchatsId } from '../../../lib/interface'
import type { ChoiceProps } from '../../../lib/interface/toolsType'
import type { UserPacksack } from '../../../database/forms/interface'

type AllType = {
    score?: number
    card?: ChoiceProps<CardResult>
    curInc?: number
}

const { user_packsack } = formSet

const temp: UserPacksack = { score: 0, card: { ban: 0, immune: 0, delMsg: 0, see: 0 }, curInc: 0 }
const setPacksack = async (groupId: GroupchatsId, userId: number, all: AllType) => {
    const wholePacksack = await getDataBaseData(user_packsack.name, user_packsack.retrieveData)(groupId)
    const initUserPasksack = async () => {
        wholePacksack[userId] = { ...temp }
        await getDataBaseData(user_packsack.name, user_packsack.updateData)(groupId, wholePacksack)
    }
    // 判断当前用户是否开启了背包
    if (!wholePacksack[userId]) initUserPasksack()
    const changePacksack = (newPacksack: any, prePacksack: any) => {
        Object.keys(newPacksack).forEach(name => {
            if (newPacksack[name] instanceof Object) changePacksack(newPacksack[name], prePacksack[name])
            else prePacksack[name] = prePacksack[name] + newPacksack[name]
        })
    }
    // 修改背包数据
    changePacksack(all, wholePacksack[userId])
    await getDataBaseData(user_packsack.name, user_packsack.updateData)(groupId, wholePacksack)
}

export { setPacksack }
