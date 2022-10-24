// 记录上次的随机数，避免重复
const recordRandom = {
    randomScope: 0,
    random: 0
}
// 返回 0-x 之间的随机数
const getRandomScope = (len: number): number => {
    if (len === 1) return 0
    const num = Math.floor(Math.random() * len)
    if (num === recordRandom.randomScope) return getRandomScope(len)
    recordRandom.randomScope = num
    return num
}
// 获取x-y之间的随机数，包含x和y
const getRandom = (x: number, y: number): number => {
    const num = Math.round(Math.random() * (y - x) + x)
    if (num === recordRandom.random) return getRandom(x, y)
    recordRandom.random = num
    return num
}
// 打乱数组中的顺序（会影响原数组）
const disruptOrder = (arr: []) => {
    const newArr: [] = []
    while (arr.length) {
        const [el] = arr.splice(getRandomScope(arr.length), 1)
        newArr.push(el)
    }
    return newArr
}
// 返回数组中的一个随机成员
const returnOneOfContent = <T>(contents: T[]): T => contents[getRandomScope(contents.length)]
// 提取CQ码中的qq，并以字符串的形式返回
const otherIdFromCq = (along: string): string | null => {
    const groups = /\[CQ:at,qq=(?<qq>\d*),text=.*\]/.exec(along)?.groups
    return groups?.qq!
}
// 获取一个由指定位数组成的随机数字字符串
const getRandomDigitNumberStr = (digit: number) => {
    let str = ''
    for (let i = 1; i <= digit; i++) str += Math.floor(Math.random() * 10)
    return str
}
// 判断一个数有没有小数点
const isDecimals = (num: number) => {
    const integer = Math.floor(num)
    return integer < num
}
// 判断一个数是正数还是负数
// 例如3则返回'+3'，-3则返回'-3'
const formatNumCount = (num: number): string => (num >= 0 ? `+${num}` : `${num}`)

export {
    getRandomScope,
    getRandom,
    returnOneOfContent,
    otherIdFromCq,
    disruptOrder,
    getRandomDigitNumberStr,
    isDecimals,
    formatNumCount
}
