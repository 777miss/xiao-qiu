type GroupchatConfigArrs<T, V> = [T] extends V ? T : never

type InAuthId<T> = T extends { [propsName: string]: infer V } ? V[] : never
type AuthIdInType<T> = InAuthId<T>

export {
    GroupchatConfigArrs,
    AuthIdInType
}
