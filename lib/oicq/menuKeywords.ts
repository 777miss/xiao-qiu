import { commandsConfig } from '../../eventsHandle/fns'

import type { GroupsSwitchCommands } from '../../database/forms/interface'
import type { VersionsRule } from '../interface'
import type { CommandsConfig } from '../../eventsHandle/fns'

type Commands = (keyof CommandsConfig)[]

const versions: VersionsRule = '小秋 | Release v2.0.0'
const menu = {} as GroupsSwitchCommands
const commandsFnNames = Object.keys(commandsConfig) as Commands
commandsFnNames.forEach(fnName => {
    const key = commandsConfig[fnName].sendContent.name
    menu[key] = true
})

export {
    menu,
    versions
}
