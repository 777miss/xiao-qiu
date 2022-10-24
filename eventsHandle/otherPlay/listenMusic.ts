/**
 * [听歌]指令：
 * 使用网易云Api，以QQ语音的格式(song-id.amr)发送用户所指定的歌曲
 * （音频转换时可能会出现音质破损）
 */
import fs from 'fs'
import request from 'request'

import type { MusicId, MusicUrl } from './interface'
import type { SendContent, CommandFn } from '../../lib/interface'

const sendContent: SendContent = {
    name: '听歌',
    reg: /^\s*听(?<name>.*)\s*$/,
    role: 'member',
    deverDefined: ({ defined: { songName }, operations: { at } }) => [
        [
            `${at('user')} 哎呀 讨厌！歌名当然不允许为空啦`,
            `${at('user')} 哼 你没有输入歌曲名，那小秋就不会唱给你听喽~`,
            `${at('user')} 请输入一个歌曲名称`
        ],
        [
            `${at('user')} 稍等稍等 小秋唱的有点口渴啦~`,
            `${at('user')} 让小秋喝完这口水再唱吧`,
            `${at('user')} 小秋好累呀 可以不唱了嘛~`
        ],
        [
            `${at('user')} 您点的《${songName}》来喽~`,
            `${at('user')} 小秋录制了一首您点的《${songName}》，快来听听吧~`,
            `${at('user')} 不得不说《${songName}》唱的好棒呀~`
        ],
        [
            `${at('user')} 哎呀 网络好像开小差了，没有点到《${songName}》`,
            `${at('user')} 小秋发现网络好像芭比Q了，《${songName}》没有成功播放，不过您可以再试一次哦~`
        ]
    ]
}

const lh = 'http://localhost:3000'
const writeFileFromRequest = (url: string, localUrl: string) =>
    new Promise(r => {
        const ws = fs.createWriteStream(localUrl)
        request(url).pipe(ws)
        ws.on('close', r)
    })
const getMusicId = (url: string): Promise<MusicId> =>
    new Promise(r => request(`${lh}${url}`, (_: unknown, __: unknown, data: string) => r(JSON.parse(data))))
const getMusicUrl = (url: string): Promise<MusicUrl> =>
    new Promise(r => request(`${lh}${url}`, (_: unknown, __: unknown, data: string) => r(JSON.parse(data))))

const fn: CommandFn = originData =>
    new Promise(async res => {
        const { bot, group, raw_message, segment, reg } = originData
        const songName = reg.exec(raw_message)?.groups?.name!
        if (songName === '') return res({ items: 1 })
        const dataId = await getMusicId(`/search?keywords=${encodeURI(songName)}`)
        if (dataId.code !== 200) return res({ items: 2 })
        const id = dataId.result.songs[0].id
        const dataUrl = await getMusicUrl(`/song/url?id=${id}`)
        if (dataUrl.code !== 200) return res({ items: 2 })
        const url = dataUrl.data[0].url
        const filename = `./assets/videos/listen/${id}.mp3`
        await writeFileFromRequest(url, filename)
        fs.readFile(filename, (_: NodeJS.ErrnoException | null, data: Buffer) => {
            try {
                const video = segment.record(Buffer.from(data))
                bot.sendGroupMsg(group.id, video)
                res({ items: 3, args: { songName } })
            } catch (e) {
                res({ items: 4, args: { songName } })
            }
        })
    })
const listenMusic = { fn, sendContent }

export { listenMusic }
