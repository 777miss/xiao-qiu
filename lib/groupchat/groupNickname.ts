import type { MemberName } from './interface'

const sexArr = ['男', '女']
const sexBelong = {
    male: '男',
    female: '女'
}
const keywordsReg = /(服务器)|(代)|(代挂)|(找我)|(出售)|(私聊)|(卖)|(价格)|(群主)|(单子)|(工作室)|(联系)|(资源)|(分享)|(有偿)/gi
const areaAll = {
    北京: '京',
    天津: '津',
    上海: '沪',
    重庆: '渝',
    河北: '冀',
    山西: '晋',
    吉林: '吉',
    福建: '闽',
    安徽: '皖',
    辽宁: '辽',
    山东: '鲁',
    河南: '豫',
    湖南: '湘',
    江西: '赣',
    江苏: '苏',
    浙江: '浙',
    湖北: '鄂',
    青海: '青',
    陕西: '陕',
    贵州: '黔',
    广东: '粤',
    四川: '川',
    黑龙江: '黑',
    甘肃: '甘',
    内蒙古: '蒙',
    海南: '琼',
    新疆: '新',
    台湾: '台',
    澳门: '澳',
    云南: '滇',
    宁夏: '宁',
    西藏: '藏',
    广西: '桂',
    香港: '港'
}
const areaAbbr = {
    京: '北京',
    津: '天津',
    沪: '上海',
    渝: '重庆',
    冀: '河北',
    晋: '山西',
    吉: '吉林',
    闽: '福建',
    皖: '安徽',
    辽: '辽宁',
    鲁: '山东',
    豫: '河南',
    湘: '湖南',
    赣: '江西',
    苏: '江苏',
    浙: '浙江',
    鄂: '湖北',
    青: '青海',
    陕: '陕西',
    黔: '贵州',
    粤: '广东',
    川: '四川',
    黑: '黑龙江',
    甘: '甘肃',
    琼: '海南',
    台: '台湾',
    滇: '云南',
    宁: '宁夏',
    藏: '西藏',
    蒙: '内蒙古',
    桂: '广西',
    新: '新疆',
    港: '香港',
    澳: '澳门'
}
// 获取一个随机省份的简称
const randomProvince = () => {
    const random = Math.round(Math.random() * (34 - 1) + 1)
    const province = Object.keys(areaAbbr)
    return province[random]
}
// 每个省份的省份名称，及省份下属的地级市名称
const BeiJing = [
    '北京',
    '东城',
    '西城',
    '朝阳',
    '丰台',
    '石景山',
    '海淀',
    '顺义',
    '通州',
    '大兴',
    '房山',
    '门头沟',
    '昌平',
    '平谷',
    '密云',
    '怀柔',
    '延庆'
]
const TianJin = [
    '天津',
    '和平',
    '河东',
    '河西',
    '南开',
    '河北',
    '红桥',
    '滨海新',
    '东丽',
    '西青',
    '津南',
    '北辰',
    '武清',
    '宝坻',
    '宁河',
    '静海',
    '蓟州'
]
const ShangHai = [
    '上海',
    '黄浦',
    '徐汇',
    '长宁',
    '静安',
    '普陀',
    '虹口',
    '杨浦',
    '浦东新',
    '闵行',
    '宝山',
    '嘉定',
    '金山',
    '松江',
    '青浦',
    '奉贤',
    '崇明'
]
const ChongQing = [
    '重庆',
    '渝中',
    '江北',
    '南岸',
    '沙坪坝',
    '九龙坡',
    '大渡口',
    '渝北',
    '巴南',
    '北碚'
]

const ShanDong = [
    '山东',
    '济南',
    '青岛',
    '淄博',
    '枣庄',
    '东营',
    '烟台',
    '潍坊',
    '济宁',
    '泰安',
    '威海',
    '日照',
    '临沂',
    '德州',
    '聊城',
    '滨州',
    '菏泽'
]
const JiangSu = [
    '江苏',
    '南京',
    '无锡',
    '徐州',
    '常州',
    '苏州',
    '南通',
    '连云港',
    '淮安',
    '盐城',
    '扬州',
    '镇江',
    '泰州',
    '宿迁'
]
const AnHui = [
    '安徽',
    '合肥',
    '淮北',
    '亳州',
    '宿州',
    '阜阳',
    '蚌埠',
    '淮南',
    '滁州',
    '六安',
    '芜湖',
    '马鞍山',
    '铜陵',
    '安庆',
    '池州',
    '宣城',
    '黄山'
]
const ZheJiang = [
    '浙江',
    '杭州',
    '宁波',
    '温州',
    '嘉兴',
    '湖州',
    '绍兴',
    '金华',
    '衢州',
    '舟山',
    '台州',
    '丽水'
]
const FuJian = ['福建', '福州', '厦门', '泉州', '漳州', '莆田', '宁德', '龙岩', '三明', '南平']

