/**
 * [人机验证]指令：
 * 使用该指令可以对某一成员进行“人机验证”，形式为向该成员发送一道随机题目；
 * 若成员在规定时间内回答正确，则视为人机验证通过，未通过人机验证将被踢出群聊
 */
import path from 'path'

import { returnOneOfContent } from '../../../lib/methods'
import { persons, inCheckDeadOf } from './tools'

import type { TopicInfo } from './interface'
import type { SendContent, CommandFn, GroupchatsId } from '../../../lib/interface'

type TempReturn = [string, TopicInfo]

const verifyTip = '若三分钟内未作答，或三分钟内累计答错3次，将被踢出群聊'

const sendContent: SendContent = {
    name: '人机验证',
    reg: [
        /^\s*人机验证\[CQ:at,qq=(?<qq>\d*),text=.*\]\s*$/,
        /^\s*开启人机验证\[CQ:at,qq=(?<qq>\d*),text=.*\]\s*$/,
        /^\s*使用人机验证\[CQ:at,qq=(?<qq>\d*),text=.*\]\s*$/
    ],
    role: 'admin',
    member: ({ user: { name: username }, other: { name: othername }, operations: { at, face, promiseImage } }) => [
        `${at('user')} 这？？？您的权限不足以开启[人机验证]指令`,
        `${username}，抱歉 小秋检测到您暂未拥有[人机验证]指令的权限${face(98)}`,
        `${at('user')} 要造反了吗？这[人机验证]可不是说用就用的啊${promiseImage(path.resolve('./assets/images/emoji/反了你了1.jpg'))}`,
        `${username}，小秋不能帮您开启人机验证`,
        `${at('user')} 这...小心${othername}干你啊${face(104)}`
    ],
    deverDefined: ({ user: { name: username }, other: { name: othername }, defined: { topic }, operations: { at, face, promiseImage } }) => [
        [
            `${username}，${othername}当前正处于人机验证当中，请不要再次发起哦~`,
            `${at('user')} 小秋检测到${othername}正处于人机验证环节当中，不允许再次发起哦~`,
            `${at('user')} 不可以为${othername}同时进行两次人机验证哦~`,
            `${at('user')} 不要试图为${othername}开启两次人机验证哦${face(27)}`,
            `${username}，请耐心等待当前人机验证完成后再开启下一次验证`,
            `${at('other')} ${username}居然要为你开启两次人机验证，快干他${promiseImage(path.resolve('./assets/images/emoji/以德服人1.jpg'))}`
        ],
        [
            `${at('other')} ${username}现对您进行人机验证。题目为：\n\n${topic}\n\n[${verifyTip}]`,
            `${at('other')} ${username}通知小秋对您进行人机验证。题目为：\n\n${topic}\n\n[${verifyTip}]`,
            `${at('other')} 小秋现在对您进行人机验证。题目为：\n\n${topic}\n\n[${verifyTip}]`,
            `${at('other')} 快来完成这个人机验证吧，避免被误踢哦~\n\n${topic}\n\n[${verifyTip}]`,
            `${at('other')} 小秋对您发起了人机验证\n\n${topic}\n\n[${verifyTip}]`,
            `${at('other')} 听说小秋这次准备的人机验证题目很有难度？快来完成吧~\n\n${topic}\n\n[${verifyTip}]`
        ]
    ],
    equal: ({ other: { name }, operations: { at } }) => [
        `${at('user')} 怎么个意思？验证我同行？？？`,
        `${at('user')} 哎呀 小秋还没迷糊呢 不会对${name}进行人机验证哦`,
        `${at('user')} 小秋不能够对${name}进行人机验证哦`,
        `${at('user')} 相煎何太急！！！不可以对${name}进行人机验证`,
        `${at('user')} 听${name}说，这人机验证可真谢谢你~`,
        `${at('user')} 请不要让小秋对${name}进行人机验证`
    ],
    level: ({ other: { name }, operations: { at } }) => [
        `${at('user')} 抱歉，小秋暂时无法使用[人机验证]指令`,
        `${at('user')} 哎呀 小秋好像暂时不能使用[人机验证]指令哦~`,
        `${at('user')} 很不幸，小秋无法为${name}开启人机验证`
    ]
}
// 人机验证的题目
const verifyTopic = [
    ['《三国演义》的作者是谁？', ['罗贯中']],
    ['在JavaScript中，通过什么关键字来声明一个常量？', ['const', 'const关键字', '关键字const']],
    ['万有引力是谁提出来的？', ['牛顿', '英国人牛顿', '英国牛顿', '物理学家牛顿', '物理家牛顿', '英国物理学家牛顿', '英国物理家牛顿', '数学家牛顿']],
    ['农夫山泉矿泉水的建议零售价为几元？', ['2元', '2', '两元']],
    ['驾驶机动车在高速公路或者城市快速路上行驶时，驾驶人未按规定系安全带的，请问一次扣几分', ['2分', '2', '两分']],
    ['在markdown中，使用什么符号来定义一级标题？', ['#', '#号']],
    ['香港回归是在哪一年？', ['1997', '1997年', '1997年7月1日', '1997-07-01', '1997.07.01']],
    ['除了唱跳rap，还应该掌握哪些必备技能？', ['篮球']],
    ['列举一种常见的机械键盘轴体', ['红轴', '黑轴', '青轴', '茶轴', '白轴']],
    ['诗句"风萧萧兮易水寒"的下一句是什么？', ['壮士一去兮不复还', '壮士一去兮不复还！']]
]
// 一个[人机验证]的记录形式
const temp = (gId: GroupchatsId, oId: number): TempReturn => {
    // map: '群ID+用户ID', { topic, answer }
    const id = String(gId) + String(oId)
    // 随机抽取一道题目
    const [topic, answer]: any = returnOneOfContent(verifyTopic)
    return [id, { topic, answer, times: 0, isFailed: false }]
}
const fn: CommandFn = originData => {
    const { bot, group, other } = originData
    // 判断是否已经处于人机验证当中
    const haved = inCheckDeadOf(group.id, other.id)
    if (haved) return { items: 1 }
    const [id, oppositeQuestion] = temp(group.id, other.id)
    const token = setTimeout(() => {
        const have = persons.get(id)
        // 如果当前成员没有在人机验证序列中被删除，则意味着验证失败，所以将会在15秒之后被踢出本群聊
        // 反之，如果被删除了，则代表验证成功，所以不作出任何操作
        if (!have) return
        bot.sendGroupMsg(group.id, `由于<${other.card}>在三分钟内未能完成本次人机验证，因此将在15秒后被踢出此群聊`)
        setTimeout(() => {
            const id = String(group.id) + String(other.id)
            const have = persons.get(id)
            if (!have) return
            persons.delete(id)
            bot.setGroupKick(group.id, other.id)
        }, 1000 * 15)
    }, 1000 * 60 * 1)
    // 写入persons中进行记录
    persons.set(id, { ...oppositeQuestion, token })
    return { items: 2, args: { topic: oppositeQuestion.topic } }
}
const checkDeadPerson = { fn, sendContent }

export { checkDeadPerson }
