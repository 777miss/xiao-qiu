import type { CommandsConfig } from '../../eventsHandle/fns'

// groups_config表中的群配置
type GroupEvents = 'message' | 'increase' | 'ban' | 'decrease' | 'poke'
type GroupsConfig = {
    draw: {
        discount: 5 | 6 | 7 | 8 | 9
        timestamp: number
    }
    setCard: {
        isAuto: boolean
        content: string
    }
    events: {
        [K in GroupEvents]: boolean
    }
    score: {
        dailyLimit: number
    }
}
// 存储单条群聊消息的格式（在群聊中每产出一条消息，均按照此固定格式存储）
type PreGroupchatMessage = {
    userId: number
    msgId: string
    timestamp: number
    content: string
}
// suggestions表中所存储的每条建议的格式
type SuggestionFormat = {
    content: string
    timestamp: number
    plan: string,
    result?: string
}
type SuggestionsWhole = {
    user_id: number
    suggestion: string // SuggestionFormat[]
}
type SuggestionsWholeFormat = SuggestionsWhole[]
// switch_commands表中所存储的指令名称
/* type CommandsName = CommandsConfig[keyof CommandsConfig] extends {
    fn: any,
    sendContent: {
        name: `${infer U}`,
        [k: string]: any
    }
} ? `${U}` : never */
type CommandsName =
    | '问题格式'
    | '签到'
    | '人机验证'
    | '解除人机验证'
    | '禁止发言'
    | '解除禁止发言'
    | '改群昵称'
    | '警告'
    | '禁言'
    | '撤回'
    | '踢'
    | '全员禁言'
    | 'js'
    | '搜掘金'
    | '文案'
    | '查建议'
    | '早'
    | '晚'
    | '斗地主'
    | '听歌'
    | '提建议'
    | '在线聊天'
    | '抽奖'
    | '发放积分'
    | '我的背包'
    | '道具卡'
    | '抽奖限时折扣'
    | '查询限时折扣'
    | '获取积分方式'
    | '小秋你好'
    | '菜单'
    | '切换指令'
    | '小秋版本介绍'
type GroupsSwitchCommands = {
    [k in CommandsName]: boolean
}
// user_packsack表中所存储的用户背包格式
type UserPacksack = {
    score: number
    curInc: number
    card: {
        ban: number
        delMsg: number
        immune: number
        see: number
    }
}
type GroupsUserPacksack = {
    [k: string]: UserPacksack
}

type DataBaseBasisField = {
    recordRow: never
    updateData: never
}
type ProcessField<T> = T & DataBaseBasisField

type Groups_config = ProcessField<{
    retrieveData: GroupsConfig
}>
type Suggestions = ProcessField<{
    rowSuggestion: [SuggestionFormat] | undefined
    retrieveData: SuggestionsWholeFormat
}>
type Switch_commands = ProcessField<{
    retrieveData: GroupsSwitchCommands
}>
type User_packsack = ProcessField<{
    retrieveData: GroupsUserPacksack
}>

type DataBaseDataType = {
    groups_config: Groups_config
    suggestions: Suggestions
    switch_commands: Switch_commands
    user_packsack: User_packsack
}

export {
    GroupEvents,
    CommandsName,
    UserPacksack,
    GroupsUserPacksack,
    GroupsSwitchCommands,
    SuggestionFormat,
    PreGroupchatMessage,
    GroupsConfig,

    DataBaseDataType
}
