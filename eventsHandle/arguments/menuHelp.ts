import path from 'path'

import { getCurDarkOrLights } from '../../lib/time'
import { returnOneOfContent } from '../../lib/methods'

import type { OicqOperations } from '../../lib/oicq/interface'

const lightsCommandUrl = './assets/images/xiaoqiu/浅色模式/小秋相关/0.jpg'
const darkCommandUrl = './assets/images/xiaoqiu/深色模式/小秋相关/0.jpg'

const menuUseCommandImgUrl = getCurDarkOrLights() ? lightsCommandUrl : darkCommandUrl
const getMenuHelp = (promiseImage: OicqOperations['promiseImage']) =>
    returnOneOfContent([
        `哎呀 不要来烦小秋哦~，有事看[菜单]`,
        `烦死了 别艾特我 有事看[菜单]哦~`,
        `小秋给您准备了[菜单]指令哦~\n${promiseImage(path.resolve(menuUseCommandImgUrl))}`,
        `艾特回去`
    ])

export { getMenuHelp }
