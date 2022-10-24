type CardResult = {
    ban: number
    delMsg: number
    immune: number
    see: number
}
type AllResult = {
    score: number
    card: CardResult
}
type LucklyResult = {
    all: AllResult
    advance: {
        explain: string
    }
}

export {
    CardResult,
    AllResult,
    LucklyResult
}
