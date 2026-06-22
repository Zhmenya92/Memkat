# МемКат

> Відеоредактор для блогерів із вбудованою бібліотекою мемів.  
> Зняв → додав мем → виклав. Нуль перемикань між застосунками.

**Платформа:** веб, mobile-first  
**Аудиторія:** контент-мейкери TikTok / YouTube Shorts / Reels, 16–30  
**Інфраструктура:** $0 (WebCodecs + IndexedDB + безкоштовний хостинг)

---

## Стан проекту

| Фаза | Статус |
|---|---|
| UX-ресерч | ✅ Завершено |
| Дизайн (персони → wireframes → UI) | 🔄 В процесі |
| Розробка MVP | ⏳ Не розпочато |

**Що зроблено в ресерчі:**
- Конкурентний аналіз 9 продуктів (CapCut, Canva, Telegram, Kapwing та ін.)
- UX benchmark 5 продуктів — 8 критеріїв, включно з emoji search і cold start
- Виявлено Gap G1: жоден із 9 конкурентів не вбудував мем-бібліотеку в редактор
- 3 персони (Аня 19, Денис 24, Ліза 16) з підтвердженими болями та джобами
- JTBD-матриця: Main job + 5 related + 2 emotional, пріоритизація для MVP
- Аудит 9 тверджень MVP — що підтверджено, що гіпотеза, що вигадано
- User flows: Main flow + 5 related jobs (R1–R5), аналіз 19 дефектів у 4 категоріях
- IA / sitemap: екрани, компоненти, навігація, contextual flows, coverage matrix

---

## Research live

**[research-wheat-seven.vercel.app](https://research-wheat-seven.vercel.app)** — інтерактивний HTML-звіт (mobile-friendly, sidebar + tab navigation)

Розділи: Конкуренти · Бенчмарк · Патерни · Висновки · Скріни · Персони · JTBD · Аудит тверджень · User Flows · IA / Sitemap

---

## Структура репо

| Папка | Що тут |
|---|---|
| [`research/`](research/) | Ресерч, інсайти, джерела — MD + HTML |
| [`research/screens/`](research/screens/) | Скріншоти конкурентів і референсів |
| [`wireframes/`](wireframes/) | Вайрфрейми екранів (lo-fi) |
| [`concept/`](concept/) | Концепт-арти, візуальний напрямок |
| [`tokens/`](tokens/) | Дизайн-токени: колір, типографіка, відступи |
| [`components/`](components/) | Компоненти UI |
| [`design-system/`](design-system/) | Дизайн-система в зібраному вигляді |
| [`handoff/`](handoff/) | Матеріали для передачі в розробку |

---

## MVP — що входить у v1

- Імпорт відео з будь-якого пристрою
- Таймлайн: обрізка, розрізання, зміна порядку кліпів
- Накладання мема / стікера з бібліотеки (Giphy, Tenor)
- Додавання звуку (CC0 — Pixabay, Mixkit)
- Текст / субтитри вручну
- Експорт 9:16 через WebCodecs

**НЕ в v1:** кейфрейми, кольорокорекція, AI-субтитри, колаборація, акаунти.

---

## Технологія (MVP)

- **Прев'ю:** Canvas/WebGL + Web Audio (клієнт, без сервера)
- **Експорт:** WebCodecs (апаратне кодування на пристрої)
- **Сховище:** IndexedDB (локально, офлайн)
- **Контент:** Giphy API, Tenor API, CC0-звуки
- **Хостинг:** Vercel (зараз — ресерч; пізніше — продукт)

---

## Документи

- [CLAUDE.md](CLAUDE.md) — повний бриф продукту, технічні рішення, принципи
- [research/research.md](research/research.md) — ресерч і конкурентний аналіз
- [research/personas.md](research/personas.md) — персони Аня, Денис, Ліза
- [research/jtbd.md](research/jtbd.md) — JTBD-матриця і висновки
- [research/flows.md](research/flows.md) — user flows (Main + R1–R5), аналіз дефектів
- [research/sitemap.md](research/sitemap.md) — IA: екрани, компоненти, навігація
