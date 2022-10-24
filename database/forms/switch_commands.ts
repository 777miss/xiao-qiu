import { menu } from '../../lib/oicq'
import { operationSql } from '../tools'

import type { GroupchatsId } from '../../lib/interface'
import type { DataBaseDataType, GroupsSwitchCommands } from './interface'

type SwitchCommandsRecord = Promise<DataBaseDataType['switch_commands']['recordRow']>
type SwitchCommandsUpdate = Promise<DataBaseDataType['switch_commands']['updateData']>
type SwitchCommandsRetrieve = Promise<DataBaseDataType['switch_commands']['retrieveData']>

const create = {
    recordRow: async (id: GroupchatsId): SwitchCommandsRecord =>
        await operationSql(`insert into switch_commands(group_id,commands) values('${id}','${JSON.stringify(menu)}')`)
}
const update = {
    updateData: async (id: GroupchatsId, commands: GroupsSwitchCommands): SwitchCommandsUpdate =>
        await operationSql(`update switch_commands set commands='${JSON.stringify(commands)}' where group_id='${id}'`)
}
const retrieve = {
    retrieveData: async (id: GroupchatsId): SwitchCommandsRetrieve =>
        await operationSql(`select commands from switch_commands where group_id=${id}`)
}
const switch_commands = { ...create, ...update, ...retrieve }

export { switch_commands }
