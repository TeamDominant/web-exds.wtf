import { CONTACTS } from "@/content/site"
import type { Text } from "@/lib/i18n"

export type LegalBlock =
  | { type: "h3"; text: Text }
  | { type: "p"; text: Text }
  | { type: "ul"; items: Text[] }
  /** Label → value table, e.g. company details; a row with `href` renders as a link. */
  | { type: "details"; rows: { label: Text; value: Text; href?: string }[] }

export type LegalSection = {
  id: string
  title: Text
  blocks: LegalBlock[]
}

export const LEGAL_META = {
  kicker: { ru: "Правовое", en: "Legal" },
  title: { ru: "Документы и конфиденциальность", en: "Terms & privacy" },
  subtitle: {
    ru: "Политика конфиденциальности и пользовательское соглашение сервиса TeamDominant.",
    en: "The TeamDominant privacy policy and user agreement.",
  },
  pageTitle: { ru: "Правовое – TeamDominant", en: "Legal – TeamDominant" },
  description: {
    ru: "Политика конфиденциальности и пользовательское соглашение TeamDominant.",
    en: "TeamDominant privacy policy and user agreement.",
  },
} satisfies Record<string, Text>

const h3 = (ru: string, en: string): LegalBlock => ({ type: "h3", text: { ru, en } })
const p = (ru: string, en: string): LegalBlock => ({ type: "p", text: { ru, en } })
const ul = (...items: [ru: string, en: string][]): LegalBlock => ({
  type: "ul",
  items: items.map(([ru, en]) => ({ ru, en })),
})
/** Text that reads the same in both languages (numbers, emails). */
const same = (value: string): Text => ({ ru: value, en: value })

