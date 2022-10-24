/**
 * [提建议]指令：
 * 提建议指令作为小秋开发者与小秋用户之间一种沟通的桥梁而存在，小秋会将用户提出的建议记录至数据库中，并由小秋开发者来标识当前建议的进度如何
 */
import type { SuggestionFormat } from '../../database/forms/interface'
import type { SendContent, CommandFn } from '../../lib/interface'

const sendContent: SendContent = {
    name: '提建议',
    reg: /^提建议：/,
    role: 'member',
    member: ({ user: { name }, operations: { at } }) => [
        `${at('user')} 提交失败啦，每条建议都必须要在五个字以上`,
        `${name}，请尝试重新描述您遇到的问题\n[建议必须要在五个字以上]`,
        `${name}，本次提交未通过 尝试多输入点内容吧`
    ],
    admin: ({ operations: { at } }) => [
        `${at('user')} 管理大哥 本次提交未通过\n[原因：应至少五个字]`,
        `${at('user')} 好管理 建议应至少包含五个字符`,
        `${at('user')} 提交失败啦，最少要有五个字哦`
    ],
    owner: ({ operations: { at } }) => [
        `${at('user')} 尊贵的群主大人 您本次提交未通过，原因：应至少五个字`,
        `群主大人，建议至少要有五个字哦~ 否则小秋不能帮您提交`,
        `${at('user')} 好群主 建议应至少包含五个字符`
    ],
    deverDefined: ({ user: { name }, operations: { at }, defined: { len, content } }) => [
        [
            `${at('user')} [提建议]指令的字数最多只能30字哦~`,
            `${at('user')} 超过30个字了，小秋记不住呀`,
            `${name}，抱歉 请尝试缩短建议后重新提交 `
        ],
        [
            `${at('user')} 抱歉 小秋暂不支持此类型的建议`,
            `${at('user')} 此建议暂时不能被收纳 请尝试重新整理后再次发送`,
            `${at('user')} 小秋暂不能收纳该建议哦`
        ],
        [
            `${at('user')} 您的第${len}条建议『${content}』已被收纳，感谢反馈。`,
            `${at('user')} 您的第${len}条建议『${content}』已被收纳，感谢你为小秋的付出~`,
            `${at('user')} 灰常感谢，您的第${len}条建议『${content}』已被收纳，开发者看到后会在第一时间进行处理！`
        ]
    ]
}
// 提建议不分群聊
const fn: CommandFn = async originData => {
    const { user: { id }, raw_message, database } = originData
    const { getDataBaseData, formSet: { suggestions } } = database
    const content = raw_message.slice(4)
    if (content.length < 5) return
    if (content.length > 30) return { items: 1 }
    // 建议中不能包含图片、语音、音视频等(判断标准为CQ码)
    const cqReg = /\[CQ:(.*)\]/gi
    if (cqReg.test(content)) return { items: 2 }
    const sugs = await getDataBaseData(suggestions.name, suggestions.rowSuggestion)(id)
    const sug: SuggestionFormat = {
        content,
        timestamp: +new Date(),
        plan: '已反馈给开发同学'
    }
    const newSugList = sugs ? [...sugs, sug] : [sug]
    if (sugs) await getDataBaseData(suggestions.name, suggestions.updateData)(id, newSugList)
    else await getDataBaseData(suggestions.name, suggestions.recordRow)(id, newSugList)
    return { items: 3, args: { len: newSugList.length, content } }
}
const makeSuggestion = { fn, sendContent }

export { makeSuggestion }
