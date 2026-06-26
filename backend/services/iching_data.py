"""Complete 64 hexagrams data with Chinese names, descriptions, interpretations."""

HEXAGRAMS = [
    {"number": 1, "name": "乾", "name_cn": "乾为天", "symbol": "☰☰", "judgment": "元亨利贞", "image": "天行健，君子以自强不息", "description": "乾卦象征天，代表刚健、创造、领导力。此卦表示事物处于蓬勃发展的阶段，宜积极进取。", "keywords": "刚健、创造、领导、进取"},
    {"number": 2, "name": "坤", "name_cn": "坤为地", "symbol": "☷☷", "judgment": "元亨，利牝马之贞", "image": "地势坤，君子以厚德载物", "description": "坤卦象征地，代表包容、承载、柔顺。此卦表示应以柔顺之德待人处事。", "keywords": "包容、承载、柔顺、厚德"},
    {"number": 3, "name": "屯", "name_cn": "水雷屯", "symbol": "☵☳", "judgment": "元亨利贞，勿用有攸往", "image": "云雷屯，君子以经纶", "description": "屯卦象征初生之难，表示事物开始阶段的困难与挑战。需耐心等待时机。", "keywords": "初生、困难、等待、耐心"},
    {"number": 4, "name": "蒙", "name_cn": "山水蒙", "symbol": "☶☵", "judgment": "亨。匪我求童蒙，童蒙求我", "image": "山下出泉，蒙；君子以果行育德", "description": "蒙卦象征启蒙，表示需要学习和教育。虚心求教方能成长。", "keywords": "启蒙、教育、学习、成长"},
    {"number": 5, "name": "需", "name_cn": "水天需", "symbol": "☵☰", "judgment": "有孚，光亨，贞吉", "image": "云上于天，需；君子以饮食宴乐", "description": "需卦象征等待，表示时机未到，需耐心等待。养精蓄锐，静待良机。", "keywords": "等待、养精蓄锐、耐心、时机"},
    {"number": 6, "name": "讼", "name_cn": "天水讼", "symbol": "☰☵", "judgment": "有孚窒惕，中吉，终凶", "image": "天与水违行，讼；君子以作事谋始", "description": "讼卦象征争讼，表示矛盾冲突。宜以和为贵，避免争端。", "keywords": "争讼、矛盾、和解、调停"},
    {"number": 7, "name": "师", "name_cn": "地水师", "symbol": "☷☵", "judgment": "贞，丈人吉，无咎", "image": "地中有水，师；君子以容民畜众", "description": "师卦象征军队、众人，表示需要组织和领导。得道多助，失道寡助。", "keywords": "军队、领导、组织、纪律"},
    {"number": 8, "name": "比", "name_cn": "水地比", "symbol": "☵☷", "judgment": "吉。原筮元永贞，无咎", "image": "地上有水，比；先王以建万国，亲诸侯", "description": "比卦象征亲附、团结，表示合作与联盟。真诚待人，广结善缘。", "keywords": "亲附、团结、合作、联盟"},
    {"number": 9, "name": "小畜", "name_cn": "风天小畜", "symbol": "☴☰", "judgment": "亨。密云不雨，自我西郊", "image": "风行天上，小畜；君子以懿文德", "description": "小畜卦象征小有积蓄，表示力量尚弱，需渐进发展。积少成多，循序渐进。", "keywords": "小蓄、渐进、积累、等待"},
    {"number": 10, "name": "履", "name_cn": "天泽履", "symbol": "☰☱", "judgment": "履虎尾，不咥人，亨", "image": "上天下泽，履；君子以辩上下，定民志", "description": "履卦象征践行、礼仪，表示小心谨慎地行事。守礼合规，方能安泰。", "keywords": "践行、礼仪、谨慎、规矩"},
    {"number": 11, "name": "泰", "name_cn": "地天泰", "symbol": "☷☰", "judgment": "小往大来，吉亨", "image": "天地交，泰；后以财成天地之道", "description": "泰卦象征通泰、和谐，表示天地交感，万物亨通。国泰民安，诸事顺遂。", "keywords": "通泰、和谐、顺利、繁荣"},
    {"number": 12, "name": "否", "name_cn": "天地否", "symbol": "☰☷", "judgment": "否之匪人，不利君子贞", "image": "天地不交，否；君子以俭德辟难", "description": "否卦象征闭塞、不通，表示天地不交，万物不生。宜守静待变，韬光养晦。", "keywords": "闭塞、不通、守静、韬晦"},
    {"number": 13, "name": "同人", "name_cn": "天火同人", "symbol": "☰☲", "judgment": "同人于野，亨，利涉大川", "image": "天与火，同人；君子以类族辨物", "description": "同人卦象征志同道合，表示与人和谐共处。团结一心，共创伟业。", "keywords": "志同道合、团结、和谐、协作"},
    {"number": 14, "name": "大有", "name_cn": "火天大有", "symbol": "☲☰", "judgment": "元亨", "image": "火在天上，大有；君子以遏恶扬善", "description": "大有卦象征大有收获，表示事业兴旺，财运亨通。居安思危，行善积德。", "keywords": "大有、丰收、兴旺、行善"},
    {"number": 15, "name": "谦", "name_cn": "地山谦", "symbol": "☷☶", "judgment": "亨，君子有终", "image": "地中有山，谦；君子以裒多益寡", "description": "谦卦象征谦逊，表示虚心待人，不骄不躁。谦虚使人进步，骄傲使人落后。", "keywords": "谦逊、低调、进步、美德"},
    {"number": 16, "name": "豫", "name_cn": "雷地豫", "symbol": "☳☷", "judgment": "利建侯行师", "image": "雷出地奋，豫；先王以作乐崇德", "description": "豫卦象征欢乐、预备，表示愉悦和谐。顺势而为，乘势而上。", "keywords": "欢乐、预备、和谐、顺势"},
    {"number": 17, "name": "随", "name_cn": "泽雷随", "symbol": "☱☳", "judgment": "元亨利贞，无咎", "image": "泽中有雷，随；君子以向晦入宴息", "description": "随卦象征随从、适应，表示顺应时势，灵活变通。因势利导，水到渠成。", "keywords": "随从、适应、灵活、变通"},
    {"number": 18, "name": "蛊", "name_cn": "山风蛊", "symbol": "☶☴", "judgment": "元亨，利涉大川", "image": "山下有风，蛊；君子以振民育德", "description": "蛊卦象征整治、革新，表示需要拨乱反正。革故鼎新，重振旗鼓。", "keywords": "整治、革新、改革、振兴"},
    {"number": 19, "name": "临", "name_cn": "地泽临", "symbol": "☷☱", "judgment": "元亨利贞，至于八月有凶", "image": "泽上有地，临；君子以教思无穷", "description": "临卦象征亲临、治理，表示居高临下，亲近民众。亲民爱民，政通人和。", "keywords": "亲临、治理、亲近、爱民"},
    {"number": 20, "name": "观", "name_cn": "风地观", "symbol": "☴☷", "judgment": "盥而不荐，有孚颙若", "image": "风行地上，观；先王以省方观民设教", "description": "观卦象征观察、审视，表示仔细观察，深思熟虑。静观其变，以观后效。", "keywords": "观察、审视、深思、静观"},
    {"number": 21, "name": "噬嗑", "name_cn": "火雷噬嗑", "symbol": "☲☳", "judgment": "亨，利用狱", "image": "雷电噬嗑；先王以明罚敕法", "description": "噬嗑卦象征刑罚、决断，表示果断处理问题。执法严明，公正无私。", "keywords": "刑罚、决断、执法、公正"},
    {"number": 22, "name": "贲", "name_cn": "山火贲", "symbol": "☶☲", "judgment": "亨，小利有攸往", "image": "山下有火，贲；君子以明庶政", "description": "贲卦象征文饰、美化，表示注重外在修饰。文质彬彬，内外兼修。", "keywords": "文饰、美化、修饰、文雅"},
    {"number": 23, "name": "剥", "name_cn": "山地剥", "symbol": "☶☷", "judgment": "不利有攸往", "image": "山附于地，剥；上以厚下安宅", "description": "剥卦象征剥落、衰败，表示事物走向衰落。宜守不宜进，静待时机。", "keywords": "剥落、衰败、守静、等待"},
    {"number": 24, "name": "复", "name_cn": "地雷复", "symbol": "☷☳", "judgment": "亨。出入无疾，朋来无咎", "image": "雷在地中，复；先王以至日闭关", "description": "复卦象征回复、重生，表示否极泰来，生机重现。把握良机，重新出发。", "keywords": "回复、重生、生机、转折"},
    {"number": 25, "name": "无妄", "name_cn": "天雷无妄", "symbol": "☰☳", "judgment": "元亨利贞", "image": "天下雷行，物与无妄", "description": "无妄卦象征真实无妄，表示真诚无伪，顺应自然。不妄想妄求，脚踏实地。", "keywords": "真实、无妄、真诚、自然"},
    {"number": 26, "name": "大畜", "name_cn": "山天大畜", "symbol": "☶☰", "judgment": "利贞，不家食吉，利涉大川", "image": "天在山中，大畜；君子以多识前言往行", "description": "大畜卦象征大蓄积，表示积累深厚，蓄势待发。厚积薄发，大器晚成。", "keywords": "大蓄、积累、蓄势、厚积"},
    {"number": 27, "name": "颐", "name_cn": "山雷颐", "symbol": "☶☳", "吉", "image": "山下有雷，颐；君子以慎言语，节饮食", "description": "颐卦象征颐养，表示注重养生和修养。谨言慎行，修身养性。", "keywords": "颐养、养生、修养、慎言"},
    {"number": 28, "name": "大过", "name_cn": "泽风大过", "symbol": "☱☴", "judgment": "栋桡，利有攸往，亨", "image": "泽灭木，大过；君子以独立不惧", "description": "大过卦象征非常之时，表示超出常规。独立不惧，勇于担当。", "keywords": "非常、超出、独立、担当"},
    {"number": 29, "name": "坎", "name_cn": "坎为水", "symbol": "☵☵", "judgment": "习坎，有孚，维心亨，行有尚", "image": "水洊至，习坎；君子以常德行，习教事", "description": "坎卦象征险难，表示面临重重困难。心怀诚信，方能渡过难关。", "keywords": "险难、困难、诚信、坚持"},
    {"number": 30, "name": "离", "name_cn": "离为火", "symbol": "☲☲", "judgment": "利贞，亨。畜牝牛，吉", "image": "明两作，离；大人以继明照于四方", "description": "离卦象征光明、依附，表示附丽光明。正道光明，普照四方。", "keywords": "光明、依附、正道、普照"},
    {"number": 31, "name": "咸", "name_cn": "泽山咸", "symbol": "☱☶", "judgment": "亨，利贞，取女吉", "image": "山上有泽，咸；君子以虚受人", "description": "咸卦象征感应、交感，表示心灵相通。以虚待人，感而遂通。", "keywords": "感应、交感、相通、虚心"},
    {"number": 32, "name": "恒", "name_cn": "雷风恒", "symbol": "☳☴", "judgment": "亨，无咎，利贞，利有攸往", "image": "雷风恒；君子以立不易方", "description": "恒卦象征恒久、持久，表示持之以恒。坚守正道，恒久不变。", "keywords": "恒久、持久、坚持、不变"},
    {"number": 33, "name": "遁", "name_cn": "天山遁", "symbol": "☰☶", "judgment": "亨，小利贞", "image": "天下有山，遁；君子以远小人", "description": "遁卦象征退避、隐遁，表示适时退让。远离小人，明哲保身。", "keywords": "退避、隐遁、远离、保身"},
    {"number": 34, "name": "大壮", "name_cn": "雷天大壮", "symbol": "☳☰", "judgment": "利贞", "image": "雷在天上，大壮；君子以非礼弗履", "description": "大壮卦象征强壮、壮大，表示力量强盛。守礼合规，方能持久。", "keywords": "强壮、壮大、力量、守礼"},
    {"number": 35, "name": "晋", "name_cn": "火地晋", "symbol": "☲☷", "judgment": "康侯用锡马蕃庶，昼日三接", "image": "明出地上，晋；君子以自昭明德", "description": "晋卦象征进步、晋升，表示事业上升。自彰明德，步步高升。", "keywords": "进步、晋升、上升、明德"},
    {"number": 36, "name": "明夷", "name_cn": "地火明夷", "symbol": "☷☲", "judgment": "利艰贞", "image": "明入地中，明夷；君子以莅众用晦而明", "description": "明夷卦象征光明受损，表示韬光养晦。隐藏锋芒，等待时机。", "keywords": "光明受损、韬光养晦、隐藏、等待"},
    {"number": 37, "name": "家人", "name_cn": "风火家人", "symbol": "☴☲", "judgment": "利女贞", "image": "风自火出，家人；君子以言有物而行有恒", "description": "家人卦象征家庭、家族，表示家和万事兴。治家有方，家庭和睦。", "keywords": "家庭、和睦、治家、温馨"},
    {"number": 38, "name": "睽", "name_cn": "火泽睽", "symbol": "☲☱", "judgment": "小事吉", "image": "上火下泽，睽；君子以同而异", "description": "睽卦象征对立、分歧，表示意见不合。求同存异，化解矛盾。", "keywords": "对立、分歧、矛盾、化解"},
    {"number": 39, "name": "蹇", "name_cn": "水山蹇", "symbol": "☵☶", "judgment": "利西南，不利东北，利见大人，贞吉", "image": "山上有水，蹇；君子以反身修德", "description": "蹇卦象征困难、险阻，表示前进受阻。反省自身，修养品德。", "keywords": "困难、险阻、反省、修德"},
    {"number": 40, "name": "解", "name_cn": "雷水解", "symbol": "☳☵", "judgment": "利西南，无所往，其来复吉", "image": "雷雨作，解；君子以赦过宥罪", "description": "解卦象征解除、化解，表示困难已过。宽恕他人，重获新生。", "keywords": "解除、化解、宽恕、新生"},
    {"number": 41, "name": "损", "name_cn": "山泽损", "symbol": "☶☱", "judgment": "有孚，元吉，无咎，可贞", "image": "山下有泽，损；君子以惩忿窒欲", "description": "损卦象征损失、减损，表示适当牺牲。克制欲望，损己利人。", "keywords": "损失、减损、牺牲、克制"},
    {"number": 42, "name": "益", "name_cn": "风雷益", "symbol": "☴☳", "judgment": "利有攸往，利涉大川", "image": "风雷益；君子以见善则迁，有过则改", "description": "益卦象征增益、利益，表示获得帮助。见贤思齐，改过迁善。", "keywords": "增益、利益、进步、改过"},
    {"number": 43, "name": "夬", "name_cn": "泽天夬", "symbol": "☱☰", "judgment": "扬于王庭，孚号有厉", "image": "泽上于天，夬；君子以施禄及下", "description": "夬卦象征决断、果断，表示当机立断。果断决策，除旧布新。", "keywords": "决断、果断、决策、除旧"},
    {"number": 44, "name": "姤", "name_cn": "天风姤", "symbol": "☰☴", "judgment": "女壮，勿用取女", "image": "天下有风，姤；后以施命诰四方", "description": "姤卦象征相遇、邂逅，表示偶然相遇。谨慎交往，明辨是非。", "keywords": "相遇、邂逅、偶然、谨慎"},
    {"number": 45, "name": "萃", "name_cn": "泽地萃", "symbol": "☱☷", "judgment": "亨，王假有庙，利见大人", "image": "泽上于地，萃；君子以除戎器，戒不虞", "description": "萃卦象征聚集、汇聚，表示人才汇聚。团结一心，共创辉煌。", "keywords": "聚集、汇聚、团结、共创"},
    {"number": 46, "name": "升", "name_cn": "地风升", "symbol": "☷☴", "judgment": "元亨，用见大人，勿恤，南征吉", "image": "地中生木，升；君子以顺德积小以高大", "description": "升卦象征上升、晋升，表示步步高升。积少成多，循序渐进。", "keywords": "上升、晋升、积累、进步"},
    {"number": 47, "name": "困", "name_cn": "泽水困", "symbol": "☱☵", "judgment": "亨，贞大人吉，无咎", "image": "泽无水，困；君子以致命遂志", "description": "困卦象征困境、艰难，表示身处逆境。坚守信念，以命遂志。", "keywords": "困境、艰难、坚守、信念"},
    {"number": 48, "name": "井", "name_cn": "水风井", "symbol": "☵☴", "judgment": "改邑不改井，无丧无得", "image": "木上有水，井；君子以劳民劝相", "description": "井卦象征水井、源泉，表示源源不断。取之不尽，用之不竭。", "keywords": "源泉、井水、源源不断、滋养"},
    {"number": 49, "name": "革", "name_cn": "泽火革", "symbol": "☱☲", "judgment": "己日乃孚，元亨利贞，悔亡", "image": "泽中有火，革；君子以治历明时", "description": "革卦象征变革、革新，表示除旧布新。顺势而变，革故鼎新。", "keywords": "变革、革新、除旧、布新"},
    {"number": 50, "name": "鼎", "name_cn": "火风鼎", "symbol": "☲☴", "judgment": "元吉，亨", "image": "木上有火，鼎；君子以正位凝命", "description": "鼎卦象征鼎新、稳定，表示稳固基础。端正位置，凝聚使命。", "keywords": "鼎新、稳定、正位、凝命"},
    {"number": 51, "name": "震", "name_cn": "震为雷", "symbol": "☳☳", "judgment": "亨。震来虩虩，笑言哑哑", "image": "洊雷，震；君子以恐惧修省", "description": "震卦象征震动、惊雷，表示突发变化。心存敬畏，谨慎行事。", "keywords": "震动、惊雷、变化、敬畏"},
    {"number": 52, "name": "艮", "name_cn": "艮为山", "symbol": "☶☶", "judgment": "艮其背，不获其身，行其庭，不见其人", "image": "兼山，艮；君子以思不出其位", "description": "艮卦象征停止、静止，表示适时而止。安分守己，知止不殆。", "keywords": "停止、静止、安分、知止"},
    {"number": 53, "name": "渐", "name_cn": "风山渐", "symbol": "☴☶", "judgment": "女归吉，利贞", "image": "山上有木，渐；君子以居贤德善俗", "description": "渐卦象征渐进、逐步，表示循序渐进。步步为营，稳扎稳打。", "keywords": "渐进、逐步、循序、稳健"},
    {"number": 54, "name": "归妹", "name_cn": "雷泽归妹", "symbol": "☳☱", "judgment": "征凶，无攸利", "image": "泽上有雷，归妹；君子以永终知敝", "description": "归妹卦象征回归、婚嫁，表示事物归属。善始善终，知进知退。", "keywords": "回归、归属、善终、知退"},
    {"number": 55, "name": "丰", "name_cn": "雷火丰", "symbol": "☳☲", "judgment": "亨，王假之，勿忧，宜日中", "image": "雷电皆至，丰；君子以折狱致刑", "description": "丰卦象征丰盛、盛大，表示事业鼎盛。居安思危，未雨绸缪。", "keywords": "丰盛、盛大、鼎盛、居安思危"},
    {"number": 56, "name": "旅", "name_cn": "火山旅", "symbol": "☲☶", "judgment": "小亨，旅贞吉", "image": "山上有火，旅；君子以明慎用刑", "description": "旅卦象征旅行、旅居，表示在外漂泊。谨慎行事，随遇而安。", "keywords": "旅行、漂泊、谨慎、随遇而安"},
    {"number": 57, "name": "巽", "name_cn": "巽为风", "symbol": "☴☴", "judgment": "小亨，利有攸往，利见大人", "image": "随风，巽；君子以申命行事", "description": "巽卦象征顺从、柔和，表示以柔克刚。顺势而为，柔和处世。", "keywords": "顺从、柔和、顺势、以柔克刚"},
    {"number": 58, "name": "兑", "name_cn": "兑为泽", "symbol": "☱☱", "judgment": "亨，利贞", "image": "丽泽，兑；君子以朋友讲习", "description": "兑卦象征喜悦、交流，表示欢乐和谐。以友辅仁，教学相长。", "keywords": "喜悦、交流、欢乐、和谐"},
    {"number": 59, "name": "涣", "name_cn": "风水涣", "symbol": "☴☵", "judgment": "亨，王假有庙，利涉大川", "image": "风行水上，涣；先王以享于帝立庙", "description": "涣卦象征涣散、离散，表示化解涣散。凝聚人心，团结一致。", "keywords": "涣散、化解、凝聚、团结"},
    {"number": 60, "name": "节", "name_cn": "水泽节", "symbol": "☵☱", "judgment": "亨，苦节不可贞", "image": "泽上有水，节；君子以制数度，议德行", "description": "节卦象征节制、节度，表示适度节制。量入为出，适可而止。", "keywords": "节制、节度、适度、量入为出"},
    {"number": 61, "name": "中孚", "name_cn": "风泽中孚", "symbol": "☴☱", "judgment": "豚鱼吉，利涉大川，利贞", "image": "泽上有风，中孚；君子以议狱缓死", "description": "中孚卦象征诚信、信任，表示内心真诚。以诚待人，信守承诺。", "keywords": "诚信、信任、真诚、承诺"},
    {"number": 62, "name": "小过", "name_cn": "雷山小过", "symbol": "☳☶", "judgment": "亨，利贞，可小事，不可大事", "image": "山上有雷，小过；君子以行过乎恭", "description": "小过卦象征小有过越，表示小事可为。谦恭谨慎，不越雷池。", "keywords": "小过、谦恭、谨慎、适度"},
    {"number": 63, "name": "既济", "name_cn": "水火既济", "symbol": "☵☲", "judgment": "亨小，利贞，初吉终乱", "image": "水在火上，既济；君子以思患而预防之", "description": "既济卦象征成功、完成，表示事情已完成。居安思危，防患未然。", "keywords": "成功、完成、居安思危、防患"},
    {"number": 64, "name": "未济", "name_cn": "火水未济", "symbol": "☲☵", "judgment": "亨，小狐汔济，濡其尾，无攸利", "image": "火在水上，未济；君子以慎辨物居方", "description": "未济卦象征未完成、过渡，表示事情尚未结束。谨慎辨别，等待时机。", "keywords": "未完成、过渡、谨慎、等待"}
]


def get_hexagram_by_number(number: int) -> dict:
    """Get hexagram data by number."""
    for hexagram in HEXAGRAMS:
        if hexagram["number"] == number:
            return hexagram
    return None


def get_hexagram_by_name(name: str) -> dict:
    """Get hexagram data by Chinese name."""
    for hexagram in HEXAGRAMS:
        if hexagram["name"] == name or hexagram["name_cn"] == name:
            return hexagram
    return None


def get_random_hexagram() -> dict:
    """Get a random hexagram."""
    import random
    return random.choice(HEXAGRAMS)
