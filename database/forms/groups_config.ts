import { operationSql } from '../tools'

import type { GroupsConfig, DataBaseDataType } from './interface'
import type { GroupchatsId } from '../../lib/interface'

type GroupsConfigRecord = Promise<DataBaseDataType['groups_config']['recordRow']>
type GroupsConfigUpdate = Promise<DataBaseDataType['groups_config']['updateData']>
type GroupsConfigRetrieve = Promise<DataBaseDataType['groups_config']['retrieveData']>

const groupsConfigTemp: GroupsConfig = {
    draw: {
        discount: 5,
        timestamp: 0
    },
    setCard: {
      isAuto: true,
      content: '又有大佬来了，群地位-1'
    },
    events: {
        message: true,
        increase: true,
        ban: true,
        decrease: true,
        poke: true
    },
    score: {
        dailyLimit: 4
    }
}

const create = {
    recordRow: async (id: GroupchatsId): GroupsConfigRecord =>
        await operationSql(`insert into groups_config(group_id,config) values('${id}','${JSON.stringify(groupsConfigTemp)}')`)
}
const update = {
    updateData: async (id: GroupchatsId, config: GroupsConfig): GroupsConfigUpdate =>
        await operationSql(`update groups_config set config='${JSON.stringify(config)}' where group_id='${id}'`)
}
const retrieve = {
    retrieveData: async (id: GroupchatsId): GroupsConfigRetrieve =>
        await operationSql(`select config from groups_config where group_id=${id}`)
}
const groups_config = { ...create, ...update, ...retrieve }

export { groups_config }
