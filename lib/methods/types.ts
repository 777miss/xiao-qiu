type BasisType = string | number | boolean
interface TupleType {
    <T extends BasisType[]>(...args: T): T
}
const tuple: TupleType = (...args) => args

export { tuple }
