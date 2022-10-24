import { AuthId, GroupsId } from '../user'

// 小秋的账号与密码
type BotAccount = {
    readonly uin: number
    readonly pwd: string
}
// 要监听群聊的ID、要修改群昵称的群聊ID
type GroupchatsId = GroupsId['groupchatsId']
type AutoGroupchatsName = GroupsId['autoGroupchatsName']
// 小秋的群昵称格式
type VersionsRule = `小秋 | Release v${number}.${number}.${number}`

export {
    AuthId,
    BotAccount,
    GroupchatsId,
    AutoGroupchatsName,
    VersionsRule
}