export const LEGAL_SECTIONS: LegalSection[] = [
  {
    id: "privacy",
    title: { ru: "Политика конфиденциальности", en: "Privacy policy" },
    blocks: [
      p(
        "Настоящая Политика конфиденциальности регулирует сбор, использование, хранение и защиту информации пользователей сервиса. Сервис обрабатывает только данные, необходимые для работы, связи с пользователями, оказания поддержки, анализа использования и повышения качества обслуживания.",
        "This Privacy Policy governs how information about users of the service is collected, used, stored and protected. The service processes only the data needed to operate, communicate with users, provide support, analyse usage and improve the quality of service."
      ),

      h3("1. Общие положения", "1. General provisions"),
      p(
        "Настоящая Политика конфиденциальности (далее – «Политика») регулирует обработку и защиту информации, которую Пользователь предоставляет при использовании сервиса, Telegram-бота, цифровых продуктов, материалов и связанных функций (далее – «Сервис»).",
        "This Privacy Policy (the “Policy”) governs the processing and protection of information the User provides when using the service, the Telegram bot, digital products, materials and related features (the “Service”)."
      ),
      p(
        "Используя Сервис, Пользователь подтверждает принятие настоящей Политики. Если Пользователь не согласен с Политикой, он должен прекратить использование Сервиса.",
        "By using the Service, the User accepts this Policy. If the User does not agree with the Policy, they must stop using the Service."
      ),

      h3("2. Собираемая информация", "2. Information we collect"),
      p("Сервис может собирать следующие типы данных:", "The Service may collect the following types of data:"),
      ul(
        [
          "Идентификаторы аккаунта, включая логин, ID, никнейм и аналогичные данные.",
          "Account identifiers, including login, ID, nickname and similar data.",
        ],
        [
          "Техническая информация, включая IP-адрес, данные браузера, устройства, операционной системы и клиентского приложения.",
          "Technical information, including IP address and browser, device, operating system and client app data.",
        ],
        [
          "История взаимодействия с Сервисом, включая события запуска бота, обращения в поддержку, статусы доступа, периоды обслуживания и технические ошибки.",
          "History of interaction with the Service, including bot launch events, support requests, access statuses, service periods and technical errors.",
        ]
      ),
      p(
        "Сервис не требует от Пользователя предоставления паспортных данных, документов, фотографий или иной личной информации, за исключением минимума, необходимого для работы Сервиса.",
        "The Service does not require the User to provide passport details, documents, photos or other personal information beyond the minimum needed for the Service to work."
      ),
      p(
        "Сервис намеренно не собирает историю просмотров, содержимое трафика, сообщения или файлы, за исключением случаев, предусмотренных законом, требованиями безопасности Сервиса или технической необходимостью.",
        "The Service deliberately does not collect browsing history, traffic contents, messages or files, except where required by law, the Service's security requirements or technical necessity."
      ),

      h3("3. Использование информации", "3. How information is used"),
      p("Сервис может использовать собранную информацию только для:", "The Service may use the collected information only to:"),
      ul(
        ["Обеспечения функциональности Сервиса.", "Provide the Service's functionality."],
        ["Выдачи и учёта доступа.", "Grant and track access."],
        ["Связи с Пользователем, включая уведомления и поддержку.", "Communicate with the User, including notifications and support."],
        ["Анализа и улучшения Сервиса.", "Analyse and improve the Service."],
        ["Защиты от злоупотреблений и технических сбоев.", "Protect against abuse and technical failures."]
      ),
      p(
        "Данные не используются для таргетированной рекламы и не продаются третьим лицам в рекламных целях.",
        "Data is not used for targeted advertising and is not sold to third parties for advertising purposes."
      ),

      h3("4. Передача третьим лицам", "4. Sharing with third parties"),
      p(
        "Администрация не передаёт собранные данные третьим лицам, за исключением следующих случаев:",
        "The Administration does not share collected data with third parties except in the following cases:"
      ),
      ul(
        [
          "По требованию закона, суда, регулятора или иного компетентного органа.",
          "At the request of the law, a court, a regulator or another competent authority.",
        ],
        [
          "При необходимости для исполнения обязательств перед Пользователем, например при работе с платёжными системами, хостинг-провайдерами, Telegram или иной инфраструктурой Сервиса.",
          "When needed to fulfil obligations to the User, for example when working with payment systems, hosting providers, Telegram or other Service infrastructure.",
        ],
        ["При наличии согласия Пользователя.", "With the User's consent."]
      ),
      p(
        "Если закон, суд, регулятор или иной компетентный орган потребует от Администрации ограничить доступ, изменить правила Сервиса или раскрыть минимально необходимую информацию, Администрация вправе сделать это без отдельного согласования с Пользователем.",
        "If the law, a court, a regulator or another competent authority requires the Administration to restrict access, change the Service's rules or disclose the minimum necessary information, the Administration may do so without separate agreement with the User."
      ),

      h3("5. Хранение и защита данных", "5. Data storage and protection"),
      p(
        "Данные хранятся в течение срока, необходимого для достижения целей обработки, работы Сервиса, исполнения обязательств и соблюдения применимого законодательства.",
        "Data is stored for as long as needed to achieve the purposes of processing, operate the Service, fulfil obligations and comply with applicable law."
      ),
      p(
        "Администрация принимает разумные организационные и технические меры для защиты данных, но не гарантирует абсолютную безопасность информации, передаваемой через интернет.",
        "The Administration takes reasonable organisational and technical measures to protect data but does not guarantee the absolute security of information transmitted over the internet."
      ),
      p(
        "Пользователь несёт ответственность за риски, связанные с передачей своих данных, конфигураций, токенов, ссылок доступа или иной информации третьим лицам.",
        "The User is responsible for the risks of sharing their data, configurations, tokens, access links or other information with third parties."
      ),

      h3("6. Отказ от ответственности", "6. Disclaimer"),
      p(
        "Пользователь понимает и соглашается, что передача информации через интернет всегда сопряжена с рисками.",
        "The User understands and agrees that transmitting information over the internet always carries risks."
      ),
      p(
        "Администрация не несёт ответственности за потерю, кражу или раскрытие данных, если это произошло по вине третьих лиц, провайдеров инфраструктуры, Пользователя или обстоятельств, находящихся вне контроля Администрации.",
        "The Administration is not liable for the loss, theft or disclosure of data caused by third parties, infrastructure providers, the User or circumstances beyond the Administration's control."
      ),

      h3("7. Изменения Политики", "7. Changes to the Policy"),
      p(
        "Администрация вправе изменять настоящую Политику без предварительного уведомления.",
        "The Administration may change this Policy without prior notice."
      ),
      p(
        "Продолжение использования Сервиса после внесения изменений означает принятие Пользователем обновлённой Политики.",
        "Continuing to use the Service after changes are made means the User accepts the updated Policy."
      ),
    ],
  },
  {
    id: "terms",
    title: { ru: "Пользовательское соглашение", en: "User agreement" },
    blocks: [
      h3("1. Общие положения", "1. General provisions"),
      p(
        "Настоящее Пользовательское соглашение (далее – «Соглашение») регулирует использование онлайн-сервиса, Telegram-бота, цифровых продуктов, материалов, доступа к конфигурациям и связанных услуг (далее – «Сервис»), предоставляемых Администрацией.",
        "This User Agreement (the “Agreement”) governs the use of the online service, Telegram bot, digital products, materials, access to configurations and related services (the “Service”) provided by the Administration."
      ),
      p(
        "Используя Сервис, включая запуск бота, ввод команды /start, регистрацию, оплату услуг или получение доступа к материалам, Пользователь подтверждает, что полностью ознакомился с настоящим Соглашением и принимает его в полном объёме.",
        "By using the Service, including launching the bot, sending the /start command, registering, paying for services or getting access to materials, the User confirms that they have read this Agreement in full and accept it in its entirety."
      ),
      p(
        "Если Пользователь не согласен с настоящим Соглашением, он должен прекратить использование Сервиса.",
        "If the User does not agree with this Agreement, they must stop using the Service."
      ),

      h3("2. Характер услуг и цифровых продуктов", "2. Nature of services and digital products"),
      p(
        "Сервис предоставляет нематериальные цифровые товары и услуги, включая, но не ограничиваясь, информационные материалы, образовательные программы, консультации, цифровые продукты, технический доступ, конфигурации и сервисную поддержку.",
        "The Service provides intangible digital goods and services, including but not limited to informational materials, educational programmes, consultations, digital products, technical access, configurations and service support."
      ),
      p("Материалы, предоставляемые через Сервис, могут включать:", "Materials provided through the Service may include:"),
      ul(
        ["Информацию из открытых источников.", "Information from open sources."],
        ["Оригинальные материалы Администрации и/или третьих лиц.", "Original materials of the Administration and/or third parties."],
        [
          "Аналитические обзоры, подборки, рекомендации и структурированные данные.",
          "Analytical reviews, selections, recommendations and structured data.",
        ],
        [
          "Технические инструкции, настройки, конфигурации и справочные материалы.",
          "Technical guides, settings, configurations and reference materials.",
        ]
      ),
      p(
        "Пользователь понимает и соглашается, что ценность цифровых товаров и услуг Сервиса заключается в систематизации, анализе, подаче, помощи, поддержке, доступе, настройке и обновлениях, а не в эксклюзивности отдельных элементов информации.",
        "The User understands and agrees that the value of the Service's digital goods and services lies in systematisation, analysis, presentation, help, support, access, setup and updates, not in the exclusivity of individual pieces of information."
      ),
      p(
        "Сервис не утверждает и не гарантирует, что отдельные элементы материалов являются уникальными, эксклюзивными или недоступными за пределами Сервиса.",
        "The Service does not claim or guarantee that individual elements of the materials are unique, exclusive or unavailable outside the Service."
      ),

      h3("3. Отказ от гарантий и ответственности", "3. Disclaimer of warranties and liability"),
      p("Сервис предоставляется на условиях «КАК ЕСТЬ».", "The Service is provided “AS IS”."),
      p("Администрация не гарантирует:", "The Administration does not guarantee:"),
      ul(
        ["Что Сервис будет соответствовать ожиданиям Пользователя.", "That the Service will meet the User's expectations."],
        [
          "Достижения каких-либо финансовых, коммерческих, профессиональных, технических или иных результатов.",
          "Any financial, commercial, professional, technical or other results.",
        ],
        ["Бесперебойной или безошибочной работы Сервиса.", "Uninterrupted or error-free operation of the Service."],
        [
          "Постоянной доступности, фиксированной скорости или совместимости с каждым провайдером, устройством или клиентским приложением.",
          "Constant availability, fixed speed or compatibility with every provider, device or client app.",
        ]
      ),
      p("Администрация не несёт ответственности за:", "The Administration is not liable for:"),
      ul(
        ["Любые прямые или косвенные убытки, включая упущенную выгоду.", "Any direct or indirect losses, including lost profits."],
        [
          "Последствия применения Пользователем полученных материалов, рекомендаций, конфигураций или услуг.",
          "The consequences of the User applying the materials, recommendations, configurations or services received.",
        ],
        ["Действия или бездействие третьих лиц.", "Actions or inaction of third parties."],
        ["Временные технические сбои и ограничения доступа.", "Temporary technical failures and access restrictions."],
        [
          "Действия и политики Telegram, платёжных систем, хостинг-провайдеров, GitHub, клиентских приложений и других сторонних сервисов.",
          "The actions and policies of Telegram, payment systems, hosting providers, GitHub, client apps and other third-party services.",
        ]
      ),
      p(
        "Все решения о применении материалов, рекомендаций и услуг принимаются Пользователем самостоятельно и на свой риск.",
        "All decisions to apply materials, recommendations and services are made by the User independently and at their own risk."
      ),

      h3("4. Законное использование", "4. Lawful use"),
      p(
        "Сервис не предназначен для поощрения, организации или содействия незаконной деятельности.",
        "The Service is not intended to encourage, organise or facilitate illegal activity."
      ),
      p(
        "Пользователь обязуется использовать Сервис только в соответствии с применимым законодательством и правилами третьих лиц.",
        "The User agrees to use the Service only in accordance with applicable law and the rules of third parties."
      ),
      p(
        "Пользователь несёт полную ответственность за законность использования материалов и услуг Сервиса.",
        "The User bears full responsibility for the lawful use of the Service's materials and services."
      ),
      p("Пользователь не вправе:", "The User may not:"),
      ul(
        [
          "Использовать Сервис для спама, фишинга, мошенничества, DDoS-атак, подбора паролей, несанкционированного сканирования или распространения вредоносного ПО.",
          "Use the Service for spam, phishing, fraud, DDoS attacks, password brute-forcing, unauthorised scanning or spreading malware.",
        ],
        [
          "Передавать доступ третьим лицам, перепродавать его или публиковать конфигурации без разрешения Администрации.",
          "Share access with third parties, resell it or publish configurations without the Administration's permission.",
        ],
        [
          "Использовать Сервис для распространения материалов, оборот которых ограничен или запрещён.",
          "Use the Service to distribute materials whose circulation is restricted or prohibited.",
        ],
        [
          "Выдавать себя за Администрацию, обещать условия от имени Сервиса или принимать платежи от других пользователей без отдельного согласования.",
          "Impersonate the Administration, promise terms on behalf of the Service or accept payments from other users without separate agreement.",
        ]
      ),

      h3("5. Интеллектуальная собственность", "5. Intellectual property"),
      p(
        "Все материалы, размещённые в Сервисе, защищены законодательством об интеллектуальной собственности.",
        "All materials published in the Service are protected by intellectual property law."
      ),
      p(
        "Пользователь не вправе копировать, распространять, перепродавать, передавать третьим лицам или иным образом использовать материалы Сервиса без разрешения правообладателя.",
        "The User may not copy, distribute, resell, share with third parties or otherwise use the Service's materials without the right holder's permission."
      ),
      p(
        "Нарушение прав интеллектуальной собственности может повлечь ограничение доступа к Сервису без компенсации.",
        "Infringing intellectual property rights may lead to restricted access to the Service without compensation."
      ),

      h3("6. Ограничение доступа", "6. Access restrictions"),
      p(
        "Администрация вправе приостановить или ограничить доступ Пользователя к Сервису в следующих случаях:",
        "The Administration may suspend or restrict the User's access to the Service in the following cases:"
      ),
      ul(
        ["Нарушение настоящего Соглашения.", "Violation of this Agreement."],
        ["Обнаружение злоупотреблений.", "Detection of abuse."],
        [
          "Угроза безопасности, стабильности или справедливому доступу к Сервису.",
          "A threat to the security, stability or fair access to the Service.",
        ],
        ["Требования закона, регуляторов или платёжных провайдеров.", "Requirements of the law, regulators or payment providers."],
        ["Техническая необходимость.", "Technical necessity."]
      ),
      p(
        "Ограничение доступа не освобождает Пользователя от обязательств, возникших ранее.",
        "Restricting access does not release the User from obligations that arose earlier."
      ),
      p(
        "Администрация оставляет за собой право отказать в обслуживании Пользователям, чьи действия могут создать повышенные риски для Сервиса, платёжных провайдеров или третьих лиц.",
        "The Administration reserves the right to refuse service to Users whose actions may create increased risks for the Service, payment providers or third parties."
      ),

      h3("7. Оплата и возвраты", "7. Payment and refunds"),
      p(
        "Оплата услуг и цифровых товаров производится на условиях, указанных в Сервисе перед оплатой.",
        "Services and digital goods are paid for on the terms shown in the Service before payment."
      ),
      p(
        "В связи с нематериальным характером цифровых товаров и услуг возврат средств после предоставления доступа не производится, за исключением случаев, перечисленных ниже.",
        "Because digital goods and services are intangible, payments are not refunded once access has been provided, except in the cases listed below."
      ),
      p("Возврат возможен только если:", "A refund is possible only if:"),
      ul(
        [
          "Услуга не была предоставлена по технической вине Сервиса.",
          "The service was not provided due to a technical fault on the Service's side.",
        ],
        ["Доступ к цифровому продукту фактически не был предоставлен.", "Access to the digital product was not actually provided."]
      ),
      p(
        "Для рассмотрения вопроса о возврате Пользователь должен обратиться в поддержку в течение 24 часов после оплаты.",
        "To request a refund, the User must contact support within 24 hours of payment."
      ),
      p("Решения о возврате принимаются Администрацией индивидуально.", "Refund decisions are made by the Administration on a case-by-case basis."),
      p(
        "Пользователь подтверждает, что не будет инициировать возврат платежа (чарджбэк) через платёжные системы без предварительного обращения в поддержку Сервиса.",
        "The User confirms that they will not initiate a payment reversal (chargeback) through payment systems without first contacting the Service's support."
      ),

      h3("8. Конфиденциальность", "8. Privacy"),
      p(
        "Администрация может собирать минимальные технические данные, необходимые для работы Сервиса.",
        "The Administration may collect the minimum technical data needed for the Service to work."
      ),
      p(
        "Администрация принимает разумные меры для защиты данных, но не гарантирует абсолютную безопасность передаваемой информации.",
        "The Administration takes reasonable measures to protect data but does not guarantee the absolute security of transmitted information."
      ),
      p(
        "Подробные правила обработки данных описаны в разделе «Политика конфиденциальности» на этой странице.",
        "Detailed data processing rules are set out in the “Privacy policy” section on this page."
      ),

      h3("9. Изменение условий", "9. Changes to the terms"),
      p("Администрация вправе изменять настоящее Соглашение.", "The Administration may change this Agreement."),
      p(
        "Актуальная версия Соглашения публикуется в Сервисе или на странице документации.",
        "The current version of the Agreement is published in the Service or on the documentation page."
      ),
      p(
        "Продолжение использования Сервиса означает принятие Пользователем обновлённых условий.",
        "Continuing to use the Service means the User accepts the updated terms."
      ),

      h3("10. Контактная информация", "10. Contact information"),
      p(
        "По всем вопросам Пользователь может обратиться в поддержку через форму внутри бота.",
        "For any questions, the User can contact support via the form inside the bot."
      ),
      p(
        "Используя Сервис, в том числе запуская бота и/или вводя команду /start, Пользователь подтверждает, что ознакомился с настоящим Соглашением и принимает его условия в полном объёме.",
        "By using the Service, including launching the bot and/or sending the /start command, the User confirms that they have read this Agreement and accept its terms in full."
      ),
    ],
  },
  {
    id: "requisites",
    title: { ru: "Реквизиты и контакты", en: "Company details and contacts" },
    blocks: [
      {
        type: "details",
        rows: [
          {
            label: { ru: "Компания", en: "Company" },
            value: { ru: "ОсОО «Пэй Флоу»", en: "Pay Flow LLC (ОсОО «Пэй Флоу»)" },
          },
          {
            label: { ru: "Адрес", en: "Address" },
            value: {
              ru: "Кыргызская Республика, г. Бишкек, Первомайский район, пер. Клубный, д. 18, кв. 5",
              en: "Apt. 5, 18 Klubny Lane, Pervomaisky District, Bishkek, Kyrgyz Republic",
            },
          },
          { label: { ru: "ОГРН", en: "OGRN (registration no.)" }, value: same("326149-3301-ООО") },
          { label: { ru: "ИНН", en: "INN (taxpayer ID)" }, value: same("9909762323") },
          { label: { ru: "Эл. почта", en: "Email" }, value: same(CONTACTS.email), href: `mailto:${CONTACTS.email}` },
          {
            label: { ru: "Telegram", en: "Telegram" },
            value: { ru: "Написать в поддержку", en: "Message support" },
            href: CONTACTS.telegram,
          },
        ],
      },
    ],
  },
]
