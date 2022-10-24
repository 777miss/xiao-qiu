import { operationSql } from '../tools'

import type { DataBaseDataType, SuggestionFormat } from './interface'

type GroupsSuggestion = SuggestionFormat[]
type SuggestionsRecord = Promise<DataBaseDataType['suggestions']['recordRow']>
type SuggestionsUpdate = Promise<DataBaseDataType['suggestions']['updateData']>
type SuggestionsRowData = Promise<DataBaseDataType['suggestions']['rowSuggestion']>
type SuggestionsRetrieve = Promise<DataBaseDataType['suggestions']['retrieveData']>

const create = {
    recordRow: async (id: number, sug: GroupsSuggestion): SuggestionsRecord =>
        await operationSql(`insert into suggestions(user_id,suggestion) values('${id}','${JSON.stringify(sug)}')`)
}
const update = {
    updateData: async (id: number, sug: GroupsSuggestion): SuggestionsUpdate =>
        await operationSql(`update suggestions set suggestion='${JSON.stringify(sug)}' where user_id='${id}'`)
}
const retrieve = {
    rowSuggestion: async (id: number): SuggestionsRowData =>
        await operationSql(`select suggestion from suggestions where user_id=${id}`),
    retrieveData: async (): SuggestionsRetrieve =>
        await operationSql(`select user_id,suggestion from suggestions`, true)
}
const suggestions = { ...create, ...update, ...retrieve }

export { suggestions }
