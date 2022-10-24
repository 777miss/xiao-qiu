import { getDataBaseData, formSet } from '../../../database'
import { returnOneOfContent } from '../../../lib/methods'

import type { CardResult, AllResult } from './interface'
import type { DataBase } from '../../../database/interface'
import type { GroupchatsId } from '../../../lib/interface'

type Judge = (
    group_id: GroupchatsId,
    user_id: number,
    count: number,
    database: DataBase,
    drawPlaceholder: Map<string, number>
) => Promise<{
    flag: boolean
    reason: string
}>

const { groups_config } = formSet

// 判断是否处于限时折扣期间
const isDiscount = async (gId: GroupchatsId) => {
    const { draw: { discount, timestamp } } = await getDataBaseData(groups_config.name, groups_config.retrieveData)(gId)
    const curTime = +new Date()
    if (curTime < timestamp) return { flag: true, discount, timestamp }
    return { flag: false }
}
// 得到在某个群聊中进行一次抽奖所消耗的积分
const getSinglePrice = async (gId: GroupchatsId) => {
    const { flag, discount } = await isDiscount(gId)
    const price = flag ? (discount! / 10) * 6 : 6
    return price
}
const reason1 = (count: number) => {
    const reason = [
        `你刚才的${count}次抽奖还没抽完呢，再等会`,
        `哎呀 小秋发现你刚才的${count}次抽奖还没完成哦`,
        `小秋还在努力的将您刚才的${count}次抽奖抽完，请稍等一会哦~`
    ]
    return returnOneOfContent(reason)
}
const reason2 = () => {
    const reason = [
        `小秋发现您的背包为空，暂时无法进行抽奖`,
        `呜呜 您的背包中没有积分，因此小秋不能帮您进行抽奖`,
        `小秋的心好痛，因为您背包中没有积分可以进行抽奖`
    ]
    return returnOneOfContent(reason)
}
const reason3 = (text: string | number) => {
    const reason = [
        `小秋发现您的积分不足以完成${text}次抽奖哦~`,
        `小秋检测到您的积分不足以完成${text}次抽奖`,
        `您不足以完成${text}次抽奖，因为小秋发现您背包中的积分不足`
    ]
    return returnOneOfContent(reason)
}
const judge: Judge = async (group_id, user_id, count, database, drawPlaceholder) => {
    const { getDataBaseData, formSet: { user_packsack } } = database
    // 先判断当前用户的上一次抽奖是否完成，如果未完成，则返回true
    const drawFlag = `${group_id}${user_id}`
    if (drawPlaceholder.has(drawFlag))
        return { flag: false, reason: reason1(drawPlaceholder.get(drawFlag)!) }
    const value = await getDataBaseData(user_packsack.name, user_packsack.retrieveData)(group_id)
    const curUser = value[user_id]
    if (!curUser) return { flag: false, reason: reason2() }
    const text = count === 1 ? '此' : count
    const price = await getSinglePrice(group_id)
    if (Number(curUser.score) < count * price) return { flag: false, reason: reason3(text) }
    return { flag: true, reason: `可以抽奖` }
}
const luckly = async (gId: GroupchatsId) => {
    const property = [
        { name: '禁言卡', code: 'ban' },
        { name: '未抽中', code: 'no' },
        { name: '免疫卡', code: 'immune' },
        { name: '4积分', code: 'score' },
        { name: '撤回卡', code: 'delMsg' },
        { name: '康康卡', code: 'see' }
    ]
    const Prab = [0.1, 1, 0.2, 0.8, 0.2, 0.7]
    //const Prab = [0.8, 1, 0.8, 1, 0.8, 0.6]
    const Alias = [2, 2, 4, 4, 2, 4]
    const advance = {
        prop: {
            name: '',
            code: 'no'
        },
        explain: ''
    }
    const randomFirst = Math.round(Math.random() * 5)
    const randomSecode = Math.random()
    advance.prop = randomSecode < Prab[randomFirst] ? property[randomFirst] : property[Alias[randomFirst] - 1]
    advance.explain = advance.prop.code === 'no' ? '未抽中~' : `${advance.prop.name}`
    const all: AllResult = {
        score: 0,
        card: {
            ban: 0,
            immune: 0,
            delMsg: 0,
            see: 0
        }
    }
    // 单次抽奖所需要的积分
    const price = await getSinglePrice(gId)
    const score = Number(price.toFixed(1)) * -1
    if (advance.prop.code === 'no') {
        all.score = score
    } else if (advance.prop.code === 'score') {
        all.score = score + 4
    } else {
        all.score = score
        all.card = { [advance.prop.code]: 1 } as CardResult
    }
    return { all, advance }
}

export {
    judge,
    luckly,
    isDiscount
}
