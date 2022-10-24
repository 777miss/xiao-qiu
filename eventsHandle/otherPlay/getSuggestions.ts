/**
 * [查建议]指令：
 * 获取所有用户给小秋提出的建议，每条建议均配备“进度”标识，代表当前所提出的建议进度
 */
import { getWholeDate } from '../../lib/time'
import { self } from '../../lib/user'

import type { SuggestionFormat } from '../../database/forms/interface'
import type { SendContent, CommandFn, ForwardRecord } from '../../lib/interface'

const sendContent: SendContent = {
    name: '查建议',
    reg: [
        /^查建议$/,
        /^查看建议$/,
        /^看建议$/,
        /^查询建议$/
    ],
    role: 'member',
    deverDefined: ({ defined: { tip } }) => [
        [
            `小秋暂时没有发现更多建议`, `暂时没有更多建议，快来提出第一条建议吧`
        ],
        [
            `${tip}`
        ]
    ]
}
// 处理建议
const centerLine = (i: number) => (i > 1 ? '\n- - -\n' : '')
const process = (json: string) => {
    const arrs: SuggestionFormat[] = JSON.parse(json)
    let text = ''
    const handleResult = (result: string | undefined) => result ? `\n处理结果：${result}` : ''
    arrs.forEach(sug => {
        const { content, timestamp, plan, result } = sug
        text += `建议：『${content}』\n提出时间：${getWholeDate(new Date(timestamp))}\n当前进度：${plan}${handleResult(result)}${centerLine(arrs.length)}`
    })
    return text
}
const fn: CommandFn = async originData => {
    const { bot, segment, group, database } = originData
    const { getDataBaseData, formSet: { suggestions } } = database
    const data = await getDataBaseData(suggestions.name, suggestions.retrieveData)()
    if (!data) return { items: 1 }
    const result: ForwardRecord[] = []
    data.forEach(row => result.push({
        user_id: self.uin,
        nickname: '来自小秋用户的建议',
        message: process(row.suggestion)
    }))
    const forward = await bot.makeForwardMsg([...result])
    bot.sendGroupMsg(group.id, segment.xml(forward.data.data.data))
    const tip = '只要是小秋的用户，便可看到所有关于小秋的建议，以此才能更好地帮助小秋成长'
    return { items: 2, args: { tip } }
}
const getSuggestions = { fn, sendContent }

export { getSuggestions }
