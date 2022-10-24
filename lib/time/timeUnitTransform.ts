import { isDecimals } from '../methods'
import { UnitEng } from './interface'

// 转为秒
const belong = {
    分钟: {
        sec: (dur: number): number => dur * 60,
        max: 43200
    },
    小时: {
        sec: (dur: number): number => dur * 60 * 60,
        max: 720
    },
    天: {
        sec: (dur: number): number => dur * 60 * 60 * 24,
        max: 30
    }
}
const transformTimeNameAlias = { mins: '分钟', hours: '小时', days: '天' } as const
const transformTimeNameEn = { 分钟: 'mins', 小时: 'hours', 天: 'days' }
// 得到具体的分钟(例如，传入121分钟，返回1分钟)
const getMins = (mins: number): number => {
    const result = mins - 60
    return result < 60 ? result : getMins(result)
}
// 得到具体的小时(例如，传入25小时，返回1小时)
const getHours = (Hours: number): number => {
    const result = Hours - 24
    return result < 24 ? result : getHours(result)
}
// 秒转为对应的分钟、小时、天数
const getIntegerTime = (num: number) => {
    if (isDecimals(num)) return num.toFixed(2)
    return num
}
const secToFormat = (dur: number): string => {
    const mins = dur / 60
    if (mins < 60) return `${getIntegerTime(mins)}分钟`
    const hours = mins / 60
    if (hours < 24) return `${getIntegerTime(hours)}小时${getIntegerTime(getMins(mins))}分钟`
    const days = hours / 24
    return `${getIntegerTime(days)}天${getIntegerTime(getHours(hours))}小时${getIntegerTime(getMins(mins))}分钟`
}
// 得到对应的日期(2022/06/28)
const process = (time: number): string => (time < 10 ? `0${time}` : `${time}`)
const getDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = process(date.getMonth() + 1)
    const day = process(date.getDate())
    return `${year}/${month}/${day}`
}
// 得到对应的日期(2022/06/28 15:21)
const getWholeDate = (date: Date): string => {
    const hour = process(date.getHours())
    const mins = process(date.getMinutes())
    return `${getDate(date)} ${hour}:${mins}`
}
// 得到当前的时间，例如 13:01
const getCurTime = (): string => {
    const time = new Date()
    const hours = process(time.getHours())
    const mins = process(time.getMinutes())
    return `${hours}:${mins}`
}
// 返回当前时间段的别名，例如 08:00 为 早上好
const getCurTimeAlias = (): string => {
    const frame = [
        [6, '夜深了，快睡吧'],
        [9, '早上好'],
        [12, '中午好'],
        [18, '下午好'],
        [23, '晚上好']
    ]
    const time = new Date()
    const hours = time.getHours()
    const result = frame.find(v => hours <= v[0])!
    return `${result[1]}`
}
// 传入指定的时间段，返回当前时间段所对应的时间戳
// 例如当前时间为：2022/08/16 14:17
// 获取三天后的时间戳，即返回2022/08/19 14:17 所对应的时间戳
type timeInfo = {
    mins: number
    hours: number
    days: number
}
const getAssignTimestamp = (timeInfo: timeInfo) => +new Date() + getSpecificTimeMS(timeInfo)
// 得到分钟、小时、天数，所对应的毫秒数
const getSpecificTimeMS = (timeInfo: timeInfo) => {
    const keys = Object.keys(timeInfo) as UnitEng[]
    let ms = 0
    keys.forEach(t => {
        const timestamp = belong[transformTimeNameAlias[t]].sec(timeInfo[t]) * 1000
        ms += timestamp
    })
    return ms
}
// 得到当前是白天还是黑天
// true代表白天，false代表黑天
const getCurDarkOrLights = () => {
    const hours = new Date().getHours()
    return hours >= 6 && hours < 19
}

export {
    belong,
    secToFormat,
    getDate,
    getWholeDate,
    getCurTime,
    getCurTimeAlias,
    getAssignTimestamp,
    transformTimeNameAlias,
    transformTimeNameEn,
    getSpecificTimeMS,
    getCurDarkOrLights
}
