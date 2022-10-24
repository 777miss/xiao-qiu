import type { GroupchatsId } from '../../lib/interface'
import type { OicqOperations } from '../../lib/oicq/interface'

// 禁止发言
type ProxyArgs = {
    bot: any
    gId: GroupchatsId
    uId: number
    operations: OicqOperations
    raw_message: string
}
type VerifyProxy = (info: ProxyArgs) => boolean

export {
    ProxyArgs,
    VerifyProxy
}
