# TeamDominant — сайт

Vite + React 19 + TypeScript + Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com).
Анимированные компоненты — из каталога [21st.dev](https://21st.dev/community/components):
Magic UI (`globe`, `number-ticker`, `blur-fade`, `marquee`) и motion-primitives (`text-effect`, `animated-group`, `infinite-slider`).

### Компоненты с 21st.dev

Реестр `@21st` настроен в `components.json`, ключ берётся из `.env` (`API_TOKEN=…`, см. `.env.example`):

```bash
npx shadcn@latest add @21st/<автор>/<компонент>   # например @21st/efferd/testimonials-columns-1
```

Бесплатный тариф 21st.dev — 2 загрузки в сутки, зависимости компонента тоже считаются.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + сборка в dist/
npm run lint
```

## Структура

- `index.html`, `faq.html`, `legal.html` — точки входа (multi-page, старые URL сохранены)
- `src/content/` — весь текст сайта на RU/EN, цены, контакты (`CONTACTS`)
- `src/content/testimonials.ts` — отзывы. Заглушки (`placeholder: true`) видны только в `npm run dev`;
  на проде блок скрыт, пока не добавлен хотя бы один настоящий отзыв
- `src/sections/` — секции главной страницы
- `src/components/ui/` — shadcn и компоненты из 21st.dev
- `src/assets/illustrations/` — иллюстрации: положи файл с именем слота (`hero.svg`, `step-1.png`, …),
  и он заменит Notion-заглушку. Список слотов — в README этой папки.

Цвет бренда — одна переменная `--brand` в `src/index.css`.

## Деплой

Workflow `.github/workflows/deploy.yml` собирает сайт и публикует `dist/` на GitHub Pages при пуше в `main`.
В настройках репозитория: **Settings → Pages → Source: GitHub Actions**. Домен берётся из `public/CNAME`.
