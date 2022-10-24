/**
 * 注意，所有指令的正则之间可能会发生冲突，例如[禁言卡@成员]与[禁言1分钟]
 * 解决冲突的办法就是在export中尽可能让复杂的正则排在前面，或者修改正则触发方式
 */
import { askQuestions, signIn } from './groupchat'
import {
    runtime,
    getCopyWriting,
    goodNight,
    getSuggestions,
    landlords,
    goodMorning,
    listenMusic,
    makeSuggestion,
    xiaoqiuChat,
    searchJueJin
} from './otherPlay'
import {
    changeDrawDiscount,
    draw,
    drawCount,
    getDrawDiscount,
    getPacksack,
    addScore,
    banAndDelCard,
    seeCard,
    getScoreWay
} from './scorePlayMethods'
import {
    alert,
    banCommon,
    checkDeadPerson,
    relieveCheckDeadPerson,
    notAllowedSpeak,
    relieveNotAllowedSpeak,
    delMemberMessage,
    setCard,
    setGroupKick,
    setGroupWholeBan
} from './groupchatAdmin'
import { isXiaoQiuOnline, menu, switchCommand, versions } from './xiaoqiu'

const commandsConfig = {
    askQuestions,
    signIn,
    runtime,
    getCopyWriting,
    goodNight,
    getSuggestions,
    landlords,
    goodMorning,
    listenMusic,
    makeSuggestion,
    xiaoqiuChat,
    searchJueJin,
    changeDrawDiscount,
    draw,
    drawCount,
    getDrawDiscount,
    getPacksack,
    addScore,
    banAndDelCard,
    seeCard,
    getScoreWay,
    alert,
    banCommon,
    checkDeadPerson,
    relieveCheckDeadPerson,
    notAllowedSpeak,
    relieveNotAllowedSpeak,
    delMemberMessage,
    setCard,
    setGroupKick,
    setGroupWholeBan,
    isXiaoQiuOnline,
    menu,
    switchCommand,
    versions
} as const

type CommandsConfig = typeof commandsConfig

export {
    commandsConfig,
    CommandsConfig
}
