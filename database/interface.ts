import { getDataBaseData } from './tools'

// 每个指令至少接收到的操作数据库的方法
type OperationsBasisSet = {
    recordRow: 'recordRow'
    updateData: 'updateData'
    retrieveData: 'retrieveData'
}
type ProcessOperationsSet<T> = T & OperationsBasisSet

type GroupsConfigOperationsSet = ProcessOperationsSet<{
    name: 'groups_config'
}>
type SuggestionsOperationsSet = ProcessOperationsSet<{
    name: 'suggestions'
    rowSuggestion: 'rowSuggestion'
}>
type SwitchCommandsOperationsSet = ProcessOperationsSet<{
    name: 'switch_commands'
}>
type UserPacksackOperationsSet = ProcessOperationsSet<{
    name: 'user_packsack'
}>

type DataBase = {
    getDataBaseData: typeof getDataBaseData
    formSet: {
        groups_config: GroupsConfigOperationsSet
        suggestions: SuggestionsOperationsSet
        switch_commands: SwitchCommandsOperationsSet
        user_packsack: UserPacksackOperationsSet
    }
}

export { DataBase }
