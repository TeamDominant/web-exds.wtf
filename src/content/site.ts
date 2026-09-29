import type { Text } from "@/lib/i18n"

export const BRAND = {
  name: "TeamDominant",
} as const

/** Fill in real contact links here — they're used in the CTA, FAQ page, legal page and footer. */
export const CONTACTS = {
  telegram: "https://t.me/teamdominant_get_bot/",
  email: "support@dominants.link",
} as const

export const META = {
  title: { ru: "TeamDominant", en: "TeamDominant" },
  description: {
    ru: "TeamDominant – современный сервис защищённого соединения: множество качественных локаций, без логов, на всех устройствах.",
    en: "TeamDominant is a modern secure-connection service: many quality locations, no logs, on every device.",
  },
} satisfies Record<string, Text>

export type NavLink = { href: string; label: Text }

export const NAV_LINKS: NavLink[] = [
  { href: "/#features", label: { ru: "Возможности", en: "Features" } },
  { href: "/#compare", label: { ru: "Сравнение", en: "Compare" } },
  { href: "/#pricing", label: { ru: "Тарифы", en: "Pricing" } },
  { href: "/#contact", label: { ru: "Контакты", en: "Contacts" } },
  { href: "/faq.html", label: { ru: "FAQ", en: "FAQ" } },
]

export const COMMON = {
  getStarted: { ru: "Подключить", en: "Get started" },
  menu: { ru: "Меню", en: "Menu" },
  backToTop: { ru: "Наверх", en: "Back to top" },
  language: { ru: "Язык", en: "Language" },
  theme: { ru: "Тема", en: "Theme" },
  themeSystem: { ru: "Как в системе", en: "System" },
  themeLight: { ru: "Светлая", en: "Light" },
  themeDark: { ru: "Тёмная", en: "Dark" },
  demo: {
    ru: "Независимый проект, не связанный с другими сервисами или брендами. Все совпадения случайны.",
    en: "An independent project, not affiliated with any other services or brands. Any resemblance is coincidental.",
  },
  tagline: { ru: "It's time to Dominate, isn't it?", en: "It's time to Dominate, isn't it?" },
} satisfies Record<string, Text>

export const HERO = {
  title: {
    accent: { ru: "Контролируй", en: "Control" },
    after: { ru: "своё соединение", en: "your connection" },
  },
  subtitle: {
    ru: "TeamDominant – сервис защищённого соединения: шифрует трафик, защищает приватность на всех устройствах. Подключение за пару минут – и можно забыть.",
    en: "TeamDominant is a secure-connection service that encrypts your traffic and protects your privacy on every device. Onboard in minutes and forget about it.",
  },
  primary: { ru: "Подключить", en: "Start now" },
  secondary: { ru: "Как это работает", en: "How it works" },
  checklist: [
    {
      ru: "Каналы до 2,5 Гбит/с и строгая политика без логов",
      en: "Channels up to 2.5 Gbit/s with a strict no-logs policy",
    },
    {
      ru: "Стабильное и быстрое соединение в любой точке мира",
      en: "Stable, fast connection anywhere in the world",
    },
    {
      ru: "Один аккаунт – все устройства, без лимитов",
      en: "One account – every device, no limits",
    },
  ] satisfies Text[],
  illustrationAlt: {
    ru: "Иллюстрация: люди под защитой TeamDominant",
    en: "Illustration: people protected by TeamDominant",
  },
}

export type PlatformId = "desktop" | "laptop" | "phone" | "tablet" | "tv" | "router"

