type GetObject<T = unknown> = {
    [k: string]: T
}
type ChoiceProps<T> = {
    [k in keyof T]?: T[k]
}
type TransformStringFormat<T extends string> = T extends `${infer P}_${infer N}`
    ? `${P}${Capitalize<N>}`
    : never
type UnderlineTransformHumpKeys<T extends object> = {
    [k in keyof object as k extends string ? TransformStringFormat<k> : never]: T[k]
}

export {
    GetObject,
    ChoiceProps,
    UnderlineTransformHumpKeys
}
