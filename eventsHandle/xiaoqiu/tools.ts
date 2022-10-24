import path from 'path'

const groupchatUrl = './assets/images/groupchat'
// 获取对应模式下的菜单
// true代表浅色，false代表深色
const getModeImg = (classify: string[][], type: string, mode: boolean) => {
    // arr为一维数组，例如[init, init]
    // init代表每个模块所对应的路径
    const arr: string[][] = []
    const curMode = mode ? 'lights' : 'dark'
    classify.forEach(v => arr.push([path.resolve(`${groupchatUrl}/${curMode}-${type}-${v[0]}.png`), v[1]]))
    return arr
}

export { getModeImg }