const GuangDong = [
    '广东',
    '广州',
    '韶关',
    '深圳',
    '珠海',
    '汕头',
    '佛山',
    '江门',
    '湛江',
    '茂名',
    '肇庆',
    '惠州',
    '梅州',
    '汕尾',
    '河源',
    '阳江',
    '清远',
    '东莞',
    '中山',
    '潮州',
    '揭阳',
    '云浮'
]
const HaiNan = ['海南', '海口', '三亚', '三沙', '儋州']

const HuBei = [
    '湖北',
    '武汉',
    '黄石',
    '十堰',
    '宜昌',
    '襄阳',
    '鄂州',
    '荆门',
    '孝感',
    '荆州',
    '黄冈',
    '咸宁',
    '随州'
]
const HuNan = [
    '湖南',
    '长沙',
    '株洲',
    '湘潭',
    '衡阳',
    '邵阳',
    '岳阳',
    '常德',
    '张家界',
    '益阳',
    '郴州',
    '永州',
    '怀化',
    '娄底'
]
const HeNan = [
    '河南',
    '郑州',
    '洛阳',
    '开封',
    '漯河',
    '安阳',
    '信阳',
    '南阳',
    '濮阳',
    '周口',
    '新乡',
    '三门峡',
    '驻马店',
    '平顶山',
    '鹤壁',
    '商丘',
    '焦作',
    '许昌'
]
const JiangXi = [
    '江西',
    '南昌',
    '九江',
    '萍乡',
    '鹰潭',
    '上饶',
    '抚州',
    '新余',
    '宜春',
    '景德镇',
    '吉安',
    '赣州'
]

const HeBei = [
    '河北',
    '石家庄',
    '唐山',
    '秦皇岛',
    '邯郸',
    '邢台',
    '保定',
    '张家口',
    '承德',
    '沧州',
    '廊坊',
    '衡水'
]
const ShanXi = [
    '山西',
    '太原',
    '大同',
    '朔州',
    '忻州',
    '阳泉',
    '吕梁',
    '晋中',
    '长治',
    '晋城',
    '临汾',
    '运城'
]

const QingHai = ['青海', '西宁', '海东', '海北', '海南', '黄南', '果洛', '玉树', '海西']
const ShanXi2 = [
    '陕西',
    '西安',
    '宝鸡',
    '咸阳',
    '铜川',
    '渭南',
    '延安',
    '榆林',
    '汉中',
    '安康',
    '商洛'
]
const GanSu = [
    '甘肃',
    '兰州',
    '金昌',
    '嘉峪关',
    '白云',
    '天水',
    '武威',
    '张掖',
    '平凉',
    '酒泉',
    '庆阳',
    '定西',
    '陇南',
    '临夏',
    '甘南'
]

const SiChuan = [
    '四川',
    '成都',
    '绵阳',
    '自贡',
    '攀枝花',
    '泸州',
    '德阳',
    '广元',
    '遂宁',
    '内江',
    '乐山',
    '资阳',
    '宜宾',
    '南充',
    '达州',
    '雅安',
    '广安',
    '巴中',
    '眉山',
    '阿坝',
    '凉山',
    '甘牧'
]
const YunNan = [
    '云南',
    '昆明',
    '昭通',
    '曲靖',
    '玉溪',
    '保山',
    '丽江',
    '普洱',
    '临沧',
    '楚雄',
    '红河哈尼',
    '文山',
    '西双版纳',
    '大理',
    '德宏',
    '怒江',
    '迪庆'
]
const GuiZhou = [
    '贵州',
    '贵阳',
    '遵义',
    '六盘水',
    '安顺',
    '毕节',
    '铜仁',
    '黔东南',
    '黔南',
    '黔西南'
]

const LiaoNing = [
    '辽宁',
    '沈阳',
    '大连',
    '鞍山',
    '抚顺',
    '本溪',
    '丹东',
    '锦州',
    '营口',
    '阜新',
    '辽阳',
    '盘锦',
    '铁岭',
    '朝阳',
    '葫芦岛'
]
const JiLin = ['吉林', '长春', '吉林', '四平', '辽源', '通化', '白山', '松原', '白城', '延边']
const HeiLongJiang = [
    '黑龙江',
    '哈尔滨',
    '齐齐哈尔',
    '鸡西',
    '鹤岗',
    '双鸭山',
    '大庆',
    '伊春',
    '佳木斯',
    '七台河',
    '牡丹江',
    '黑河',
    '绥化',
    '大兴安岭'
]

