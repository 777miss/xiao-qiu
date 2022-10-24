type TopicInfo = {
    topic: string
    answer: string[]
    times: number
    isFailed: boolean
}
type CheckDeadPerson = {
    token: NodeJS.Timeout
} & TopicInfo

export {
    TopicInfo,
    CheckDeadPerson
}
