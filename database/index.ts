import {
    databaseSet,
    getDataBaseData,
    operationSql,
    toInitFormData
} from './tools'

import type { DataBase } from './interface'

const basis = {
    recordRow: 'recordRow',
    updateData: 'updateData',
    retrieveData: 'retrieveData'
} as const
const basisGroupsConfig = {
    name: 'groups_config',
    ...basis
} as const
const basisSuggestions = {
    name: 'suggestions',
    rowSuggestion: 'rowSuggestion',
    ...basis
} as const
const basisSwitchCommands = {
    name: 'switch_commands',
    ...basis
} as const
const basisUserPacksack = {
    name: 'user_packsack',
    ...basis
} as const

// 用于在读取数据时获取对应的表名及操作
const formSet: DataBase['formSet'] = {
    groups_config: basisGroupsConfig,
    suggestions: basisSuggestions,
    switch_commands: basisSwitchCommands,
    user_packsack: basisUserPacksack
}

export {
    databaseSet,
    getDataBaseData,
    operationSql,
    toInitFormData,
    formSet
}