export const PLATFORMS = {
  lead: {
    ru: "Работает на любой операционной системе, во всех браузерах и на большинстве роутеров.",
    en: "Works on every operating system, all browsers and most routers.",
  },
  items: [
    { id: "desktop", label: { ru: "Компьютер", en: "Desktop" } },
    { id: "laptop", label: { ru: "Ноутбук", en: "Laptop" } },
    { id: "phone", label: { ru: "Телефон", en: "Phone" } },
    { id: "tablet", label: { ru: "Планшет", en: "Tablet" } },
    { id: "tv", label: { ru: "Телевизор", en: "TV" } },
    { id: "router", label: { ru: "Роутер", en: "Router" } },
  ] satisfies { id: PlatformId; label: Text }[],
  // Popular devices across every platform, mixed so the ticker never shows two of a kind in a row.
  models: [
    "iPhone 17 Pro Max",
    "MacBook Air",
    "Netcraze Hopper SE",
    "Google Pixel 9",
    "Windows 11",
    "iPad Air",
    "Samsung Galaxy S25",
    "Lenovo ThinkPad",
    { ru: "Яндекс ТВ Станция", en: "Yandex TV Station" },
    "Keenetic Giga",
    "Xiaomi 15",
    "Galaxy Tab S10",
    "HUAWEI MateBook",
    "Xiaomi TV Stick 4K",
    "iPhone 18 Pro",
    "ASUS Zenbook",
    "Apple TV 4K",
    "Redmi Note 14",
    "POCO X7 Pro",
  ] satisfies (string | Text)[],
}

export const FEATURES = {
  kicker: { ru: "Возможности", en: "Capabilities" },
  title: {
    ru: "Сделано для скорости, приватности и спокойствия",
    en: "Built for speed, privacy and zero hassle",
  },
  subtitle: {
    ru: "Всё для быстрого и приватного соединения – без замедлений, логов и лимитов.",
    en: "Everything you need for a fast, private connection – without slowdowns, logs or limits.",
  },
  uptime: {
    value: 99.9,
    title: { ru: "Аптайм сети", en: "Network uptime" },
  },
  speed: {
    title: { ru: "Скорость без компромиссов", en: "Speed without compromise" },
    text: {
      ru: "Серверы от 1 до 2,5 Гбит/с и только проверенные дата-центры. Мы не храним историю и не следим за трафиком.",
      en: "Servers from 1 to 2.5 Gbit/s and only vetted data centers. We don't store history or watch your traffic.",
    },
  },
  privacy: {
    title: { ru: "Приватность по умолчанию", en: "Privacy by default" },
    text: {
      ru: "Современные протоколы без утечек. Ни истории, ни DNS-запросов, ни содержимого трафика.",
      en: "Modern, audited protocols with no leaks. No history, no DNS queries, no traffic contents.",
    },
  },
  devices: {
    title: { ru: "Все устройства, один аккаунт", en: "Every device, one account" },
    text: {
      ru: "Windows, macOS, iOS, Android, Linux и роутеры.",
      en: "Windows, macOS, iOS, Android, Linux and routers.",
    },
  },
  support: {
    title: { ru: "Живая поддержка 24/7", en: "24/7 live support" },
    text: {
      ru: "Живые люди в чате, быстрые ответы и помощь с настройкой в любое время.",
      en: "Real people in chat, fast answers and setup help whenever you need it.",
    },
  },
}

export type Server = {
  flag: string
  city: Text
  host: string
  ping: number
  load: number
  speed: number
  /** [latitude, longitude] for the globe marker */
  location: [number, number]
}

export const LOCATIONS = {
  kicker: { ru: "Локации", en: "Locations" },
  title: { ru: "Множество качественных локаций", en: "Many quality locations" },
  subtitle: {
    ru: "Качество, а не количество – узлы выбраны за скорость и стабильность, а не ради длинного списка.",
    en: "Quality over quantity – vetted nodes chosen for speed and stability, not just a long list.",
  },
  panel: {
    title: { ru: "Соединение", en: "Connection" },
    fastest: { ru: "Быстрые серверы", en: "Fastest servers" },
    down: { ru: "Гбит/с · приём", en: "Gbit/s · down" },
  },
  // Ping is a typical round trip from Moscow.
  servers: [
    { flag: "DE", city: { ru: "Франкфурт", en: "Frankfurt" }, host: "fra-01.td", ping: 38, load: 47, speed: 2.3, location: [50.11, 8.68] },
    { flag: "DE", city: { ru: "Нюрнберг", en: "Nuremberg" }, host: "nue-02.td", ping: 41, load: 38, speed: 2.1, location: [49.45, 11.08] },
    { flag: "NL", city: { ru: "Амстердам", en: "Amsterdam" }, host: "ams-03.td", ping: 44, load: 34, speed: 2.2, location: [52.37, 4.9] },
    { flag: "NL", city: { ru: "Эйгельсховен", en: "Eygelshoven" }, host: "eyg-01.td", ping: 46, load: 29, speed: 1.9, location: [50.89, 6.06] },
    { flag: "JP", city: { ru: "Токио", en: "Tokyo" }, host: "tyo-01.td", ping: 162, load: 41, speed: 1.3, location: [35.68, 139.69] },
    { flag: "RU", city: { ru: "Москва", en: "Moscow" }, host: "msk-01.td", ping: 3, load: 56, speed: 2.4, location: [55.76, 37.62] },
  ] satisfies Server[],
}

