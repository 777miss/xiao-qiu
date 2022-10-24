import type { GroupchatsId, OriginData } from '../../../lib/interface'

type Province = {
    province: '京'
    sex: string
    nickname: string
}
type Sex = 'male' | 'female' | 'unknown'
type BeAtInfoGroupSex = {
    data: {
        sex: Sex
        card: string
    }
}
type BeAtInfoGroupCard = {
    data: {
        area: string
        sex: Sex
        card: string
        nickname: string
    }
}

type ChangeCard = (
    bot: OriginData['bot'],
    groupId: GroupchatsId,
    userId: number
) => Promise<string>
type IsCardRule = (
    bot: OriginData['bot'],
    groupId: GroupchatsId,
    userId: number
) => Promise<{ flag: boolean, reason: string }>

export {
    Province,
    BeAtInfoGroupSex,
    BeAtInfoGroupCard,
    ChangeCard,
    IsCardRule
}