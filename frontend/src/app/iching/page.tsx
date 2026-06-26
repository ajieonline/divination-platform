'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '@/components/Layout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Sparkles, Info, RefreshCw, AlertCircle } from 'lucide-react'

// ============================================================
// 64卦完整数据 (周文王序) — lines 从初爻到上爻 [初,二,三,四,五,上]
// 1=阳爻(━━━), 0=阴爻(━ ━)
// ============================================================
const HEXAGRAMS_64 = [
  { number: 1,  name: '乾', nameCn: '乾为天',   symbol: '☰☰', lines: [1,1,1,1,1,1], judgment: '元亨利贞', image: '天行健，君子以自强不息', desc: '大吉之象，万事亨通' },
  { number: 2,  name: '坤', nameCn: '坤为地',   symbol: '☷☷', lines: [0,0,0,0,0,0], judgment: '元亨，利牝马之贞', image: '地势坤，君子以厚德载物', desc: '大地之象，承载万物' },
  { number: 3,  name: '屯', nameCn: '水雷屯',   symbol: '☵☳', lines: [1,0,0,0,1,0], judgment: '元亨利贞，勿用有攸往', image: '云雷屯，君子以经纶', desc: '困难初始，需耐心等待' },
  { number: 4,  name: '蒙', nameCn: '山水蒙',   symbol: '☶☵', lines: [0,1,0,0,0,1], judgment: '亨。匪我求童蒙，童蒙求我', image: '山下出泉，蒙；君子以果行育德', desc: '启蒙之象，学习成长' },
  { number: 5,  name: '需', nameCn: '水天需',   symbol: '☵☰', lines: [1,1,1,0,1,0], judgment: '有孚，光亨，贞吉', image: '云上于天，需；君子以饮食宴乐', desc: '等待时机，蓄势待发' },
  { number: 6,  name: '讼', nameCn: '天水讼',   symbol: '☰☵', lines: [0,1,0,1,1,1], judgment: '有孚窒惕，中吉，终凶', image: '天与水违行，讼；君子以作事谋始', desc: '争讼之象，宜化解' },
  { number: 7,  name: '师', nameCn: '地水师',   symbol: '☷☵', lines: [0,1,0,0,0,0], judgment: '贞，丈人吉，无咎', image: '地中有水，师；君子以容民畜众', desc: '统帅之象，领导才能' },
  { number: 8,  name: '比', nameCn: '水地比',   symbol: '☵☷', lines: [0,0,0,1,0,1], judgment: '吉。原筮元永贞，无咎', image: '地上有水，比；先王以建万国，亲诸侯', desc: '团结之象，合作吉利' },
  { number: 9,  name: '小畜', nameCn: '风天小畜', symbol: '☴☰', lines: [1,1,1,0,1,1], judgment: '亨。密云不雨，自我西郊', image: '风行天上，小畜；君子以懿文德', desc: '小有积蓄，渐进发展' },
  { number: 10, name: '履', nameCn: '天泽履',   symbol: '☰☱', lines: [1,0,1,1,1,1], judgment: '履虎尾，不咥人，亨', image: '上天下泽，履；君子以辩上下，定民志', desc: '践行礼仪，小心谨慎' },
  { number: 11, name: '泰', nameCn: '地天泰',   symbol: '☷☰', lines: [1,1,1,0,0,0], judgment: '小往大来，吉亨', image: '天地交，泰；后以财成天地之道', desc: '通泰和谐，万事顺遂' },
  { number: 12, name: '否', nameCn: '天地否',   symbol: '☰☷', lines: [0,0,0,1,1,1], judgment: '否之匪人，不利君子贞', image: '天地不交，否；君子以俭德辟难', desc: '闭塞不通，守静待变' },
  { number: 13, name: '同人', nameCn: '天火同人', symbol: '☰☲', lines: [1,0,1,1,1,0], judgment: '同人于野，亨，利涉大川', image: '天与火，同人；君子以类族辨物', desc: '志同道合，团结协作' },
  { number: 14, name: '大有', nameCn: '火天大有', symbol: '☲☰', lines: [1,1,1,0,1,0], judgment: '元亨', image: '火在天上，大有；君子以遏恶扬善', desc: '大有收获，事业兴旺' },
  { number: 15, name: '谦', nameCn: '地山谦',   symbol: '☷☶', lines: [1,0,0,0,0,0], judgment: '亨，君子有终', image: '地中有山，谦；君子以裒多益寡', desc: '谦逊之象，虚心待人' },
  { number: 16, name: '豫', nameCn: '雷地豫',   symbol: '☳☷', lines: [0,0,0,1,0,0], judgment: '利建侯行师', image: '雷出地奋，豫；先王以作乐崇德', desc: '欢乐预备，顺势而为' },
  { number: 17, name: '随', nameCn: '泽雷随',   symbol: '☱☳', lines: [1,0,0,1,0,1], judgment: '元亨利贞，无咎', image: '泽中有雷，随；君子以向晦入宴息', desc: '随从适应，灵活变通' },
  { number: 18, name: '蛊', nameCn: '山风蛊',   symbol: '☶☴', lines: [1,1,0,0,0,1], judgment: '元亨，利涉大川', image: '山下有风，蛊；君子以振民育德', desc: '整治革新，拨乱反正' },
  { number: 19, name: '临', nameCn: '地泽临',   symbol: '☷☱', lines: [1,0,0,0,0,1], judgment: '元亨利贞，至于八月有凶', image: '泽上有地，临；君子以教思无穷', desc: '亲临治理，居高临下' },
  { number: 20, name: '观', nameCn: '风地观',   symbol: '☴☷', lines: [0,0,0,1,1,0], judgment: '盥而不荐，有孚颙若', image: '风行地上，观；先王以省方观民设教', desc: '观察审视，深思熟虑' },
  { number: 21, name: '噬嗑', nameCn: '火雷噬嗑', symbol: '☲☳', lines: [1,0,0,1,0,1], judgment: '亨，利用狱', image: '雷电噬嗑；先王以明罚敕法', desc: '果断处理，执法严明' },
  { number: 22, name: '贲', nameCn: '山火贲',   symbol: '☶☲', lines: [1,0,1,0,0,1], judgment: '亨，小利有攸往', image: '山下有火，贲；君子以明庶政', desc: '文饰美化，文质彬彬' },
  { number: 23, name: '剥', nameCn: '山地剥',   symbol: '☶☷', lines: [0,0,0,0,0,1], judgment: '不利有攸往', image: '山附于地，剥；上以厚下安宅', desc: '剥落衰败，守静待时' },
  { number: 24, name: '复', nameCn: '地雷复',   symbol: '☷☳', lines: [1,0,0,0,0,0], judgment: '亨。出入无疾，朋来无咎', image: '雷在地中，复；先王以至日闭关', desc: '回复重生，否极泰来' },
  { number: 25, name: '无妄', nameCn: '天雷无妄', symbol: '☰☳', lines: [1,0,0,1,1,1], judgment: '元亨利贞', image: '天下雷行，物与无妄', desc: '真实无妄，顺应自然' },
  { number: 26, name: '大畜', nameCn: '山天大畜', symbol: '☶☰', lines: [1,1,1,0,0,1], judgment: '利贞，不家食吉，利涉大川', image: '天在山中，大畜；君子以多识前言往行', desc: '大蓄积累，蓄势待发' },
  { number: 27, name: '颐', nameCn: '山雷颐',   symbol: '☶☳', lines: [1,0,0,0,0,1], judgment: '贞吉。观颐，自求口实', image: '山下有雷，颐；君子以慎言语，节饮食', desc: '颐养修身，谨言慎行' },
  { number: 28, name: '大过', nameCn: '泽风大过', symbol: '☱☴', lines: [1,1,0,0,1,1], judgment: '栋桡，利有攸往，亨', image: '泽灭木，大过；君子以独立不惧', desc: '非常之时，独立不惧' },
  { number: 29, name: '坎', nameCn: '坎为水',   symbol: '☵☵', lines: [0,1,0,0,1,0], judgment: '习坎，有孚，维心亨，行有尚', image: '水洊至，习坎；君子以常德行，习教事', desc: '险难重重，心怀诚信' },
  { number: 30, name: '离', nameCn: '离为火',   symbol: '☲☲', lines: [1,0,1,1,0,1], judgment: '利贞，亨。畜牝牛，吉', image: '明两作，离；大人以继明照于四方', desc: '光明依附，正道普照' },
  { number: 31, name: '咸', nameCn: '泽山咸',   symbol: '☱☶', lines: [1,0,0,1,0,1], judgment: '亨，利贞，取女吉', image: '山上有泽，咸；君子以虚受人', desc: '感应交感，心灵相通' },
  { number: 32, name: '恒', nameCn: '雷风恒',   symbol: '☳☴', lines: [1,1,0,0,1,0], judgment: '亨，无咎，利贞，利有攸往', image: '雷风恒；君子以立不易方', desc: '恒久持久，持之以恒' },
  { number: 33, name: '遁', nameCn: '天山遁',   symbol: '☰☶', lines: [1,0,0,1,1,1], judgment: '亨，小利贞', image: '天下有山，遁；君子以远小人', desc: '退避隐遁，明哲保身' },
  { number: 34, name: '大壮', nameCn: '雷天大壮', symbol: '☳☰', lines: [1,1,1,0,1,0], judgment: '利贞', image: '雷在天上，大壮；君子以非礼弗履', desc: '强壮壮大，守礼合规' },
  { number: 35, name: '晋', nameCn: '火地晋',   symbol: '☲☷', lines: [0,0,0,1,0,1], judgment: '康侯用锡马蕃庶，昼日三接', image: '明出地上，晋；君子以自昭明德', desc: '进步晋升，步步高升' },
  { number: 36, name: '明夷', nameCn: '地火明夷', symbol: '☷☲', lines: [1,0,1,0,0,0], judgment: '利艰贞', image: '明入地中，明夷；君子以莅众用晦而明', desc: '光明受损，韬光养晦' },
  { number: 37, name: '家人', nameCn: '风火家人', symbol: '☴☲', lines: [1,0,1,1,1,0], judgment: '利女贞', image: '风自火出，家人；君子以言有物而行有恒', desc: '家庭和睦，治家有方' },
  { number: 38, name: '睽', nameCn: '火泽睽',   symbol: '☲☱', lines: [1,0,1,1,0,1], judgment: '小事吉', image: '上火下泽，睽；君子以同而异', desc: '对立分歧，求同存异' },
  { number: 39, name: '蹇', nameCn: '水山蹇',   symbol: '☵☶', lines: [1,0,0,0,1,0], judgment: '利西南，不利东北，利见大人，贞吉', image: '山上有水，蹇；君子以反身修德', desc: '困难险阻，反省修德' },
  { number: 40, name: '解', nameCn: '雷水解',   symbol: '☳☵', lines: [0,1,0,1,0,0], judgment: '利西南，无所往，其来复吉', image: '雷雨作，解；君子以赦过宥罪', desc: '解除化解，重获新生' },
  { number: 41, name: '损', nameCn: '山泽损',   symbol: '☶☱', lines: [1,0,0,1,0,1], judgment: '有孚，元吉，无咎，可贞', image: '山下有泽，损；君子以惩忿窒欲', desc: '适当牺牲，克制欲望' },
  { number: 42, name: '益', nameCn: '风雷益',   symbol: '☴☳', lines: [1,0,0,1,1,0], judgment: '利有攸往，利涉大川', image: '风雷益；君子以见善则迁，有过则改', desc: '增益利益，见贤思齐' },
  { number: 43, name: '夬', nameCn: '泽天夬',   symbol: '☱☰', lines: [1,1,1,1,0,1], judgment: '扬于王庭，孚号有厉', image: '泽上于天，夬；君子以施禄及下', desc: '决断果断，除旧布新' },
  { number: 44, name: '姤', nameCn: '天风姤',   symbol: '☰☴', lines: [1,1,0,1,1,1], judgment: '女壮，勿用取女', image: '天下有风，姤；后以施命诰四方', desc: '相遇邂逅，谨慎交往' },
  { number: 45, name: '萃', nameCn: '泽地萃',   symbol: '☱☷', lines: [0,0,0,1,0,1], judgment: '亨，王假有庙，利见大人', image: '泽上于地，萃；君子以除戎器，戒不虞', desc: '聚集汇聚，团结一心' },
  { number: 46, name: '升', nameCn: '地风升',   symbol: '☷☴', lines: [1,1,0,0,0,0], judgment: '元亨，用见大人，勿恤，南征吉', image: '地中生木，升；君子以顺德积小以高大', desc: '上升晋升，步步高升' },
  { number: 47, name: '困', nameCn: '泽水困',   symbol: '☱☵', lines: [0,1,0,1,0,1], judgment: '亨，贞大人吉，无咎', image: '泽无水，困；君子以致命遂志', desc: '困境艰难，坚守信念' },
  { number: 48, name: '井', nameCn: '水风井',   symbol: '☵☴', lines: [1,1,0,0,1,0], judgment: '改邑不改井，无丧无得', image: '木上有水，井；君子以劳民劝相', desc: '源泉活水，取之不尽' },
  { number: 49, name: '革', nameCn: '泽火革',   symbol: '☱☲', lines: [1,0,1,1,0,1], judgment: '己日乃孚，元亨利贞，悔亡', image: '泽中有火，革；君子以治历明时', desc: '变革革新，除旧布新' },
  { number: 50, name: '鼎', nameCn: '火风鼎',   symbol: '☲☴', lines: [1,1,0,1,0,1], judgment: '元吉，亨', image: '木上有火，鼎；君子以正位凝命', desc: '鼎新稳定，端正使命' },
  { number: 51, name: '震', nameCn: '震为雷',   symbol: '☳☳', lines: [1,0,0,1,0,0], judgment: '亨。震来虩虩，笑言哑哑', image: '洊雷，震；君子以恐惧修省', desc: '震动惊雷，心存敬畏' },
  { number: 52, name: '艮', nameCn: '艮为山',   symbol: '☶☶', lines: [0,0,1,0,0,1], judgment: '艮其背，不获其身，行其庭，不见其人', image: '兼山，艮；君子以思不出其位', desc: '停止静止，知止不殆' },
  { number: 53, name: '渐', nameCn: '风山渐',   symbol: '☴☶', lines: [1,0,0,1,1,0], judgment: '女归吉，利贞', image: '山上有木，渐；君子以居贤德善俗', desc: '渐进逐步，循序渐进' },
  { number: 54, name: '归妹', nameCn: '雷泽归妹', symbol: '☳☱', lines: [1,0,1,1,0,0], judgment: '征凶，无攸利', image: '泽上有雷，归妹；君子以永终知敝', desc: '回归婚嫁，善始善终' },
  { number: 55, name: '丰', nameCn: '雷火丰',   symbol: '☳☲', lines: [1,0,1,1,0,0], judgment: '亨，王假之，勿忧，宜日中', image: '雷电皆至，丰；君子以折狱致刑', desc: '丰盛盛大，居安思危' },
  { number: 56, name: '旅', nameCn: '火山旅',   symbol: '☲☶', lines: [1,0,0,1,0,1], judgment: '小亨，旅贞吉', image: '山上有火，旅；君子以明慎用刑', desc: '旅行漂泊，谨慎行事' },
  { number: 57, name: '巽', nameCn: '巽为风',   symbol: '☴☴', lines: [1,1,0,1,1,0], judgment: '小亨，利有攸往，利见大人', image: '随风，巽；君子以申命行事', desc: '顺从柔和，以柔克刚' },
  { number: 58, name: '兑', nameCn: '兑为泽',   symbol: '☱☱', lines: [1,0,1,1,0,1], judgment: '亨，利贞', image: '丽泽，兑；君子以朋友讲习', desc: '喜悦交流，欢乐和谐' },
  { number: 59, name: '涣', nameCn: '风水涣',   symbol: '☴☵', lines: [0,1,0,1,1,0], judgment: '亨，王假有庙，利涉大川', image: '风行水上，涣；先王以享于帝立庙', desc: '涣散化解，凝聚人心' },
  { number: 60, name: '节', nameCn: '水泽节',   symbol: '☵☱', lines: [1,0,1,0,1,0], judgment: '亨，苦节不可贞', image: '泽上有水，节；君子以制数度，议德行', desc: '节制节度，适可而止' },
  { number: 61, name: '中孚', nameCn: '风泽中孚', symbol: '☴☱', lines: [1,0,1,1,1,0], judgment: '豚鱼吉，利涉大川，利贞', image: '泽上有风，中孚；君子以议狱缓死', desc: '诚信信任，以诚待人' },
  { number: 62, name: '小过', nameCn: '雷山小过', symbol: '☳☶', lines: [1,0,0,1,0,0], judgment: '亨，利贞，可小事，不可大事', image: '山上有雷，小过；君子以行过乎恭', desc: '小有过越，谦恭谨慎' },
  { number: 63, name: '既济', nameCn: '水火既济', symbol: '☵☲', lines: [1,0,1,0,1,0], judgment: '亨小，利贞，初吉终乱', image: '水在火上，既济；君子以思患而预防之', desc: '成功完成，居安思危' },
  { number: 64, name: '未济', nameCn: '火水未济', symbol: '☲☵', lines: [0,1,0,1,0,1], judgment: '亨，小狐汔济，濡其尾，无攸利', image: '火在水上，未济；君子以慎辨物居方', desc: '未完成过渡，谨慎等待' },
]

