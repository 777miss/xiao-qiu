import { timing } from './timing'
import { registerEvents } from './lib/oicq'
import { t } from './temporary'
import { groupchatsId } from './lib/user'
import { toInitFormData } from './database/tools'

// 临时任务
t()
// 定时任务
timing()
// 初始化数据
groupchatsId.forEach(id => toInitFormData(id))
// 注册事件
registerEvents()
