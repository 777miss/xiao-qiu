import mysql from 'mysql'

import { connectionDbConfig } from '../lib/user'
import { suggestions, switch_commands, user_packsack, groups_config } from './forms'

import type { GroupchatsId } from '../lib/interface'

const databaseSet = {
    suggestions,
    switch_commands,
    user_packsack,
    groups_config
}
// 连接数据库
const connection = mysql.createPool(connectionDbConfig)
// 对数据库进行操作
const operationSql = <T>(sql: string, isWhole?: boolean): Promise<T> =>
    new Promise((res, rej) =>
        connection.query(sql, (err: null | Error, data) => {
            // 抛出了错误
            if (err) {
                console.log('operationSql数据库操作异常:', err)
                return rej(err)
            }
            console.log('operationSql读取数据库数据', data)
            // 读取单条记录或全部记录（采用的sql语句大都为读取单条记录，所以此处对单条数据进行格式化）
            const obj = data[0]
            if (!obj) return res(obj) // 返回空数据
            const result = isWhole ? data : JSON.parse(obj[Object.keys(obj)[0]])
            res(result)
        })
    )
// 根据数据表读取数据
const getDataBaseData = <
    T extends keyof typeof databaseSet,
    K extends keyof typeof databaseSet[T]
>(form: T, operation: K) => {
    const sqlFn = databaseSet[form][operation]
    return sqlFn
}
// 对需要进行初始化的数据表进行初始化
const initForm = [groups_config, switch_commands, user_packsack]
const toInitFormData = (id: GroupchatsId) =>
    initForm.forEach(async form => {
        const data = await form.retrieveData(id)
        if (data) return
        form.recordRow(id)
    })

export { databaseSet, getDataBaseData, operationSql, toInitFormData }