export const STEPS = {
  kicker: { ru: "Как это работает", en: "How it works" },
  title: { ru: "Запуск в три шага", en: "Up and running in three steps" },
  items: [
    {
      title: { ru: "Выбери тариф", en: "Pick a plan" },
      text: {
        ru: "Выбери число устройств и срок. Чем длиннее срок – тем ниже цена за месяц.",
        en: "Choose the number of devices and term. The longer the term – the lower the monthly price.",
      },
    },
    {
      title: { ru: "Установи приложение", en: "Install the app" },
      text: {
        ru: "Один аккаунт работает на Windows, macOS, iOS, Android, Linux и роутерах.",
        en: "One account works on Windows, macOS, iOS, Android, Linux and routers.",
      },
    },
    {
      title: { ru: "Подключайся и доминируй", en: "Connect & dominate" },
      text: {
        ru: "Жми «Подключить», выбирай самый быстрый сервер и забудь о тормозах и обрывах.",
        en: "Tap connect, pick the fastest server and forget about slowdowns and drops.",
      },
    },
  ] satisfies { title: Text; text: Text }[],
}

export type Mark = "yes" | "part" | "no"

export type Provider = {
  logo: string
  /** Our own column: shows the brand mark instead of the `logo` letters. */
  us?: boolean
  name: Text
  tagline: Text
  tint: "brand" | "pink" | "blue" | "green"
}

