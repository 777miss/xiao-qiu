import type { DataBase } from '../../database/interface'
import type { PreGroupchatMessage } from '../../database/forms/interface'
import type { OriginData, MemberBasisInfo, OriginMemberBasisInfo, GroupchatsId } from '../interface'

type DoAt = (id: number) => string
type ToCqCode = (id: number) => string
type GetHistoryGroupMsg = (gId: GroupchatsId, counts?: number) => PreGroupchatMessage[]
type DelMsg = (groupId: GroupchatsId, otherId: number, num: number) => Promise<number>
type BanMember = (groupId: GroupchatsId, otherId: number, unit: string, dur: number) => string
type PromiseImage = (imgPath: string) => string

type OicqOperations = {
    doAt: DoAt
    face: ToCqCode
    getHistoryGroupMsg: GetHistoryGroupMsg
    delMsg: DelMsg
    banMember: BanMember
    promiseImage: PromiseImage
}
// 事件处理函数
type GroupData = {
    group_id: GroupchatsId
    sender: MemberBasisInfo
    message_id: string
    raw_message: string
    group_name: string
    self_id: number
    atme: boolean
}
type OriginGroupData = {
    group_id: GroupchatsId
    sender: OriginMemberBasisInfo
    message_id: string
    raw_message: string
    group_name: string
    self_id: number
    atme: boolean
}
type IncreaseData = {
    group_id: GroupchatsId
    user_id: number
    nickname: string
}
type BanData = {
    group_id: number
    user_id: number
    operator_id: number
    duration: number
}
type DecreaseData = {
    group_id: number
    operator_id: number
    member: {
        user_id: number
        card: string
        role: string
        nickname: string
    }
}
type NoticeGroupPoke = {
    group_id: number
    self_id: number
    user_id: number
    target_id: number
    operator_id: number
    action: string
    suffix: string
}
// 用于存储群聊信息/数据，然后传递给被正则触发的函数
type HandleMessage = {
    data: OriginGroupData
    bot: OriginData['bot']
    operations: OriginData['operations']
    segment: OriginData['segment']
    database: DataBase
}

export {
    OicqOperations,
    GroupData,
    OriginGroupData,
    IncreaseData,
    BanData,
    DecreaseData,
    NoticeGroupPoke,
    HandleMessage
}
