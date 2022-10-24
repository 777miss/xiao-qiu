/**
 * [js>]指令：
 * 用于在线运行JavaScript代码，由于不可防范因素众多，所以禁用了一些Node环境中的关键字
 */
import fs from 'fs'
import path from 'path'
import { execFile } from 'child_process'

import { self } from '../../../lib/user'

import type { SendContent, CommandFn } from '../../../lib/interface'

// 代码中不允许包含process等敏感词
const sensitiveWord = [
    'constructor',
    'eval',
    'process',
    'global',
    'fs',
    'http',
    '__dirname',
    'require',
    'buffer',
    'module',
    'XMLHttpRequest',
    'fetch',
    'setTimeout',
    'setInterval',
    'exports',
    'import',
    '全体成员',
    '@',
    'url',
    'until',
    'assertion testing',
    'asynchronous context tracking',
    'async hooks',
    'buffer',
    'child processes',
    'cluster',
    'command-line options',
    'corepack',
    'crypto',
    'debugger',
    'diagnostics channel',
    'dnc',
    'domain',
    'errors',
    'events',
    'http',
    'http/2',
    'https',
    'inspector',
    'internationalization',
    'net',
    'os',
    'path',
    'performance hooks',
    'policies',
    'punycode',
    'query strings',
    'readline',
    'repl',
    'report',
    'stream',
    'string decoder',
    'test runner',
    'timers',
    'trace events',
    'tty',
    'udp/datagram',
    'url',
    'utilities',
    'v8',
    'vm',
    'wasi',
    'worker threads',
    'zlib'
]
const flagErrorReg = /系统消息ID123789456：检测本次代码运行是否发生错误。/gi
const flagWasteReg = /系统消息ID123789456：计算代码所花费的时间。: (?<time>.*)/gi
const delEnterReg = /\n*$/
const childJsPath = path.resolve('./eventsHandle/otherPlay/runtime/child.js')
const sendContent: SendContent = {
    name: 'js',
    reg: /^\s*js>(?<code>.*)/s,
    role: 'member',
    deverDefined: ({ user: { name }, operations: { at, face }, defined: { isSensitiveWord, time, result } }) => [
        [
            `${at('user')} 代码块不允许为空`,
            `${at('user')} 一个空的代码块，小秋没有办法去运行它哦~`,
            `${name}，小秋发现您没有输入要执行的代码`
        ],
        [
            `${at('user')} 呜呜 小秋表示很抱歉，因为代码块不允许包含${isSensitiveWord}关键词`,
            `${at('user')} 很抱歉 执行失败，可能是因为代码块中包含${isSensitiveWord}关键词`,
            `${name}，小秋认为您应该将关键词${isSensitiveWord}去掉，这样说不定就可以运行了哦~`
        ],
        [
            `${at('user')} 此代码块包含一定错误(死循环/格式错误/未知错误等)，请尝试进行修改`,
            `${name}，小秋发现此代码块包含一定错误(死循环/格式错误/未知错误等)，因此暂时无法继续运行哦~`,
            `${at('user')} 呜呜 执行失败，小秋认为您的代码块中可能包含(死循环/格式错误/未知错误等)错误，请调整后重新进行尝试`
        ],
        [
            `${at('user')} 小秋刚才计算了一下，您的代码块所耗费时间约为${time}，运行结果:\n${result}`,
            `${name}，小秋查询到您本次提交的代码块所耗费时间约为${time}，运行结果:\n${result}`,
            `${at('user')}厉害呦${face(332)} 此代码块所耗费时间约为${time}，运行结果:\n${result}`
        ],
        [
            `${at('user')} 您本次提交的代码块所耗费时间约为${time}，由于运行结果字段较长，所以仅展示部分内容${result}`,
            `${name}，您本次提交的代码块所耗费时间约为${time}，但小秋认为运行结果较长，所以仅展示部分内容${result}`,
            `${at('user')} 您本次提交的代码块所耗费时间约为${time}，但是小秋查询到的运行结果太多啦，所以仅展示部分内容${result}`
        ]
    ]
}
const fn: CommandFn = originData =>
    new Promise(resolve => {
        const { bot, segment, group, user: { card }, raw_message, reg } = originData
        if (raw_message === 'js>') return resolve({ items: 1, args: {} })
        // 进行字符替换
        const code = reg.exec(raw_message.replace(/\r/g, '\n').replace(/&#91;/g, '[').replace(/&#93;/g, ']'))?.groups?.code!
        const isSensitiveWord = sensitiveWord.find(v => new RegExp(`\\b${v}\\b`, 'ig').test(code)) || (/\\/gi.test(raw_message) ? '\\' : false)
        if (isSensitiveWord) return resolve({ items: 2, args: { isSensitiveWord } })
        // 将用户要执行的代码块写入child.js中
        const promiseCode = `console.time('系统消息ID123789456：计算代码所花费的时间。');
try{
    ${code}
}catch(e) {
    console.log('系统消息ID123789456：检测本次代码运行是否发生错误。' + e);
}
console.timeEnd('系统消息ID123789456：计算代码所花费的时间。')`
        // 开启子进程，然后执行用户的代码块
        const go = () => {
            // 得到子进程的输出
            const stdout = (err: unknown, nout: string) => {
                // 接收三个参数：err、nout、stderr
                // err负责超时、未知错误等
                // nout负责接收由console.log输出的内容
                // stderr负责接收由console.err输出的内容
                if (err) return resolve({ items: 3, args: {} })
                // 当子进程没有输出时，nout的长度为0(只有在这种情况下，nout的长度才为0)
                // 如果子进程输出了一个空串，则nout的长度为1，而不是0(并以此类推)
                const time = flagWasteReg.exec(nout)?.groups?.time!
                const result = nout
                    .replace(flagErrorReg, '')
                    .replace(flagWasteReg, '')
                    .replace(delEnterReg, '')
                const curCode = { time, result }
                if (nout.replace(flagWasteReg, '').length === 1)
                    curCode.result += '\n[如果输出结果为空，可能您没有编写输出语句以得到其值]'
                if (result.length <= 100)
                    return resolve({ items: 4, args: { time: curCode.time, result: curCode.result } })
                // 当长度在1500之上时，不作任何输出
                if (result.length >= 1500)
                    return resolve({ items: 5, args: { time: curCode.time, result: curCode.result.slice(0, 50) } })
                const forward = bot.makeForwardMsg([{
                    user_id: self.uin,
                    nickname: '本群在线JS运行',
                    message: `<${card}>，您本次提交的代码块所耗费时间约为${curCode.time}，运行结果:\n${curCode.result}`
                }])
                try {
                    bot.sendGroupMsg(group.id, segment.xml(forward.data.data.data))
                } catch (e) { }
            }
            // 创建子进程
            execFile('node', [childJsPath], { timeout: 5000 }, stdout)
        }
        fs.writeFile(childJsPath, promiseCode, go)
    })
const runtime = { fn, sendContent }

export { runtime }