export const COMPARE = {
  kicker: { ru: "Сравнение", en: "Comparison" },
  title: { ru: "Что есть у нас – и нет у других", en: "What we have – and others don't" },
  subtitle: { ru: "Нажми на строку, чтобы раскрыть детали.", en: "Tap any row to see the details." },
  capability: { ru: "Возможность", en: "Capability" },
  legend: {
    yes: { ru: "есть", en: "yes" },
    part: { ru: "частично", en: "partial" },
    no: { ru: "нет", en: "no" },
  } satisfies Record<Mark, Text>,
  providers: [
    { logo: "TD", us: true, name: { ru: "TeamDominant", en: "TeamDominant" }, tagline: { ru: "это мы", en: "that's us" }, tint: "brand" },
    { logo: "Z", name: { ru: "Z**ret", en: "Z**ret" }, tagline: { ru: "опенсорс-утилита", en: "open-source tool" }, tint: "pink" },
    { logo: "ДВ", name: { ru: "Дядя Петя", en: "Дядя Петя" }, tagline: { ru: "Telegram-бот", en: "Telegram bot" }, tint: "blue" },
    { logo: "MS", name: { ru: "Масс-маркет сервис", en: "Mainstream service" }, tagline: { ru: "крупный бренд", en: "big brand" }, tint: "green" },
  ] satisfies Provider[],
  rows: [
    {
      feature: { ru: "Умный роутинг – соединение можно не выключать", en: "Smart routing – no need to toggle the connection" },
      detail: {
        ru: "Локальный трафик идёт напрямую, остальной – через защищённый туннель. Не нужно вручную включать и выключать – всё работает в фоне.",
        en: "Local traffic goes direct, the rest runs through the secure tunnel. No manual on/off – it just works in the background.",
      },
      marks: ["yes", "part", "no", "part"],
    },
    {
      feature: { ru: "Стабильный канал, без гонки за количеством", en: "Stable channel, no race for server count" },
      detail: {
        ru: "Мы не набиваем список сотнями мёртвых серверов. Каждый узел держит заявленную скорость даже под нагрузкой.",
        en: "We don't pad the list with hundreds of dead servers. Every node holds its stated speed under load.",
      },
      marks: ["yes", "no", "no", "no"],
    },
    {
      feature: { ru: "Безлимитный трафик", en: "Unlimited traffic" },
      detail: {
        ru: "Никаких лимитов по гигабайтам и троттлинга после порога – пользуйся сколько нужно.",
        en: "No gigabyte caps and no throttling after a threshold – use as much as you need.",
      },
      marks: ["yes", "part", "no", "part"],
    },
    {
      feature: { ru: "Несколько устройств в подписке + выгодные тарифы", en: "Several devices per plan + fair pricing" },
      detail: {
        ru: "До 15 устройств на один аккаунт с возможностью докупить ещё, а цена за месяц ниже при длинном сроке подписки.",
        en: "Up to 15 devices on one account with more available to buy, and the monthly price drops the longer your term.",
      },
      marks: ["yes", "no", "no", "part"],
    },
    {
      feature: { ru: "Личный кабинет на сайте, а не только в Telegram-боте", en: "Dashboard on the web, not just a Telegram bot" },
      detail: {
        ru: "Управляй подпиской и устройствами и на сайте, и в боте – как удобнее именно тебе.",
        en: "Manage your subscription and devices both on the website and in the bot – whichever is handier.",
      },
      marks: ["yes", "no", "part", "yes"],
    },
    {
      feature: { ru: "Быстрая живая поддержка", en: "Fast human support" },
      detail: {
        ru: "Живые люди в чате – быстрые ответы и помощь с настройкой в любое время.",
        en: "Real people in chat – quick answers and help with setup whenever you need it.",
      },
      marks: ["yes", "no", "part", "part"],
    },
    {
      feature: { ru: "Максимально быстрое реагирование на проблемы", en: "Rapid response to incidents" },
      detail: {
        ru: "Мы мониторим сеть и устраняем сбои за считанные минуты, а не дни.",
        en: "We monitor the network and fix outages in minutes, not days.",
      },
      marks: ["yes", "no", "no", "part"],
    },
    {
      feature: { ru: "Стабильные улучшения сервиса", en: "Steady service improvements" },
      detail: {
        ru: "Регулярные обновления приложений и инфраструктуры – сервис постоянно становится лучше.",
        en: "Regular app and infrastructure updates – the service keeps getting better.",
      },
      marks: ["yes", "part", "no", "part"],
    },
    {
      feature: { ru: "Промокоды, реферальная и партнёрская программы", en: "Promo codes, referral & partner programs" },
      detail: {
        ru: "Скидки по промокодам, награды за приглашённых друзей и партнёрская программа для команд.",
        en: "Discounts via promo codes, rewards for invited friends and a partner program for teams.",
      },
      marks: ["yes", "no", "no", "part"],
    },
  ] satisfies { feature: Text; detail: Text; marks: [Mark, Mark, Mark, Mark] }[],
}

export type Period = 1 | 3 | 12
export type TierId = "start" | "plus" | "max"

export type Tier = {
  id: TierId
  name: Text
  /** Simultaneous devices: [from, to]. */
  devices: [number, number]
  featured?: boolean
  /** Total price in ₽ for each subscription period. */
  prices: Record<Period, number>
  features: Text[]
  cta: Text
  /** Who the plan is for, shown under the button. */
  description?: Text
  /** Free-trial terms, shown under the button with a gift icon. */
  trial?: Text
}

