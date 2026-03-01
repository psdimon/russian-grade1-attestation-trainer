/**
 * Task: t4
 * Type: single_pool_with_correct_flags
 * Title: Выбери слова, правильно разделенные для переноса
 * Constraints: {"total":6,"correct":3,"incorrect":3}
 * Constraints: в text каждого слова ставь тире во всех возможных местах переноса (если мест несколько, укажи все); это правило обязательно и для correct=true, и для correct=false
 * Constraints: для элементов с correct=true все отмеченные места переноса должны строго соответствовать правилам русского переноса
 * Constraints: отдельно для элементов с correct=false: для каждого слова обязательно должен быть хотя бы один намеренно неверный перенос
 * Constraints: намеренно неверный перенос для correct=false допускается только через отделение первого или последнего слога, состоящего ровно из одной гласной буквы (без согласных)
 * Constraints: для correct=false этот отделяемый одно-гласный слог должен быть реальным слогом в нормативном слогоделении слова
 * Constraints: запрещено отделять одиночную гласную, если она не является самостоятельным слогом (пример недопустимого шаблона: а-пте-ка)
 * Constraints: подбери слова не больше 3 или 4 слогов
 * Constraints: существительные только в именительном падеже единственного числа; глаголы только в неопределенной форме (инфинитив)
 */
