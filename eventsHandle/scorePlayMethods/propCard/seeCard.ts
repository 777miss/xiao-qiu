/**
 * [康康卡]指令：
 * 使用该道具卡会自动消耗当前成员2积分，表现形式为随机发送一张图片
 * （api：风景图、头像图、二次元）
 */
import fs from 'fs'
import path from 'path'
import request_r from 'request'

import { getRandom } from '../../../lib/methods'
import { setPacksack } from '../packsack/tools'

import type { SendContent, CommandFn } from '../../../lib/interface'
import type { NoParamCallback } from 'fs'

type SeeCard = {
    title: string
    msg: string
}

const request = request_r.defaults({ encoding: null })

const writeFileFromRequest = (https: string, localUrl: string, fn: NoParamCallback) =>
    request(https, (_: unknown, __: unknown, data: string) => fs.writeFile(`${localUrl}`, data, fn))

const sendContent: SendContent = {
    name: '道具卡',
    reg: /^康康卡$/,
    role: 'member',
    member: ({ user: { name }, operations: { at } }) => [
        `小小${name} 可笑可笑，您的背包为空，所以小秋不能帮您使用此道具哦~`,
        `${name}，您背包目前为空，暂时无法使用，赶快去获取吧~`,
        `${at('user')} 您的背包中尚不存在此道具哦，因此无法使用`
    ],
    admin: ({ user: { name }, operations: { at } }) => [
        `小小管理 ${name}，可笑可笑，背包为空，所以小秋不能帮您使用此道具哦~`,
        `${name}，您还没有此道具卡，赶快去获取吧~`,
        `${at('user')} 管理大哥 你背包里还没有道具卡呢，小秋不能帮您使用`
    ],
    owner: ({ user: { name }, operations: { at } }) => [
        `小小群主 ${name}，可笑可笑，背包为空，所以不能使用！！`,
        `${name}，您还没有此道具卡哎，赶快去获取吧~`,
        `${at('user')} 我说群主啊 你背包里还没有道具卡呢，小秋不能帮您使用`
    ],
    deverDefined: ({ operations: { at }, defined }) => [
        [
            `${at('user')} 嗯？就这么想康好康的吗，但是你没有康康卡！！！`,
            `${at('user')} 小秋发现您还没有康康卡哦~`,
            `${at('user')} 没有康康卡的选手，是不可以康好看的哦~`
        ],
        [
            `${at('user')} 人品大爆发！您使用一张[康康卡]发现了一张${defined.title}${defined.content}`,
            `${at('user')} 哇 小秋为您找到了一张${defined.title}${defined.content}`,
            `${at('user')} 芜湖 您居然康到了一张绝美的${defined.title}${defined.content}`
        ]
    ]
}
const fn: CommandFn = async originData => {
    const { group, user, operations, database } = originData
    const { getDataBaseData, formSet: { user_packsack } } = database
    const value = await getDataBaseData(user_packsack.name, user_packsack.retrieveData)(group.id)
    const curUser = value[user.id]
    if (!curUser) return
    const { card } = curUser
    if (card.see <= 0) return { items: 1, args: {} }
    const randomType = getRandom(0, 2)
    const type = [
        ['https://img.xjh.me/random_img.php', '二刺猿图'],
        ['https://api.ixiaowai.cn/gqapi/gqapi.php', '风景图'],
        ['https://api.sunweihu.com/api/sjtx/api.php?lx=', '头像图']
    ]
    const backErCiYuan = (curTypeRandom: string[]): Promise<SeeCard> =>
        new Promise(r => {
            const [https, title] = curTypeRandom
            request(https, (_: unknown, __: unknown, data: string) => {
                const name = /img.xjh.me\/img\/(?<name>.*)\.jpg" src/.exec(data)?.groups?.name
                const seeCard_img_local_url = path.resolve(`./assets/images/seeCard/${name}.jpg`)
                const https = `https://img.xjh.me/img/${name}.jpg`
                writeFileFromRequest(https, seeCard_img_local_url, () =>
                    r({ title, msg: seeCard_img_local_url })
                )
            })
        })
    const backScenery = (curTypeRandom: string[]): Promise<SeeCard> =>
        new Promise(r => {
            const [https, title] = curTypeRandom
            const random = getRandom(1, 999)
            const seeCard_img_local_url = path.resolve(`./assets/images/seeCard/scenery${random}.jpg`)
            writeFileFromRequest(https, seeCard_img_local_url, () =>
                r({ title, msg: seeCard_img_local_url })
            )
        })
    const backAvator = (curTypeRandom: string[]): Promise<SeeCard> =>
        new Promise(r => {
            //  [参数：lx] [ 值：男头a1, 女头b1, 动漫c1, 动漫女头c2, 动漫男头c3 ]
            const [https, title] = curTypeRandom
            const avatorType = [
                ['a1', '男头'],
                ['b1', '女头'],
                ['c1', '动漫'],
                ['c2', '动漫女头'],
                ['c3', '动漫男头']
            ]
            const [types, text] = avatorType[getRandom(0, 4)]
            const random = getRandom(1, 999)
            const seeCard_img_local_url = path.resolve(`./assets/images/seeCard/avator${random}.jpg`)
            writeFileFromRequest(`${https}${types}`, seeCard_img_local_url, () =>
                r({ title: `${title}-${text}`, msg: seeCard_img_local_url })
            )
        })
    const get = [backErCiYuan, backScenery, backAvator]
    const data = await get[randomType](type[randomType])
    const { title, msg } = data
    setPacksack(group.id, user.id, { card: { see: -1 } })
    return { items: 2, args: { title, content: operations.promiseImage(msg) } }
}
const seeCard = { fn, sendContent }

export { seeCard }