export const PRICING = {
  kicker: { ru: "Тарифы", en: "Pricing" },
  title: { ru: "Одна подписка. Выбирай срок.", en: "One subscription. Pick your term." },
  subtitle: {
    ru: "Тарифы отличаются количеством одновременных устройств. Чем длиннее срок – тем ниже цена за месяц.",
    en: "Tariffs differ by the number of simultaneous devices. The longer the term – the lower the monthly price.",
  },
  periodLabel: { ru: "Срок подписки", en: "Subscription period" },
  periods: [
    { months: 1, label: { ru: "1 месяц", en: "1 month" }, save: 0 },
    { months: 3, label: { ru: "3 месяца", en: "3 months" }, save: 11 },
    { months: 12, label: { ru: "12 месяцев", en: "12 months" }, save: 25 },
  ] satisfies { months: Period; label: Text; save: number }[],
  currency: "₽",
  perMonth: { ru: "/ мес", en: "/ mo" },
  billedMonthly: { ru: "оплата помесячно", en: "billed monthly" },
  billedFor: { ru: "за", en: "for" },
  popular: { ru: "Популярный", en: "Popular" },
  devicesFor: { ru: "Для", en: "For" },
  devices: { ru: "устройств", en: "devices" },
  tiers: [
    {
      id: "start",
      name: { ru: "Старт", en: "Start" },
      devices: [3, 5],
      prices: { 1: 250, 3: 670, 12: 2250 },
      features: [
        { ru: "Множество качественных локаций", en: "Many quality locations" },
        { ru: "Безлимитный трафик, без логов", en: "Unlimited traffic, no logs" },
        { ru: "Современные протоколы", en: "Modern protocols" },
        { ru: "Поддержка в чате", en: "Chat support" },
      ],
      cta: { ru: "Начать бесплатно", en: "Start for free" },
      trial: {
        ru: "Первый день бесплатно: 10 ГБ трафика, 1 устройство. Дальше – «Старт» по обычной цене.",
        en: "First day free: 10 GB of traffic, 1 device. Then Start at the regular price.",
      },
    },
    {
      id: "plus",
      name: { ru: "Плюс", en: "Plus" },
      devices: [6, 9],
      featured: true,
      prices: { 1: 400, 3: 1070, 12: 3600 },
      features: [
        { ru: "Всё из «Старт»", en: "Everything in Start" },
        { ru: "До 9 устройств одновременно", en: "Up to 9 devices at once" },
        { ru: "Приоритетные серверы", en: "Priority servers" },
        { ru: "Поддержка 24/7", en: "24/7 support" },
      ],
      cta: { ru: "Выбрать «Плюс»", en: "Choose Plus" },
      description: { ru: "Для семьи или всех ваших устройств сразу.", en: "For a family or all your devices at once." },
    },
    {
      id: "max",
      name: { ru: "Максимум", en: "Maximum" },
      devices: [10, 15],
      prices: { 1: 600, 3: 1600, 12: 5400 },
      features: [
        { ru: "Всё из «Плюс»", en: "Everything in Plus" },
        { ru: "До 15 устройств и возможность докупить ещё", en: "Up to 15 devices, with more available to buy" },
        { ru: "Выделенный IP по запросу", en: "Dedicated IP on request" },
        { ru: "Персональный менеджер", en: "Personal manager" },
      ],
      cta: { ru: "Выбрать «Максимум»", en: "Choose Maximum" },
      description: { ru: "Для большой семьи или небольшой команды.", en: "For a big family or a small team." },
    },
  ] satisfies Tier[],
}

export type FaqItem = { q: Text; a: Text }