export const taskT4 = {
  "meta": {
    "title": "Выбери слова, правильно разделенные для переноса",
    "type": "single_pool_with_correct_flags",
    "constraints": {
      "total": 6,
      "correct": 3,
      "incorrect": 3
    }
  },
  "items": [
    {
      "id": "t4-1",
      "text": "ма-ли-на",
      "correct": true
    },
    {
      "id": "t4-2",
      "text": "ка-ран-даш",
      "correct": true
    },
    {
      "id": "t4-3",
      "text": "бе-ре-за",
      "correct": true
    },
    {
      "id": "t4-4",
      "text": "ко-ро-на",
      "correct": true
    },
    {
      "id": "t4-5",
      "text": "гу-лять",
      "correct": true
    },
    {
      "id": "t4-6",
      "text": "чи-тать",
      "correct": true
    },
    {
      "id": "t4-7",
      "text": "пе-рец",
      "correct": true
    },
    {
      "id": "t4-8",
      "text": "мо-ре",
      "correct": true
    },
    {
      "id": "t4-9",
      "text": "до-ро-га",
      "correct": true
    },
    {
      "id": "t4-10",
      "text": "по-ло-са",
      "correct": true
    },
    {
      "id": "t4-11",
      "text": "ли-мон",
      "correct": true
    },
    {
      "id": "t4-12",
      "text": "бо-ло-то",
      "correct": true
    },
    {
      "id": "t4-13",
      "text": "ко-ле-со",
      "correct": true
    },
    {
      "id": "t4-14",
      "text": "ра-ду-га",
      "correct": true
    },
    {
      "id": "t4-15",
      "text": "ве-тер",
      "correct": true
    },
    {
      "id": "t4-16",
      "text": "са-пог",
      "correct": true
    },
    {
      "id": "t4-17",
      "text": "ка-пу-ста",
      "correct": true
    },
    {
      "id": "t4-18",
      "text": "ро-маш-ка",
      "correct": true
    },
    {
      "id": "t4-19",
      "text": "со-ба-ка",
      "correct": true
    },
    {
      "id": "t4-20",
      "text": "кни-га",
      "correct": true
    },
    {
      "id": "t4-21",
      "text": "тра-ва",
      "correct": true
    },
    {
      "id": "t4-22",
      "text": "ры-бак",
      "correct": true
    },
    {
      "id": "t4-23",
      "text": "но-сок",
      "correct": true
    },
    {
      "id": "t4-24",
      "text": "пу-го-ви-ца",
      "correct": true
    },
    {
      "id": "t4-25",
      "text": "ле-тать",
      "correct": true
    },
    {
      "id": "t4-26",
      "text": "а-ист",
      "correct": false
    },
    {
      "id": "t4-27",
      "text": "о-сень",
      "correct": false
    },
    {
      "id": "t4-28",
      "text": "у-гол",
      "correct": false
    },
    {
      "id": "t4-29",
      "text": "и-ней",
      "correct": false
    },
    {
      "id": "t4-30",
      "text": "э-таж",
      "correct": false
    },
    {
      "id": "t4-31",
      "text": "ю-ла",
      "correct": false
    },
    {
      "id": "t4-32",
      "text": "я-ма",
      "correct": false
    },
    {
      "id": "t4-33",
      "text": "ли-ни-я",
      "correct": false
    },
    {
      "id": "t4-34",
      "text": "ар-ми-я",
      "correct": false
    },
    {
      "id": "t4-35",
      "text": "ис-то-ри-я",
      "correct": false
    },
    {
      "id": "t4-36",
      "text": "се-мь-я",
      "correct": false
    },
    {
      "id": "t4-37",
      "text": "ста-ть-я",
      "correct": false
    },
    {
      "id": "t4-38",
      "text": "ру-жь-ё",
      "correct": false
    },
    {
      "id": "t4-39",
      "text": "вра-нь-ё",
      "correct": false
    },
    {
      "id": "t4-40",
      "text": "бе-ль-ё",
      "correct": false
    },
    {
      "id": "t4-41",
      "text": "пи-ть-ё",
      "correct": false
    },
    {
      "id": "t4-42",
      "text": "ко-пь-ё",
      "correct": false
    },
    {
      "id": "t4-43",
      "text": "пе-рь-я",
      "correct": false
    },
    {
      "id": "t4-44",
      "text": "дру-зь-я",
      "correct": false
    },
    {
      "id": "t4-45",
      "text": "ва-ре-нь-е",
      "correct": false
    },
    {
      "id": "t4-46",
      "text": "зда-ни-е",
      "correct": false
    },
    {
      "id": "t4-47",
      "text": "пе-ни-е",
      "correct": false
    },
    {
      "id": "t4-48",
      "text": "чте-ни-е",
      "correct": false
    },
    {
      "id": "t4-49",
      "text": "у-ме-ни-е",
      "correct": false
    },
    {
      "id": "t4-50",
      "text": "тер-пе-ни-е",
      "correct": false
    },
    {
      "id": "t4-51",
      "text": "во-ро-на",
      "correct": true
    },
    {
      "id": "t4-52",
      "text": "де-ре-во",
      "correct": true
    },
    {
      "id": "t4-53",
      "text": "ко-ро-ва",
      "correct": true
    },
    {
      "id": "t4-54",
      "text": "мо-ло-ко",
      "correct": true
    },
    {
      "id": "t4-55",
      "text": "пи-рог",
      "correct": true
    },
    {
      "id": "t4-56",
      "text": "са-лат",
      "correct": true
    },
    {
      "id": "t4-57",
      "text": "по-ми-дор",
      "correct": true
    },
    {
      "id": "t4-58",
      "text": "о-гу-рец",
      "correct": true
    },
    {
      "id": "t4-59",
      "text": "ка-стрю-ля",
      "correct": true
    },
    {
      "id": "t4-60",
      "text": "та-рел-ка",
      "correct": true
    },
    {
      "id": "t4-61",
      "text": "ло-па-та",
      "correct": true
    },
    {
      "id": "t4-62",
      "text": "бе-се-да",
      "correct": true
    },
    {
      "id": "t4-63",
      "text": "те-ле-фон",
      "correct": true
    },
    {
      "id": "t4-64",
      "text": "ма-га-зин",
      "correct": true
    },
    {
      "id": "t4-65",
      "text": "ка-ран-тин",
      "correct": true
    },
    {
      "id": "t4-66",
      "text": "па-ке-тик",
      "correct": true
    },
    {
      "id": "t4-67",
      "text": "ла-до-нь",
      "correct": true
    },
    {
      "id": "t4-68",
      "text": "до-мик",
      "correct": true
    },
    {
      "id": "t4-69",
      "text": "го-род",
      "correct": true
    },
    {
      "id": "t4-70",
      "text": "са-хар",
      "correct": true
    },
    {
      "id": "t4-71",
      "text": "му-зы-ка",
      "correct": true
    },
    {
      "id": "t4-72",
      "text": "ми-ну-та",
      "correct": true
    },
    {
      "id": "t4-73",
      "text": "пла-не-та",
      "correct": true
    },
    {
      "id": "t4-74",
      "text": "ко-ме-та",
      "correct": true
    },
    {
      "id": "t4-75",
      "text": "ви-та-мин",
      "correct": true
    },
    {
      "id": "t4-76",
      "text": "ке-фир",
      "correct": true
    },
    {
      "id": "t4-77",
      "text": "ко-фе",
      "correct": true
    },
    {
      "id": "t4-78",
      "text": "ки-сель",
      "correct": true
    },
    {
      "id": "t4-79",
      "text": "я-го-да",
      "correct": true
    },
    {
      "id": "t4-80",
      "text": "зе-лень",
      "correct": true
    },
    {
      "id": "t4-81",
      "text": "че-ре-па-ха",
      "correct": true
    },
    {
      "id": "t4-82",
      "text": "ба-ра-бан",
      "correct": true
    },
    {
      "id": "t4-83",
      "text": "ко-роб-ка",
      "correct": true
    },
    {
      "id": "t4-84",
      "text": "ло-шадь",
      "correct": true
    },
    {
      "id": "t4-85",
      "text": "пи-ра-ми-да",
      "correct": true
    },
    {
      "id": "t4-86",
      "text": "са-мо-лет",
      "correct": true
    },
    {
      "id": "t4-87",
      "text": "па-ро-ход",
      "correct": true
    },
    {
      "id": "t4-88",
      "text": "по-да-рок",
      "correct": true
    },
    {
      "id": "t4-89",
      "text": "за-мок",
      "correct": true
    },
    {
      "id": "t4-90",
      "text": "ку-ри-ца",
      "correct": true
    },
    {
      "id": "t4-91",
      "text": "пе-тух",
      "correct": true
    },
    {
      "id": "t4-92",
      "text": "мед-ведь",
      "correct": true
    },
    {
      "id": "t4-93",
      "text": "со-ло-вей",
      "correct": true
    },
    {
      "id": "t4-94",
      "text": "са-мо-вар",
      "correct": true
    },
    {
      "id": "t4-95",
      "text": "бу-ма-га",
      "correct": true
    },
    {
      "id": "t4-96",
      "text": "кар-ти-на",
      "correct": true
    },
    {
      "id": "t4-97",
      "text": "ма-ши-на",
      "correct": true
    },
    {
      "id": "t4-98",
      "text": "сне-жин-ка",
      "correct": true
    },
    {
      "id": "t4-99",
      "text": "ка-че-ли",
      "correct": true
    },
    {
      "id": "t4-100",
      "text": "го-ло-ва",
      "correct": true
    },
    {
      "id": "t4-101",
      "text": "а-ку-ла",
      "correct": false
    },
    {
      "id": "t4-102",
      "text": "о-бе-д",
      "correct": false
    },
    {
      "id": "t4-103",
      "text": "у-ро-жай",
      "correct": false
    },
    {
      "id": "t4-105",
      "text": "э-ки-паж",
      "correct": false
    },
    {
      "id": "t4-106",
      "text": "о-ли-ва",
      "correct": false
    },
    {
      "id": "t4-107",
      "text": "о-си-на",
      "correct": false
    },
    {
      "id": "t4-108",
      "text": "у-чи-тель",
      "correct": false
    },
    {
      "id": "t4-109",
      "text": "и-вол-га",
      "correct": false
    },
    {
      "id": "t4-110",
      "text": "о-ке-ан",
      "correct": false
    },
    {
      "id": "t4-111",
      "text": "о-зе-ро",
      "correct": false
    },
    {
      "id": "t4-112",
      "text": "у-ли-тка",
      "correct": false
    },
    {
      "id": "t4-113",
      "text": "и-рис-ка",
      "correct": false
    },
    {
      "id": "t4-114",
      "text": "э-та-жер-ка",
      "correct": false
    },
    {
      "id": "t4-115",
      "text": "а-на-нас",
      "correct": false
    },
    {
      "id": "t4-116",
      "text": "о-гу-рец",
      "correct": false
    },
    {
      "id": "t4-117",
      "text": "у-лыб-ка",
      "correct": false
    },
    {
      "id": "t4-118",
      "text": "и-зюм",
      "correct": false
    },
    {
      "id": "t4-119",
      "text": "э-ко-ном",
      "correct": false
    },
    {
      "id": "t4-120",
      "text": "а-фи-ша",
      "correct": false
    },
    {
      "id": "t4-121",
      "text": "ма-ги-я",
      "correct": false
    },
    {
      "id": "t4-122",
      "text": "хи-ми-я",
      "correct": false
    },
    {
      "id": "t4-123",
      "text": "фа-ми-ли-я",
      "correct": false
    },
    {
      "id": "t4-124",
      "text": "сим-фо-ни-я",
      "correct": false
    },
    {
      "id": "t4-125",
      "text": "те-о-ри-я",
      "correct": false
    },
    {
      "id": "t4-126",
      "text": "ак-ци-я",
      "correct": false
    },
    {
      "id": "t4-127",
      "text": "лек-ци-я",
      "correct": false
    },
    {
      "id": "t4-128",
      "text": "э-мо-ци-я",
      "correct": false
    },
    {
      "id": "t4-129",
      "text": "по-зи-ци-я",
      "correct": false
    },
    {
      "id": "t4-130",
      "text": "ре-ак-ци-я",
      "correct": false
    },
    {
      "id": "t4-131",
      "text": "ва-ре-ни-е",
      "correct": false
    },
    {
      "id": "t4-132",
      "text": "у-че-ни-е",
      "correct": false
    },
    {
      "id": "t4-133",
      "text": "ре-ше-ни-е",
      "correct": false
    },
    {
      "id": "t4-134",
      "text": "зна-че-ни-е",
      "correct": false
    },
    {
      "id": "t4-135",
      "text": "дви-же-ни-е",
      "correct": false
    },
    {
      "id": "t4-136",
      "text": "мне-ни-е",
      "correct": false
    },
    {
      "id": "t4-137",
      "text": "же-ла-ни-е",
      "correct": false
    },
    {
      "id": "t4-138",
      "text": "ды-ха-ни-е",
      "correct": false
    },
    {
      "id": "t4-139",
      "text": "стро-е-ни-е",
      "correct": false
    },
    {
      "id": "t4-140",
      "text": "ви-де-ни-е",
      "correct": false
    },
    {
      "id": "t4-141",
      "text": "пла-ва-ни-е",
      "correct": false
    },
    {
      "id": "t4-142",
      "text": "ко-па-ни-е",
      "correct": false
    },
    {
      "id": "t4-143",
      "text": "ка-та-ни-е",
      "correct": false
    },
    {
      "id": "t4-144",
      "text": "пи-та-ни-е",
      "correct": false
    },
    {
      "id": "t4-145",
      "text": "жи-ль-ё",
      "correct": false
    },
    {
      "id": "t4-146",
      "text": "сы-рь-ё",
      "correct": false
    },
    {
      "id": "t4-147",
      "text": "бе-ль-ё",
      "correct": false
    },
    {
      "id": "t4-148",
      "text": "вра-нь-ё",
      "correct": false
    },
    {
      "id": "t4-149",
      "text": "ру-жь-ё",
      "correct": false
    },
    {
      "id": "t4-150",
      "text": "ко-пь-ё",
      "correct": false
    }
  ]
};
