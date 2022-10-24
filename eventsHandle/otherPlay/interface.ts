// 文案指令
type YiYanApi = {
    from: string
    from_who: string
    hitokoto: string
}
// 听歌指令
type MusicResCode = {
    code: number
}
type MusicId = MusicResCode & {
    result: {
        songs: [
            {
                id: string
            }
        ]
    }
}
type MusicUrl = MusicResCode & {
    data: [
        {
            url: string
        }
    ]
}

export {
    YiYanApi,
    MusicId,
    MusicUrl
}