export const FAQ = {
  kicker: { ru: "Центр помощи", en: "Help center" },
  title: { ru: "Частые вопросы", en: "Frequently asked questions" },
  subtitle: {
    ru: "Коротко об устройствах, оплате, протоколах и возвратах. Не нашли ответ? Напишите нам в Telegram.",
    en: "Short answers about devices, payments, protocols and refunds. Still stuck? Ping us in Telegram.",
  },
  all: { ru: "Все вопросы", en: "All questions" },
  stillStuck: { ru: "Не нашли ответ?", en: "Still have a question?" },
  writeUs: { ru: "Написать в Telegram", en: "Message us on Telegram" },
  items: [
    {
      q: { ru: "Чем отличаются тарифы?", en: "What's the difference between the plans?" },
      a: {
        ru: "Все тарифы используют одну сеть, одинаковую скорость и политику отсутствия логов. Отличие – только в количестве одновременно подключённых устройств: «Старт» – от 3 до 5, «Плюс» – от 6 до 9, «Максимум» – от 10 до 15 с возможностью докупить ещё.",
        en: "All plans share the same network, speed and no-logs policy. They differ only in how many devices you can connect at once: Start – 3 to 5, Plus – 6 to 9, Maximum – 10 to 15, with more available to buy.",
      },
    },
    {
      q: { ru: "Как работают сроки подписки?", en: "How do subscription terms work?" },
      a: {
        ru: "Можно оплатить 1, 3 или 12 месяцев. Чем длиннее срок, тем ниже цена за месяц – до −25% на годовой подписке. Набор возможностей при этом не меняется.",
        en: "You can pay for 1, 3 or 12 months. The longer the term, the lower the monthly price – up to −25% on the annual plan. The set of features stays the same.",
      },
    },
    {
      q: { ru: "Какие устройства поддерживаются?", en: "Which devices are supported?" },
      a: {
        ru: "Windows, macOS, Linux, iOS, Android и роутеры. Один аккаунт работает сразу на нескольких устройствах в пределах лимита вашего тарифа.",
        en: "Windows, macOS, Linux, iOS, Android and routers. One account works across several devices at once within your plan's limit.",
      },
    },
    {
      q: { ru: "Вы храните логи?", en: "Do you keep logs?" },
      a: {
        ru: "Нет. Мы не храним историю посещений, DNS-запросы и содержимое трафика. Сохраняется только минимум, необходимый для работы подписки.",
        en: "No. We don't store your browsing history, DNS queries or traffic contents. We only keep the minimum needed to run your subscription.",
      },
    },
    {
      q: { ru: "Как быстро придёт доступ после оплаты?", en: "How fast will I get access after payment?" },
      a: {
        ru: "Обычно в течение пары минут. Вы получите конфигурацию и короткую инструкцию по настройке. Если что-то пойдёт не так – поддержка на связи 24/7.",
        en: "Usually within a couple of minutes. You'll receive a configuration and a short setup guide. If anything goes wrong, support is available 24/7.",
      },
    },
    {
      q: { ru: "Можно ли менять локации?", en: "Can I switch locations?" },
      a: {
        ru: "Да, свободно и без доплат. Множество качественных локаций доступно на любом тарифе – меняйте регион в один клик.",
        en: "Yes, freely and at no extra cost. Every location is available on all plans – switch your region in a single click.",
      },
    },
    {
      q: { ru: "Что насчёт возвратов?", en: "What about refunds?" },
      a: {
        ru: "Возврат возможен, если доступ не был предоставлен или услуга не оказана по технической вине сервиса. Напишите в поддержку в течение 24 часов после оплаты – каждый случай рассматривается индивидуально по условиям пользовательского соглашения.",
        en: "A refund is possible if access wasn't provided or the service wasn't delivered due to a technical fault on our side. Contact support within 24 hours of payment – each case is reviewed individually under the user agreement.",
      },
    },
  ] satisfies FaqItem[],
}

export const CTA = {
  kicker: { ru: "Подключение", en: "Get connected" },
  title: { ru: "Готов начать?", en: "Ready to start?" },
  text: {
    ru: "Выберите тариф – и мы пришлём настройку за пару минут. Есть вопросы? Напишите нам, отвечаем быстро.",
    en: "Pick a plan and we'll send setup in a couple of minutes. Questions? Write to us – we reply fast.",
  },
  button: { ru: "Выбрать тариф", en: "Choose a plan" },
}

export const FOOTER = {
  columns: [
    {
      title: { ru: "Продукт", en: "Product" },
      links: [
        { href: "/#features", label: { ru: "Возможности", en: "Features" } },
        { href: "/#platforms", label: { ru: "Платформы", en: "Platforms" } },
        { href: "/#pricing", label: { ru: "Тарифы", en: "Pricing" } },
      ],
    },
    {
      title: { ru: "Помощь", en: "Help" },
      links: [
        { href: "/faq.html", label: { ru: "FAQ", en: "FAQ" } },
        { href: "/#contact", label: { ru: "Контакты", en: "Contacts" } },
      ],
    },
    {
      title: { ru: "Правовое", en: "Legal" },
      links: [
        { href: "/legal.html#privacy", label: { ru: "Конфиденциальность", en: "Privacy policy" } },
        { href: "/legal.html#terms", label: { ru: "Соглашение", en: "User agreement" } },
        { href: "/legal.html#requisites", label: { ru: "Реквизиты", en: "Company details" } },
      ],
    },
  ] satisfies { title: Text; links: NavLink[] }[],
}