const NingXia = ['宁夏', '银川', '石嘴山', '吴忠', '固原', '中卫']
const XiZang = ['西藏', '拉萨', '日喀则', '昌都', '林芝', '山南', '那曲']
const NeiMengGu = [
    '内蒙古',
    '呼和浩特',
    '包头',
    '鄂尔多斯',
    '乌海',
    '赤峰',
    '通辽',
    '呼伦贝尔',
    '乌兰察布',
    '巴彦淖尔',
    '兴安',
    '阿拉善',
    '锡林郭勒'
]
const GuangXi = [
    '广西',
    '南宁',
    '柳州',
    '桂林',
    '梧州',
    '北海',
    '防城港',
    '钦州',
    '贵港',
    '玉林',
    '百色',
    '贺州',
    '河池',
    '来宾',
    '崇左'
]
const XinJiang = [
    '新疆',
    '阿勒泰',
    '北屯',
    '塔城',
    '克拉玛依',
    '阿拉山口',
    '博乐',
    '双河',
    '胡杨河',
    '乌苏',
    '奎屯',
    '石河子',
    '昌吉',
    '五家渠',
    '乌鲁木齐',
    '阜康',
    '霍尔果斯',
    '可克达拉',
    '伊宁',
    '哈密',
    '吐鲁番',
    '库尔勒',
    '铁门关',
    '库车',
    '阿克苏',
    '阿拉尔',
    '阿图什',
    '图木舒克',
    '喀什',
    '昆玉',
    '和田',
    '伊犁',
    '新星'
]
const AoMen = [
    '澳门',
    '澳门半岛',
    '花地玛堂',
    '圣安多尼堂',
    '大堂',
    '望德堂',
    '风顺堂',
    '氹仔',
    '路环'
]
const XiangGang = [
    '香港',
    '中西',
    '湾仔',
    '东',
    '南',
    '油尖旺',
    '深水埗',
    '九龙城',
    '黄大仙',
    '观塘',
    '北',
    '大埔',
    '沙田',
    '西贡',
    '荃湾',
    '屯门',
    '元朗',
    '葵青',
    '离岛'
]

const TaiWan = ['台湾', '台北', '新北', '桃园', '台中', '台南', '高雄']
// 所有省份、地级市所对应的简称
const wholeProvinceShorts = [
    { shorts: '京', childnodes: BeiJing },
    { shorts: '津', childnodes: TianJin },
    { shorts: '沪', childnodes: ShangHai },
    { shorts: '渝', childnodes: ChongQing },
    { shorts: '鲁', childnodes: ShanDong },
    { shorts: '苏', childnodes: JiangSu },
    { shorts: '皖', childnodes: AnHui },
    { shorts: '浙', childnodes: ZheJiang },
    { shorts: '闽', childnodes: FuJian },
    { shorts: '粤', childnodes: GuangDong },
    { shorts: '琼', childnodes: HaiNan },
    { shorts: '鄂', childnodes: HuBei },
    { shorts: '湘', childnodes: HuNan },
    { shorts: '豫', childnodes: HeNan },
    { shorts: '赣', childnodes: JiangXi },
    { shorts: '冀', childnodes: HeBei },
    { shorts: '晋', childnodes: ShanXi },
    { shorts: '青', childnodes: QingHai },
    { shorts: '陕', childnodes: ShanXi2 },
    { shorts: '甘', childnodes: GanSu },
    { shorts: '川', childnodes: SiChuan },
    { shorts: '滇', childnodes: YunNan },
    { shorts: '贵', childnodes: GuiZhou },
    { shorts: '辽', childnodes: LiaoNing },
    { shorts: '吉', childnodes: JiLin },
    { shorts: '黑', childnodes: HeiLongJiang },
    { shorts: '宁', childnodes: NingXia },
    { shorts: '藏', childnodes: XiZang },
    { shorts: '蒙', childnodes: NeiMengGu },
    { shorts: '桂', childnodes: GuangXi },
    { shorts: '新', childnodes: XinJiang },
    { shorts: '澳', childnodes: AoMen },
    { shorts: '港', childnodes: XiangGang },
    { shorts: '台', childnodes: TaiWan }
]
// 得到某个省份或某个地级市所对应的省份简称
const formSpecificProvinceToShort = (area: string) => {
    // 地区分为省、地级市、县级市
    // 例如 (山东-济南-历下区)，依次对应的顺序为(省份-地级市-县级市)
    const bar = wholeProvinceShorts.find(({ childnodes }) =>
        childnodes.find(oneArea => oneArea === area)
    )
    // 没有找到则使用随机省份简称
    const result = bar?.shorts ? bar?.shorts : randomProvince()
    return result
}
// 从群昵称中取出对方的名字
const nicknameFormCard = (info: MemberName) => {
    const { nickname, card } = info
    // 当群昵称为空时，直接使用网名
    if (card.trim() === '') return nickname
    // 注意，由于每个群中的昵称规则均不相同，例如
    // 地区-性别-昵称，或者是
    // 地区-昵称， 也有可能是
    // 昵称
    // 所以使用split的方式去拆分符号(-)，永远都只返回最后一个元素
    // 当然有的群可能并不是以符号(-)为分隔，而是以其它字符，这种情况也一视同仁(只返回最后一个)
    const format = card.split('-')
    return format[format.length - 1]
}

export {
    sexArr,
    sexBelong,
    areaAll,
    areaAbbr,
    keywordsReg,
    randomProvince,
    nicknameFormCard,
    formSpecificProvinceToShort
}
