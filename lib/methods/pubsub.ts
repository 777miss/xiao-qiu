class PubSub {
    // map: [[eventName, fn]]
    container = new Map<string, Function>([])
    // 发布
    publish(name: string, data: unknown) {
        /**
         * 发布事件有两种情况：
         *      1. 当前事件已被订阅，则触发其事件
         *      2. 当前事件未被订阅，则抛出错误
         */
        const fn = this.container.get(name)
        if (!fn) throw new TypeError(`${name}事件未被订阅`)
        // 每个订阅的函数都会收到其发布的数据，及当前事件名
        const args = [data, name]
        fn(...args)
    }
    // 订阅
    subscribe(name: string, fn: Function) {
        this.container.set(name, fn)
    }
    // 取消订阅
    unsubscribe(name: string) {
        /**
         * 取消订阅有两种情况：
         *      1. 当前事件已被订阅过，则在container中删除该事件
         *      2. 当前事件未被订阅，则抛出错误
         */
        const have = this.container.get(name)
        if (!have) throw new TypeError(`${name}事件属于无效事件`)
        this.container.delete(name)
    }
}
const pubsub = new PubSub()

export { pubsub }