// 建立 lines → hexagram 的索引 (用于快速查找)
const hexagramMap = new Map<string, typeof HEXAGRAMS_64[number]>()
HEXAGRAMS_64.forEach(h => {
  hexagramMap.set(h.lines.join(''), h)
})

// ============================================================
// 投币结果的爻值定义
// ============================================================
// sum yang coins: 3→9(老阳), 2→7(少阳), 1→8(少阴), 0→6(老阴)
function calcLineValue(yangCount: number): number {
  if (yangCount === 3) return 9  // 老阳 → 变爻
  if (yangCount === 2) return 7  // 少阳
  if (yangCount === 1) return 8  // 少阴
  return 6                       // 老阴 → 变爻
}

function lineValueToBinary(v: number): number {
  return (v === 7 || v === 9) ? 1 : 0  // 阳=1, 阴=0
}

// 每爻的显示名称
const YAO_NAMES = ['初', '二', '三', '四', '五', '上']

// ============================================================
// 卦象解读（本地兜底，当AI不可用时使用）
// ============================================================
const FALLBACK_INTERPRETATIONS: Record<string, string> = {
  '乾': '乾卦象征天道刚健，代表创造力和领导力。此时正是大展宏图的好时机，保持自强不息的精神，勇往直前。事业运极佳，感情和谐美满。',
  '坤': '坤卦象征大地的包容与承载，代表柔顺和厚德。此时适合守成蓄力，以退为进。与人合作将获得丰厚回报，耐心等待是关键。',
  '屯': '屯卦如草木初生，万事开头难。虽然面前困难重重，但只要坚持不懈，终能突破困境。保持乐观心态，贵人即将出现。',
  '蒙': '蒙卦象征启蒙与学习，提醒你需要虚心请教、不断学习。近期适合进修提升自我，知识将带来好运。有长辈或智者相助。',
  '需': '需卦代表等待和耐心。时机尚未成熟，不宜操之过急。利用这段时间充实自己，当机缘到来时，你已做好充分准备。',
  '讼': '讼卦提醒你避免争端与冲突。退一步海阔天空，以和为贵。近期处事宜冷静理性，避免因冲动做出后悔的决定。',
  '师': '师卦象征统帅与纪律。你有领导才能正在被发掘，适合承担重要责任。团队合作将带来成功，但需注意以德服人。',
  '比': '比卦代表亲近与合作。人际关系运势极佳，适合拓展社交圈、建立合作。真诚待人将收获意想不到的好运和友谊。',
  '小畜': '小畜卦象征小有积蓄，力量尚弱需渐进。积少成多，循序渐进，不宜冒进。',
  '履': '履卦象征践行与礼仪，小心谨慎行事。守礼合规，方能安泰。',
  '泰': '泰卦象征通泰和谐，天地交感万物亨通。诸事顺遂，把握机遇。',
  '否': '否卦象征闭塞不通。宜守静待变，韬光养晦，等待转机。',
  '同人': '同人卦象征志同道合。团结一心，与人和谐共处将带来成功。',
  '大有': '大有卦象征大有收获，事业兴旺。居安思危，行善积德。',
  '谦': '谦卦象征谦逊。虚心待人，不骄不躁。谦虚使人进步。',
  '豫': '豫卦象征欢乐预备。顺势而为，乘势而上。',
  '随': '随卦象征随从适应。顺应时势，灵活变通，水到渠成。',
  '蛊': '蛊卦象征整治革新。需要拨乱反正，革故鼎新。',
  '临': '临卦象征亲临治理。亲近民众，政通人和。',
  '观': '观卦象征观察审视。仔细观察，深思熟虑，静观其变。',
  '噬嗑': '噬嗑卦象征刑罚决断。果断处理问题，执法严明。',
  '贲': '贲卦象征文饰美化。注重外在修饰，文质彬彬，内外兼修。',
  '剥': '剥卦象征剥落衰败。宜守不宜进，静待时机。',
  '复': '复卦象征回复重生。否极泰来，把握良机重新出发。',
  '无妄': '无妄卦象征真实无妄。真诚无伪，脚踏实地。',
  '大畜': '大畜卦象征大蓄积。厚积薄发，蓄势待发。',
  '颐': '颐卦象征颐养。谨言慎行，修身养性。',
  '大过': '大过卦象征非常之时。独立不惧，勇于担当。',
  '坎': '坎卦象征险难。心怀诚信，方能渡过难关。',
  '离': '离卦象征光明依附。正道光明，普照四方。',
  '咸': '咸卦象征感应交感。以虚待人，感而遂通。',
  '恒': '恒卦象征恒久持久。坚守正道，持之以恒。',
  '遁': '遁卦象征退避隐遁。适时退让，明哲保身。',
  '大壮': '大壮卦象征强壮壮大。守礼合规，方能持久。',
  '晋': '晋卦象征进步晋升。自彰明德，步步高升。',
  '明夷': '明夷卦象征光明受损。韬光养晦，等待时机。',
  '家人': '家人卦象征家庭和睦。治家有方，家和万事兴。',
  '睽': '睽卦象征对立分歧。求同存异，化解矛盾。',
  '蹇': '蹇卦象征困难险阻。反省自身，修养品德。',
  '解': '解卦象征解除化解。困难已过，宽恕他人重获新生。',
  '损': '损卦象征损失减损。适当牺牲，克制欲望，损己利人。',
  '益': '益卦象征增益利益。见贤思齐，改过迁善。',
  '夬': '夬卦象征决断果断。果断决策，除旧布新。',
  '姤': '姤卦象征相遇邂逅。谨慎交往，明辨是非。',
  '萃': '萃卦象征聚集汇聚。团结一心，共创辉煌。',
  '升': '升卦象征上升晋升。积少成多，循序渐进。',
  '困': '困卦象征困境艰难。坚守信念，以命遂志。',
  '井': '井卦象征水井源泉。取之不尽，用之不竭。',
  '革': '革卦象征变革革新。顺势而变，革故鼎新。',
  '鼎': '鼎卦象征鼎新稳定。端正位置，凝聚使命。',
  '震': '震卦象征震动惊雷。心存敬畏，谨慎行事。',
  '艮': '艮卦象征停止静止。安分守己，知止不殆。',
  '渐': '渐卦象征渐进逐步。步步为营，稳扎稳打。',
  '归妹': '归妹卦象征回归婚嫁。善始善终，知进知退。',
  '丰': '丰卦象征丰盛盛大。居安思危，未雨绸缪。',
  '旅': '旅卦象征旅行旅居。谨慎行事，随遇而安。',
  '巽': '巽卦象征顺从柔和。顺势而为，以柔克刚。',
  '兑': '兑卦象征喜悦交流。以友辅仁，教学相长。',
  '涣': '涣卦象征涣散化解。凝聚人心，团结一致。',
  '节': '节卦象征节制节度。量入为出，适可而止。',
  '中孚': '中孚卦象征诚信信任。以诚待人，信守承诺。',
  '小过': '小过卦象征小有过越。谦恭谨慎，不越雷池。',
  '既济': '既济卦象征成功完成。居安思危，防患未然。',
  '未济': '未济卦象征未完成过渡。谨慎辨别，等待时机。',
}

