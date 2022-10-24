import {
    areaAbbr,
    sexArr,
    sexBelong,
    keywordsReg,
    areaAll,
    randomProvince,
    formSpecificProvinceToShort
} from '../../../lib/groupchat'

import type {
    Province,
    BeAtInfoGroupSex,
    BeAtInfoGroupCard,
    ChangeCard,
    IsCardRule
} from './interface'

// 拆分用户的群昵称
const getSpecificCard = (card: string) => {
    const result = card.split('-')
    return result.slice(0, 3)
}
// 判断群昵称是否符合规则，如果不符合规则，则返回false；如果符合规则，则返回true
const isCardRule: IsCardRule = async (bot, gId, uId) => {
    const beAtInfoGroup = await bot.getGroupMemberInfo(gId, uId)
    const { card } = beAtInfoGroup.data
    const reg = /^(?<province>.*)-(?<sex>.*)-(?<nickname>.*)\s*$/
    // 根本不符合
    if (!reg.test(card)) return { flag: false, reason: 'none' }
    const name = reg.exec(card)?.groups!
    const { province, sex, nickname } = name as Province
    // 省份不符合
    if (!areaAbbr[province]) return { flag: false, reason: 'province' }
    // 性别不符合
    if (!sexArr.includes(sex)) return { flag: false, reason: 'sex' }
    const isNoKeys = keywordsReg.test(nickname)
    // 昵称中包含敏感词汇，不符合
    if (isNoKeys) return { flag: false, reason: 'nickname' }
    return { flag: true, reason: '符合' }
}
// 避免用户的网名为(_ - 空格)
const nicknameSymbols = ['_', '-', ' ', '', '.']
// 获取修改后的某位用户的整体群昵称（省份、性别、昵称，全部修改）
const getChangeAllCard: ChangeCard = async (bot, groupId, userId) => {
    const beAtInfoGroup: BeAtInfoGroupCard = await bot.getGroupMemberInfo(groupId, userId)
    const { area, sex: curSex, nickname: curNickname } = beAtInfoGroup.data
    const r_area_all_keys = Object.keys(areaAll)
    const curProvince = r_area_all_keys.find(p => new RegExp(area, 'ig').test(p))
    // 如果用户的area在r_area_all中不存在，则使用随机省份
    const province = curProvince ? formSpecificProvinceToShort(curProvince) : randomProvince()
    // 如果用户的sex不存在，则默认为男
    const sex = curSex && curSex !== 'unknown' ? sexBelong[curSex] : '男'
    const nickname = nicknameSymbols.find(s => s === curNickname.trim()) ? '入门' : curNickname
    return `${province}-${sex}-${nickname}`
}
// 获取修改后的用户的群昵称中的省份
const getChangeProvinceCard: ChangeCard = async (bot, gId, userId) => {
    const beAtInfoGroup = await bot.getGroupMemberInfo(gId, userId)
    const { area, card } = beAtInfoGroup.data
    const r_area_all_keys = Object.keys(areaAll)
    const curProvince = r_area_all_keys.find(p => new RegExp(area, 'ig').test(p))
    // 如果用户的area在r_area_all中不存在，则使用随机省份
    const province = curProvince ? formSpecificProvinceToShort(curProvince) : randomProvince()
    const result = getSpecificCard(card)
    result[0] = province
    return result.join('-')
}
// 获取修改后的某位用户群昵称中的性别
const getChangeSexCard: ChangeCard = async (bot, gId, userId) => {
    const beAtInfoGroup: BeAtInfoGroupSex = await bot.getGroupMemberInfo(gId, userId)
    const { sex, card } = beAtInfoGroup.data
    const bar = sex && sex !== 'unknown' ? sexBelong[sex] : '男'
    const result = getSpecificCard(card)
    result[1] = bar
    return result.join('-')
}
// 获取修改后的用户的群昵称中的名字
const getChangeNicknameCard: ChangeCard = async (bot, gId, userId) => {
    const beAtInfoGroup = await bot.getGroupMemberInfo(gId, userId)
    const { nickname, card } = beAtInfoGroup.data
    const isNoKeys = keywordsReg.test(nickname) || nicknameSymbols.find(s => s === nickname.trim())
    const bar = isNoKeys ? '小萌新' : nickname
    const result = getSpecificCard(card)
    result[2] = bar
    return result.join('-')
}

export {
    isCardRule,
    getChangeAllCard,
    getChangeProvinceCard,
    getChangeSexCard,
    getChangeNicknameCard
}
