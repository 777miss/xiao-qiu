/**
 * [问题格式]指令：
 * 当某群成员的问题格式不是理想格式时，可以使用此指令来提醒群成员
 */
import type { SendContent, CommandFn } from '../../lib/interface'

const stop = '①遇到的问题是什么\n②出错的截图+代码\n③想实现的效果大概是?'

const sendContent: SendContent = {
    name: '问题格式',
    reg: [
        /^问题格式$/,
        /^问问题的格式$/,
        /^问题方式$/,
        /^怎样请教$/,
        /^问题形式$/,
        /^问问题都不会吗$/
    ],
    role: 'member',
    member: ({ user: { name } }) => [
        `${name}温馨提示，向群友请教问题的基本步骤是：\n${stop}`,
        `${name}与小秋一致认为，向群友请教问题的基本步骤是：\n${stop}`,
        `哎呀 同志，问问题的时候应该要有三个基本步骤哦~\n${stop}`,
        `小秋认为请教问题的时候至少要符合以下三个基本步骤\n${stop}`,
        `你看这个步骤，它又完整又详细\n${stop}\n\n[听说在请教问题时，遵循以上步骤会有意想不到的收获]`,
        `请教问题的正确姿势~\n${stop}`
    ],
    admin: ({ user: { sex, name } }) => [
        `${name}以管理员的身份提醒群友，请教问题时至少要有以下格式：\n${stop}`,
        `${name}管理${sex ? '哥哥' : '姐姐'}觉得向群友请教问题的基本步骤必须要：\n${stop}`,
        `哎呀 宝贝，问问题的时候应该要有三个基本步骤哦~\n${stop}`,
        `${stop}\n\n[${name}与小秋打听到在请教问题时，遵循以上步骤会有意想不到的收获哦~]`,
        `请教问题的正确姿势（非ban必选）~\n${stop}`
    ],
    owner: ({ user: { sex, name } }) => [
        `群主${name}带着正确的请教步骤来了！\n${stop}`,
        `${name}群主${sex ? '哥哥' : '姐姐'}觉得向群友请教问题的基本步骤是：\n${stop}`,
        `群主为大家打听到了问问题的时候至少要有的三个基本步骤\n${stop}`,
        `家人们 群主发话了，问问题时必须要：\n${stop}`
    ]
}
const fn: CommandFn = () => { }
const askQuestions = { fn, sendContent }

export { askQuestions }
