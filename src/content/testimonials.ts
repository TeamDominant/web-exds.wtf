import type { Text } from "@/lib/i18n"

export type Testimonial = {
  /** Shown in the card; a number in it (e.g. "Клиент №7") becomes the avatar badge. */
  name: Text
  /** e.g. "@username" or "Telegram" */
  handle?: string
  text: Text
  /** Link to the original review (Telegram post, etc.). Makes the card clickable. */
  href?: string
  /** Avatar image URL; initials are shown when missing. */
  avatar?: string
  /**
   * Placeholder entries render only in `npm run dev` so the layout can be previewed.
   * The production build skips them, and the whole section is hidden until at least one
   * real review (without this flag) is added.
   */
  placeholder?: true
}

export const TESTIMONIALS_META = {
  kicker: { ru: "Отзывы", en: "Reviews" },
  title: { ru: "Что говорят клиенты", en: "What customers say" },
  subtitle: {
    ru: "Пара слов от тех, кто уже подключился.",
    en: "A few words from people who are already connected.",
  },
  placeholderBadge: { ru: "заглушка", en: "placeholder" },
  more: { ru: "Читать полностью", en: "Read more" },
  less: { ru: "Свернуть", en: "Show less" },
} satisfies Record<string, Text>

const client = (n: number): Text => ({ ru: `Клиент №${n}`, en: `Client #${n}` })

// Real customer reviews, verbatim apart from masked swear words.
// With 6+ reviews the section splits them into two rows by position (even / odd): the long reviews
// sit at even positions so they share one row and the short ones make a compact second row.
export const TESTIMONIALS: Testimonial[] = [
  {
    name: client(17),
    text: {
      ru: "Использую уже 2 года, все работает быстро и шустро, а самое главное, что если бывают неполадки, как с другими проектами, тут фиксят и сразу пишут о проблеме, а не молчат и просто извиняются, так же важным критерим было, чтобы работало в обход игр",
      en: "Been using it for 2 years, everything is fast and snappy. Most importantly, when something breaks, like with other projects, they fix it and tell you about the problem right away instead of going silent and just apologising. Another key thing for me was that games bypass the tunnel",
    },
  },
  {
    name: client(7),
    text: {
      ru: "Работает стабильно, проблемы дай бог раз в пол года",
      en: "Works reliably, problems maybe once every six months",
    },
  },
  {
    name: client(28),
    text: {
      ru: "Из сервисов которыми пользовался, это наверное лучший. Поддержка проекта видна и очень хорошо, очень быстрые серверы, в которых не гуляет миллиард трафика из-за которого бывают всякие приколы. Адекватные цены за хороший сервис, в котором помимо этого ещё и много плюшек если тупо посоветуешь друзьям пользоваться удобством. Поддержка всегда на связи, что порадовало, так же быстро решается возникшая проблема. Пользуюсь долго, проблем у самого никогда не возникало, в наше время найти что-то подобное, включить и не е*ать себе мозг с настройкой или чем-то подобным самое то. Разработчикам кидаю лютейший салам, всё сделали на высоком уровне. ✋👨🤚",
      en: "Of all the services I've used, this is probably the best. You can see the project is actively maintained, and very well. Very fast servers without a billion users' worth of traffic causing all sorts of glitches. Fair prices for a good service, plus lots of perks if you simply recommend it to friends. Support is always in touch, which I liked, and problems get fixed fast. I've been using it for a long time and never had any issues myself. These days finding something you just switch on without f*cking around with setup is exactly what you want. Huge respect to the devs, everything is done at a high level. ✋👨🤚",
    },
  },
  {
    name: client(70),
    text: {
      ru: "Работает хорошо, поддержка быстро решает проблемы",
      en: "Works well, support solves problems quickly",
    },
  },
  {
    name: client(210),
    text: {
      ru: "Ах*енный сервис, работает отлично, пинг наименьший, с большинством других обычно часто бывают проблемы, а с этим нет",
      en: "F*cking great service, works perfectly, lowest ping. Most others usually have frequent problems, this one doesn't",
    },
  },
  {
    name: client(15),
    text: {
      ru: "Хорошо работает вась",
      en: "Works great, bro",
    },
  },
  {
    name: client(114),
    text: {
      ru: "Использую уже год, х*й стоит, в контре регает, рекомендую, про х*й наверное было лишнее",
      en: "Been using for a year, d*ck's up, hits register in CS, recommend it. The d*ck part was probably too much",
    },
  },
]
