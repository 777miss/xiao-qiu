import { operationSql } from '../tools'

import type { GroupchatsId } from '../../lib/interface'
import type { DataBaseDataType, GroupsUserPacksack } from './interface'

type UserPacksackReocrd = Promise<DataBaseDataType['user_packsack']['recordRow']>
type UserPacksackUpdate = Promise<DataBaseDataType['user_packsack']['updateData']>
type UserPacksackRetrieve = Promise<DataBaseDataType['user_packsack']['retrieveData']>

const create = {
    recordRow: async (id: GroupchatsId): UserPacksackReocrd =>
        await operationSql(`insert into user_packsack(group_id,whole_user_id) values('${id}','{}')`)
}
const update = {
    updateData: async (id: GroupchatsId, wholeUserId: GroupsUserPacksack): UserPacksackUpdate =>
        await operationSql(`update user_packsack set whole_user_id='${JSON.stringify(wholeUserId)}' where group_id='${id}'`)
}
const retrieve = {
    retrieveData: async (id: GroupchatsId): UserPacksackRetrieve =>
        await operationSql(`select whole_user_id from user_packsack where group_id=${id}`)
}
const user_packsack = { ...create, ...update, ...retrieve }

export { user_packsack }
