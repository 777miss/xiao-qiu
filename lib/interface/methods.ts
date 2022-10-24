import { self } from '../user'

// 转发聊天记录
type ForwardRecord = {
    user_id: typeof self.uin
    nickname: string
    message: string
}

export { ForwardRecord }
