import { getDate, getWholeDate } from '../lib/time'
import { getDataBaseData, formSet } from '../database'
import { GroupchatsId } from '../lib/interface'

const { user_packsack } = formSet

// 凌晨12点清除积分上限
const clearCurMaxScore = (groupchatsId: GroupchatsId[]) => {
    const time = new Date()
    const dur = 1000 * 60 * 60 * 24
    const curDateTemp = +new Date(getWholeDate(time))
    const nextDateTemp = +new Date(getDate(time)) + dur
    const clear = async () => {
        for (let i = 0, len = groupchatsId.length; i < len; i++) {
            const curGroupPacksack = await getDataBaseData(user_packsack.name, user_packsack.retrieveData)(groupchatsId[i])
            Object.keys(curGroupPacksack).forEach(me => (curGroupPacksack[me].curInc = 0))
            await getDataBaseData(user_packsack.name, user_packsack.updateData)(groupchatsId[i], curGroupPacksack)
        }
        setTimeout(clear, dur)
    }
    setTimeout(clear, nextDateTemp - curDateTemp)
}

export { clearCurMaxScore }
