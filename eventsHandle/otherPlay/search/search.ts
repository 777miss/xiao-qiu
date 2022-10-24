/**
 * [搜掘金]指令：
 * 用户指定好要搜索的关键词后，小秋会依据指定好的关键词去掘金平台中爬取对应文章
 * （搜索到的文章篇数可选，默认为1篇）
 */
import path from 'path'
import superagent from 'superagent'

import { self } from '../../../lib/user'
import { getRandomDigitNumberStr } from '../../../lib/methods'

import type { Articles, JueJinSearch, ArticleTemp } from './interface'
import type { SendContent, CommandFn, ForwardRecord } from '../../../lib/interface'

const sendContent: SendContent = {
    name: '搜掘金',
    reg: /^(搜|看|逛)(|(?<counts>\d+条))掘金(?<word>.*)$/,
    role: 'member',
    deverDefined: ({ user: { name }, defined: { article, word }, operations: { at, face, promiseImage } }) => [
        [
            `${at('user')} 请输入一个关键词`,
            `${at('user')} 由于您未输入关键词，因此无法搜索哦`,
            `${at('user')} 小秋没有检测到文章关键词哦~${face(280)}`
        ],
        [
            `${at('user')} 最少搜索1条${face(278)}`,
            `${at('user')} 小秋认为最少要搜索1条哦~`,
            `${name}，搜索的条数应大于等于1条哦`
        ],
        [
            `${at('user')} 最多只能搜索5条${face(287)}`,
            `${at('user')} 哎呀 条数太多了 请减少条数后重新尝试`,
            `${name}，最多只能搜索5条~`
        ],
        [
            `${at('user')} 网络开小差了 请稍后再试`,
            `${at('user')} 本次搜索好像出了点小问题~`,
            `${at('user')} 小秋此次未能成功搜索，请稍后再试`
        ],
        [
            `${at('user')} 为您找到了有关“${word}”的内容，点击链接即可阅读~\n\n${article}`,
            `${at('user')} 已为您准备好了有关“${word}”的内容，点击链接即可阅读~\n\n${article}`,
            `${name}，点击链接即可阅读有关“${word}”的内容\n${article}`
        ],
        [
            `${at('user')} 为您找到以下“${word}”的文章哦~`,
            `${at('user')} 关于“${word}”的文章好多哦~`,
            `${at('user')} 小秋还是第一次见这么多关于“${word}”的文章呢${promiseImage(path.resolve('./assets/images/emoji/我的人生完了1.jpg'))}`
        ]
    ]
}
// 发送的文章模板
const temp: ArticleTemp = (id, title, abstract, author, viewCounts, likeCounts, commentCounts) => {
    const url = `https://juejin.cn/post/${id}`
    // 摘要最多40字
    const temp = `『标题』：${title}\n『摘要』：\n${abstract.slice(0, 35)}......\n\n作者：${author}，阅读数：${viewCounts}\n点赞数：${likeCounts}，评论数：${commentCounts}\n${url}`
    return temp
}
// 获取掘金文章(counts代表要获取几条)
const getArticle = (keyWord: string, counts: number): Promise<Articles> =>
    new Promise(resolve => {
        const uuid = getRandomDigitNumberStr(19)
        const reqUrl = `https://api.juejin.cn/search_api/v1/search?aid=2608&uuid=${uuid}`
        const body = {
            uuid,
            // 获取的推荐文章条数，最小为10
            limit: 10,
            key_word: keyWord
        }
        superagent
            .post(reqUrl)
            .send(body)
            .set('X-Agent', 'Juejin/Web') // 设置请求头
            .end((err: null | Error, { text }) => {
                // 请求失败
                if (err) return resolve({ flag: false, article: [] })
                const result = JSON.parse(text)
                const { data, err_no }: JueJinSearch = result
                // 请求失败
                if (err_no > 0) return resolve({ flag: false, article: [] })
                // 是否有数据
                if (!data.length) return resolve({ flag: false, article: [] })
                const article: Articles['article'] = []
                for (let i = 0; i < counts; i++) {
                    const { article_info, author_user_info } = data[i].result_model
                    const { user_name } = author_user_info
                    const {
                        title,
                        article_id,
                        brief_content,
                        view_count,
                        digg_count,
                        comment_count
                    } = article_info
                    const content = temp(
                        article_id,
                        title,
                        brief_content,
                        user_name,
                        view_count,
                        digg_count,
                        comment_count
                    )
                    article.push(content)
                }
                resolve({ flag: true, article })
            })
    })
const fn: CommandFn = async originData => {
    const { bot, group, segment, raw_message, reg } = originData
    const { counts, word } = reg.exec(raw_message)?.groups!
    // 未输入关键字时
    if (word?.length <= 0) return { items: 1 }
    // 消息条数
    const num = Number(counts?.replace('条', ''))
    // 如果搜索的是0条
    if (num === 0) return { items: 2 }
    // 最多只能搜索5条
    if (num > 5) return { items: 3 }
    const impose = num ? num : 1
    const { flag, article } = await getArticle(word, impose)
    // 请求失败
    if (!flag) return { items: 4 }
    // 如果是单条，则直接发送消息
    if (impose === 1) return { items: 5, args: { article: article[0], word } }
    // 如果是多条，则以转发聊天记录的形式发出
    const result: ForwardRecord[] = []
    article.forEach(message => result.push({
        user_id: self.uin,
        nickname: '搜索文章结果',
        message: message
    }))
    const forward = await bot.makeForwardMsg([...result])
    bot.sendGroupMsg(group.id, segment.xml(forward.data.data.data))
    return { items: 6, args: { word } }
}
const searchJueJin = { fn, sendContent }

export { searchJueJin }
