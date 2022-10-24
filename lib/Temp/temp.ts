import type { SendContent, CommandFn } from '../interface'

const sendContent: SendContent = {
    name: '小秋你好',
    reg: /reg/gi,
    role: 'member',
    member: () => [],
    admin: () => [],
    owner: () => [],
    deverDefined: () => [[], []],
    equal: () => [],
    level: () => []
}
const fn: CommandFn = originData => { }
const commandFileName = { fn, sendContent }

export { commandFileName }