// ============================================================
// 简易 Markdown 渲染器
// ============================================================
function renderMarkdown(text: string): string {
  if (!text) return ''
  return text
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-bold text-gold mt-3 mb-1">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold text-gold mt-4 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-gold mt-4 mb-2">$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em class="text-mystical-200">$1</em>')
    // List items
    .replace(/^[•\-] (.+)$/gm, '<li class="ml-4 list-disc text-mystical-200">$1</li>')
    // Wrap consecutive <li> in <ul>
    .replace(/((?:<li[^>]*>.*?<\/li>\n?)+)/g, '<ul class="space-y-1 my-2">$1</ul>')
    // Line breaks
    .replace(/\n/g, '<br/>')
}

// ============================================================
// 主组件
// ============================================================
export default function IChingPage() {
  const [isFlipping, setIsFlipping] = useState(false)
  const [roundCoins, setRoundCoins] = useState<boolean[][]>([])   // 每轮3个硬币结果
  const [roundLineValues, setRoundLineValues] = useState<number[]>([]) // 每轮爻值 (6/7/8/9)
  const [hexagramLines, setHexagramLines] = useState<number[]>([]) // 爻的二进制 (0/1)
  const [showResult, setShowResult] = useState(false)
  const [currentRound, setCurrentRound] = useState(0)
  const [isInterpreting, setIsInterpreting] = useState(false)
  const [interpretation, setInterpretation] = useState('')
  const [error, setError] = useState('')

  // 当前轮的硬币动画显示（最新一轮的结果）
  const currentCoins = roundCoins.length > 0 ? roundCoins[roundCoins.length - 1] : []

  // 查找匹配的卦象
  const selectedHexagram = hexagramLines.length === 6
    ? hexagramMap.get(hexagramLines.join('')) || null
    : null

  // 变爻位置（老阴6或老阳9的爻位）
  const changingLines = roundLineValues
    .map((v, i) => (v === 6 || v === 9) ? i + 1 : -1)
    .filter(i => i > 0)

  // ============================================================
  // 投掷铜钱
  // ============================================================
  const flipCoins = useCallback(() => {
    if (isFlipping) return
    if (hexagramLines.length >= 6) return
    setError('')
    setIsFlipping(true)

    setTimeout(() => {
      try {
        // 3枚铜钱，true=正面(阳)，false=反面(阴)
        const coins = Array.from({ length: 3 }, () => Math.random() > 0.5)
        const yangCount = coins.filter(Boolean).length
        const lineValue = calcLineValue(yangCount)
        const binary = lineValueToBinary(lineValue)

        setRoundCoins(prev => [...prev, coins])
        setRoundLineValues(prev => [...prev, lineValue])
        setHexagramLines(prev => [...prev, binary])
        setCurrentRound(prev => prev + 1)
      } catch (e) {
        setError('投掷出错，请重试')
      } finally {
        setIsFlipping(false)
      }
    }, 1200)
  }, [isFlipping, hexagramLines.length])

  // ============================================================
  // 获取解读
  // ============================================================
  const handleInterpret = async () => {
    if (!selectedHexagram) {
      setError('卦象匹配失败，请重新占卜')
      return
    }

    setIsInterpreting(true)
    setError('')

    try {
      // 尝试调用后端 AI 解读 API
      const changingText = changingLines.length > 0
        ? changingLines.map(n => `第${YAO_NAMES[n-1]}爻`).join('、')
        : '无'

      const response = await fetch('/api/iching/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: '请为我解读此卦象',
          hexagram_number: selectedHexagram.number,
          changing_lines: changingText,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.interpretation) {
          setInterpretation(data.interpretation)
          setShowResult(true)
          return
        }
      }

      // API 不可用时，使用本地兜底解读
      const fallback = FALLBACK_INTERPRETATIONS[selectedHexagram.name]
        || `${selectedHexagram.nameCn}（${selectedHexagram.name}）\n\n卦辞：${selectedHexagram.judgment}\n象辞：${selectedHexagram.image}\n\n此卦象蕴含深意，需要你用心体会其中的智慧。建议静心冥想，结合自身情况进行思考。\n\n🔮 灵境占卜，指引人生方向`
      setInterpretation(fallback)
      setShowResult(true)
    } catch {
      // 网络错误等，使用本地解读
      const fallback = FALLBACK_INTERPRETATIONS[selectedHexagram.name]
        || `${selectedHexagram.nameCn}（${selectedHexagram.name}）\n\n卦辞：${selectedHexagram.judgment}\n象辞：${selectedHexagram.image}\n\n此卦象蕴含深意，建议静心冥想，结合自身情况进行思考。`
      setInterpretation(fallback)
      setShowResult(true)
    } finally {
      setIsInterpreting(false)
    }
  }

  // ============================================================
  // 重置
  // ============================================================
  const handleReset = () => {
    setRoundCoins([])
    setRoundLineValues([])
    setHexagramLines([])
    setShowResult(false)
    setCurrentRound(0)
    setInterpretation('')
    setIsInterpreting(false)
    setError('')
  }

  // ============================================================
  // 渲染
  // ============================================================
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            <span className="text-gradient-gold">周易占卜</span>
          </h1>
          <p className="text-mystical-300">投掷铜钱，解读卦象，领悟古老智慧的指引</p>
        </motion.div>

        {/* 错误提示 */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 max-w-lg mx-auto p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400 text-sm"
          >
            <AlertCircle size={16} />
            {error}
          </motion.div>
        )}

        {/* ========== 卦象进度条 ========== */}
        <Card className="mb-8 max-w-lg mx-auto" padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-mystical-300">卦象生成</h3>
            <span className="text-xs text-mystical-400">{hexagramLines.length}/6 爻</span>
          </div>
          <div className="flex flex-col-reverse gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-mystical-500 w-8">{YAO_NAMES[i]}</span>
                <div className="flex-1 h-3 rounded-sm overflow-hidden bg-mystical-900/50">
                  {i < hexagramLines.length ? (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      className={`h-full rounded-sm ${
                        hexagramLines[i] === 1 ? 'bg-gold-500' : 'bg-gold-500/50'
                      }`}
                      style={{ transformOrigin: 'left' }}
                    />
                  ) : (
                    <div className="h-full bg-mystical-700/30 rounded-sm" />
                  )}
                </div>
                {i < hexagramLines.length && (
                  <span className="text-xs font-mono text-gold w-12">
                    {hexagramLines[i] === 1 ? '━━━' : '━ ━'}
                    <span className="text-mystical-500 ml-1">
                      {roundLineValues[i] ? `(${roundLineValues[i]})` : ''}
                    </span>
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* 已完成的卦象信息 */}
          {selectedHexagram && hexagramLines.length === 6 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 text-center p-4 bg-mystical-900/50 rounded-xl border border-gold-500/20"
            >
              <div className="text-3xl mb-2">{selectedHexagram.symbol}</div>
              <h3 className="text-xl font-bold text-gold">{selectedHexagram.name}卦</h3>
              <p className="text-sm text-mystical-300 mt-1">{selectedHexagram.nameCn}</p>
              <p className="text-xs text-mystical-400 mt-1">{selectedHexagram.image}</p>
              {changingLines.length > 0 && (
                <p className="text-xs text-yellow-400 mt-2">
                  变爻：{changingLines.map(n => `第${YAO_NAMES[n-1]}爻`).join('、')}
                </p>
              )}
            </motion.div>
          )}
        </Card>

        {/* ========== 投币区域 ========== */}
        {!showResult && (
          <div className="text-center mb-8">
            {/* 硬币动画 */}
            <div className="relative w-40 h-40 mx-auto mb-8">
              <AnimatePresence mode="wait">
                {isFlipping ? (
                  <motion.div
                    key="flipping"
                    initial={{ rotateY: 0, scale: 1 }}
                    animate={{ rotateY: 720, scale: 1.2 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 1.2, ease: 'easeInOut' }}
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 border-4 border-yellow-300 flex items-center justify-center shadow-lg shadow-yellow-500/30"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <span className="text-3xl font-bold text-yellow-800">乾隆通宝</span>
                  </motion.div>
                ) : currentCoins.length > 0 ? (
                  <motion.div
                    key={`result-${currentRound}`}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 grid grid-cols-3 gap-2"
                  >
                    {currentCoins.map((isYang, i) => (
                      <motion.div
                        key={i}
                        initial={{ rotateY: 180 }}
                        animate={{ rotateY: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        className={`rounded-full flex items-center justify-center text-lg font-bold border-2 ${
                          isYang
                            ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-300 text-yellow-900'
                            : 'bg-gradient-to-br from-gray-300 to-gray-500 border-gray-200 text-gray-700'
                        }`}
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        {isYang ? '正' : '反'}
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-mystical-700 to-mystical-800 border-2 border-mystical-500/30 flex items-center justify-center"
                  >
                    <span className="text-mystical-400 text-sm">点击投掷</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 按钮区 */}
            {hexagramLines.length < 6 ? (
              <div className="space-y-3">
                <Button
                  variant="gold"
                  size="lg"
                  onClick={flipCoins}
                  disabled={isFlipping}
                  loading={isFlipping}
                >
                  {isFlipping ? '投掷中...' : `投掷铜钱（第${currentRound + 1}次）`}
                </Button>
                {hexagramLines.length > 0 && (
                  <Button variant="ghost" onClick={handleReset}>
                    <RefreshCw size={16} className="mr-2" />
                    重新开始
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <Button
                  variant="gold"
                  size="lg"
                  onClick={handleInterpret}
                  loading={isInterpreting}
                >
                  <Sparkles size={18} className="mr-2" />
                  {isInterpreting ? 'AI解读中...' : '获取AI解读'}
                </Button>
                <Button variant="ghost" onClick={handleReset}>
                  <RefreshCw size={16} className="mr-2" />
                  重新占卜
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ========== 解读结果 ========== */}
        <AnimatePresence>
          {showResult && selectedHexagram && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="max-w-3xl mx-auto" padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                    <Sparkles size={20} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gold">AI 卦象解读</h3>
                    <p className="text-xs text-mystical-400">基于周易智慧与AI分析</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* 卦象概览 */}
                  <div className="bg-mystical-900/50 rounded-xl p-4 border border-mystical-600/20 text-center">
                    <div className="text-4xl mb-2">{selectedHexagram.symbol}</div>
                    <h4 className="text-xl font-bold text-gold">{selectedHexagram.name}卦</h4>
                    <p className="text-sm text-mystical-300 mt-1">{selectedHexagram.nameCn}</p>
                    <p className="text-xs text-mystical-400 mt-1">{selectedHexagram.image}</p>
                    {changingLines.length > 0 && (
                      <p className="text-xs text-yellow-400 mt-2">
                        变爻：{changingLines.map(n => `第${YAO_NAMES[n-1]}爻`).join('、')}
                      </p>
                    )}
                  </div>

                  {/* 解读内容（渲染 Markdown） */}
                  <div className="p-4 bg-gold-500/5 border border-gold-500/20 rounded-xl">
                    <h4 className="font-bold text-white mb-2">卦象解读</h4>
                    <div
                      className="text-sm text-mystical-200 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(interpretation) }}
                    />
                  </div>

                  {/* 卦象信息卡片 */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-mystical-900/50 rounded-xl p-3 border border-mystical-600/20">
                      <span className="text-mystical-400">卦辞</span>
                      <p className="text-white font-medium mt-1">{selectedHexagram.judgment}</p>
                    </div>
                    <div className="bg-mystical-900/50 rounded-xl p-3 border border-mystical-600/20">
                      <span className="text-mystical-400">卦象类型</span>
                      <p className="text-white font-medium mt-1">{selectedHexagram.desc}</p>
                    </div>
                    <div className="bg-mystical-900/50 rounded-xl p-3 border border-mystical-600/20">
                      <span className="text-mystical-400">卦象符号</span>
                      <p className="text-white font-medium mt-1">{selectedHexagram.symbol} {selectedHexagram.nameCn}</p>
                    </div>
                    <div className="bg-mystical-900/50 rounded-xl p-3 border border-mystical-600/20">
                      <span className="text-mystical-400">爻线</span>
                      <p className="text-white font-medium mt-1 font-mono">
                        {hexagramLines.map((l, i) => `${YAO_NAMES[i]}:${l === 1 ? '━━━' : '━ ━'}`).join('  ')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Button variant="gold" onClick={handleReset}>
                    <RefreshCw size={18} className="mr-2" />
                    重新占卜
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========== 说明区 ========== */}
        <div className="mt-12 mb-8">
          <Card className="max-w-3xl mx-auto" padding="lg">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-gold shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white mb-2">周易占卜指南</h4>
                <ul className="space-y-2 text-sm text-mystical-300">
                  <li>• <span className="text-gold">投掷铜钱</span>：每次投掷三枚铜钱，共需六次</li>
                  <li>• <span className="text-gold">正反面</span>：正面记为阳，反面记为阴</li>
                  <li>• <span className="text-gold">爻值</span>：3阳=9(老阳/变爻)，2阳=7(少阳)，1阳=8(少阴)，0阳=6(老阴/变爻)</li>
                  <li>• <span className="text-gold">六爻</span>：从下到上依次记录，组成完整卦象</li>
                  <li>• <span className="text-gold">变爻</span>：老阴(6)和老阳(9)为变爻，代表事物正在转化</li>
                  <li>• 占卜前请静心凝神，专注于你想要解答的问题</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
