# Wireframes — МемКат

*28.06.2026 · База: _screens.md · _conventions.md · flows.md · sitemap.md*

---

## Статус файлів

| # | Файл | Статус | Примітка |
|---|---|---|---|
| 1 | `listings.html` | ✓ готово | base · happy path |
| 2 | `listings-empty.html` | ✓ готово | history = 0 · sole CTA FAB |
| 3 | `listings-error.html` | ✓ готово | blob зник з IndexedDB |
| 4 | `import.html` | ✓ готово | select-video screen |
| 5 | `import-loading.html` | ✓ готово | завантаження + валідація |
| 6 | `import-error.html` | ✓ готово | 3 типи помилок |
| 7 | `editor.html` | ✓ готово | base · є відео + мем |
| 8 | `editor-empty.html` | ✓ готово | порожній таймлайн |
| 9 | `editor-error.html` | ✓ готово | autosave помилка |
| 10 | `editor-loading.html` | ✓ готово | GIF завантажується з CDN |
| 11 | `picker.html` | ✓ готово | Trending tab · cold start |
| 12 | `picker-search-empty.html` | ✓ готово | Пошук до введення запиту |
| 13 | `picker-error.html` | ✓ готово | API помилка |
| 14 | `picker-loading.html` | ✓ готово | GIF CDN loading state |
| 15 | `export.html` | ✓ готово | base · вибір формату |
| 16 | `export-loading.html` | ✓ готово | рендер WebCodecs |
| 17 | `export-error.html` | ✓ готово | помилка рендеру |
| 18 | `share.html` | ✓ готово | єдиний стан = success |

**Разом: 18 файлів** (14 з _conventions.md + picker-loading, export-loading, export-error, share що додані пізніше)

---

## Прототипи решти флоу (R1–R5) · 28.06.2026

Головний flow (18 файлів вище) готовий. Нижче — 12 нових екранів, що добудовують клікабельні прототипи флоу R1–R5 (раніше «виключені» зі скоупу Main у `_screens.md`). Зроблено 5 паралельними агентами, по одному на флоу; зведення консистентності — `_audit.md` (раунд 3).

| # | Файл | Флоу | Стан | Точка входу прото |
|---|---|---|---|---|
| 19 | `picker-search-loading.html` | R1 | ⏳ запит Giphy/Tenor | — |
| 20 | `picker-search-results.html` | R1 | base · список GIF | — |
| 21 | `picker-search-noresults.html` | R1 | ⬜ нічого не знайдено | — |
| 22 | `picker-search-end.html` | R1 | ⬜ більше немає | — |
| 23 | `picker-trending-loading.html` | R2 | ⏳ скелетон Trending | ★ старт R2 |
| 24 | `picker-recents.html` | R2/R4 | base · Нещодавні | ★ старт R4 |
| 25 | `picker-cdn-error.html` | R3 | 🔴 CDN вибраного GIF | — |
| 26 | `editor-overlay-selected.html` | R3 | base · оверлей вибраний | — |
| 27 | `picker-recents-empty.html` | R4 | ⬜ Нещодавні порожні | — |
| 28 | `export-square.html` | R5 | статичний знімок 1:1 · поза клік-шляхом (reframe in-place в export.html) | — |
| 29 | `export-fallback.html` | R5 | ⏳ резервний рендер | — |
| 30 | `export-unsupported.html` | R5 | 💀 браузер без WebCodecs | — |
| 31 | `editor-no-meme.html` | R3 | base · відео є, мему ще немає | ★ старт R3 |

**Разом: 31 файл.** Точки входу прототипів (research.html §19): Main → `listings.html` · R1 → `picker-search-empty.html` · R2 → `picker-trending-loading.html` · R3 → `editor-no-meme.html` · R4 → `picker-recents.html` · R5 → `export.html`.

**editor-no-meme.html** (доданий після аудиту, 28.06.2026): найпорожніший функціональний вхід для R3 — копія `editor.html` без мем-оверлею (canvas: підказка «＋ мем сюди»; трек «Мем» порожній, dashed «ще немає мему»), [Додати мем] активний. Проєкт може мати кілька відео й мемів, тож додавання до проєкту з контентом — теж норм; цей екран лише дає чистіший старт демонстрації.

**Перемикач станів у прото (research.html §19):** кожна секція R1–R5 має ряд кнопок «Стани / гілки» — завантажують будь-який стан/гілку (зокрема error/dead-end екрани, що поза happy-клік-шляхом) у той самий вʼюпорт. JS-хелпер `protoState()`.

### Виправлені розриви ланцюга (щоб прототипи клікались наскрізь)
| Файл | Було | Стало |
|---|---|---|
| picker · picker-loading · picker-error · picker-search-empty | вкладка [Нещодавні] мертва | → `picker-recents.html` |
| picker-search-empty | підказки/поле → `picker.html` | → `picker-search-loading.html` (вхід R1) |
| editor-loading | success → `editor.html` | → `editor-overlay-selected.html` (замикає R3) |
| picker-loading | вкладка [Пошук] мертва | → `picker-search-empty.html` |

### Специфікація нових екранів (зони · вихідні переходи)
- **picker-search-loading** — sheet: tabs · поле з запитом «😂» · spinner «Шукаю в Giphy/Tenor…». → поле→search-empty · Trending→picker · scrim→editor.
- **picker-search-results** — sheet: поле «😂» · grid 2-кол GIF. → tap GIF→editor-loading · поле→search-empty.
- **picker-search-noresults** — sheet: довгий запит · «Нічого не знайдено» + CTA «Змінити запит»→search-empty.
- **picker-search-end** — як results + рядок «Більше результатів немає» + «Змінити запит»→search-empty.
- **picker-trending-loading** — sheet: tab Trending active · skeleton-grid. → Trending→picker (loaded) · tabs · scrim→editor. Атрибуція GIPHY свідомо прихована (лише скелетони).
- **picker-recents** — sheet: tab Нещодавні active · grid 2-кол · footer «Powered by GIPHY». → tap GIF→editor-loading · Trending→picker · Пошук→search-empty. Спільний для R2 і R4.
- **picker-cdn-error** — sheet: прев'ю впалого GIF + «Не вдалось завантажити GIF» + «Повторити»→editor-loading · «Вибрати інший»→picker. Відмінність від picker-error: CDN конкретного GIF (після вибору), не API списку (до вибору).
- **editor-overlay-selected** — редактор (header/toolbar/timeline як editor.html); canvas: оверлей з resize-handles + «Замінити»→picker · «Видалити»→editor.
- **picker-recents-empty** — sheet: empty-state «Тут зʼявляться нещодавні меми» + «Пошук»→search-empty · «Подивитись тренди»→picker · scrim→editor.
- **export-square** — статичний знімок формату 1:1. Поза клік-шляхом прото: `export.html` робить reframe 9:16↔1:1 in-place через `setFmt()`, тож окремий екран у флоу не потрібен. Лишається як довідковий знімок (галерея §20).
- **export-fallback** — резервний рендер: progress + нотатка «може зайняти довше» · OK→share · «Скасувати»→export.
- **export-unsupported** — 💀 «Цей браузер не може зберегти відео» · «Повернутись до редактора»→editor.

---

## Специфікація по файлах

### listings-empty.html
**Стан:** `history = 0` — жодного проекту в IndexedDB  
**Job:** Main (тригер старту петлі)  
**Зони:**
- Header: МемКат + [Новий проект] (640px+)
- Main: empty state — ілюстрація-заглушка + h2 «Поки немає проектів» + p «Створіть перший — це займе менше хвилини» + primary CTA «Новий проект»
- FAB [+ Новий проект] — єдина точка дії, візуально домінує

**Ключова різниця від base:** немає grid, sole CTA, zero affordance крім FAB

---

### listings-error.html
**Стан:** blob зник з IndexedDB (кеш очищено або перенесено на інший пристрій)  
**Job:** E1 (відчути контроль — є вихід), Main (відновити петлю)  
**Зони:**
- Header: стандартний
- Main: звичайний grid з картками АЛЕ кожна картка показує error state — «Відеофайл не знайдено» + CTA «Імпортувати знову» (замість thumbnail)
- FAB залишається для нового проекту

**Ключова різниця від base:** thumbnail replaced by error block on each card

---

### import.html
**Стан:** base — юзер потрапляє після tap [+ Новий проект]  
**Job:** Main («зняв» — перший крок петлі)  
**Зони:**
- Header: [←] + «Новий проект»
- Main: велика зона вибору файлу (dashed border) + іконка-заглушка + «Оберіть відео» h2 + «MP4, MOV, WebM · до 500 МБ» підказка + primary CTA «Вибрати відео»
- Note: системний пікер відкривається поверх — не наш UI

**Ключова відмінність:** жодного контенту крім file-picker zone; весь фокус на одній дії

---

### import-loading.html
**Стан:** файл обраний, йде завантаження + валідація  
**Job:** Main  
**Зони:**
- Header: [←] + «Завантаження...»
- Main: назва файлу + розмір + progress bar (50%) + «Перевірка відео...» підпис
- Кнопка «Скасувати» (secondary)

---

### import-error.html
**Стан:** помилка після вибору файлу — 3 типи  
**Job:** Main (blocked)  
**Wireframe показує:** «Формат не підтримується» (найчастіший тип)  
**Зони:**
- Header: [←] + «Помилка»
- Main: error block з іконкою + «Формат не підтримується» h2 + «Спробуйте MP4 або MOV» + список підтримуваних форматів
- Primary CTA: «Спробувати інший файл»
- Secondary: «Скасувати»
- Note в wireframe: інші типи — «Файл завеликий (>500 МБ)», «Файл пошкоджено»

---

### editor.html
**Стан:** base — є відео на таймлайні + мем-оверлей  
**Job:** Main · R3 · E1 · E2  
**Зони:**
- Header: [←] + «Мій проект · Збережено ✓» + [Експорт]
- Canvas: 16:9 video placeholder + overlay-заглушка (GIF поверх)
- Toolbar: [Додати мем] [+ Кліп]
- Timeline: горизонтальна смуга — video track + overlay track

**Breakpoints:** 390 / 640 / 1024px — layout розширюється, canvas більший

---

### editor-empty.html
**Стан:** порожній таймлайн — жодного кліпу  
**Job:** Main (blocked at step 1)  
**Відмінності від base:**
- Header: «Новий проект · —» (без статусу збереження)
- Canvas: порожній placeholder «Додайте відео щоб розпочати»
- Toolbar: [Додати мем — disabled] [+ Кліп]
- Timeline: порожня, пунктир

---

### editor-error.html
**Стан:** autosave помилка  
**Job:** E1 (тривога — «чи збережено?»)  
**Відмінності від base:**
- Header: «Мій проект · ⚠ Помилка» (замість «Збережено ✓»)
- Inline banner під header: «Не вдалось зберегти · Спробувати ще»
- Решта як base

---

### editor-loading.html
**Стан:** GIF завантажується з CDN після вибору в пікері  
**Job:** R3  
**Відмінності від base:**
- Canvas: spinner overlay + «Завантаження GIF...»
- Timeline: placeholder на overlay track (loading state)
- Пікер закритий (повернулись до редактора)

---

### picker.html
**Стан:** base — Trending tab · cold start (history = 0)  
**Job:** R2 · R3 · R4  
**Структура:** editor behind + bottom sheet overlay  
**Bottom sheet:**
- Handle
- Tabs: [Trending ●] [Нещодавні] [Пошук]
- GIF grid (2 col, 6 items — grey placeholders 1:1)
- «Powered by GIPHY» attribution footer

---

### picker-search-empty.html
**Стан:** Пошук tab · до введення запиту  
**Job:** R1  
**Bottom sheet:**
- Handle
- Tabs: [Trending] [Нещодавні] [Пошук ●]
- Search input (empty, focused cursor)
- Suggestion pills: «😂 funny» «wow» «omg» «fail» «relatable»
- Порожня зона нижче

---

### picker-error.html
**Стан:** API Giphy/Tenor недоступне  
**Job:** R1 · R2 (blocked)  
**Bottom sheet:**
- Handle + tabs
- Error state: «🔴 Не вдалось завантажити» + retry CTA + «Перейти до пошуку»

---

### picker-loading.html
**Стан:** GIF вибрано — CDN завантажує файл  
**Job:** R3  
**Показує:** редактор + пікер щойно закрився + на canvas спінер де буде GIF  
*(Альтернатива: bottom sheet з loading overlay на grid)*  
Вибір: показуємо редактор з spinner на canvas (пікер вже закритий)

---

### export.html
**Стан:** base — вибір формату перед рендером  
**Job:** Main · R5 · E2  
**Зони:**
- Header: [←] + «Експорт»
- Format picker: [9:16 ●] [1:1] (toggle pills)
- Preview: пропорційний placeholder (9:16 за замовч.) з «Preview кадрування»
- Label: «9:16 — TikTok / Reels / Shorts»
- Primary CTA: «Зберегти відео»

---

### export-loading.html
**Стан:** рендер WebCodecs в процесі  
**Job:** Main · R5  
**Зони:**
- Header: [←] + «Рендер...»
- Progress bar (67%) + «Рендер відео · 0:12» підпис
- CTA: «Скасувати» (secondary, destructive style)

---

### export-error.html
**Стан:** помилка рендеру  
**Job:** Main · R5 (blocked)  
**Зони:**
- Header: [←] + «Помилка рендеру»
- Error block: «Не вдалось зберегти відео» + технічна підказка
- Primary CTA: «Спробувати ще»
- Secondary: «Повернутись до редактора»

---

### share.html
**Стан:** success — post-render bottom sheet  
**Job:** Main (завершення) · R5 · E2  
**Структура:** export screen behind + bottom sheet  
**Bottom sheet:**
- ✅ велика іконка
- «Відео готове!» h2
- «зняв → мем → виклав ✓» підпис (mono)
- Primary CTA: «Поділитись» (navigator.share)
- Secondary row: «До списку проектів» · «Новий проект»

---

## Конвенції нейминг

Всі файли дотримуються rule 05 з _conventions.md:
- без суфікса = happy path / success state
- `-empty` = порожній стан
- `-error` = помилка
- `-loading` = процес в дії

Picker — bottom sheet компонент: показується поверх редактора (editor behind завжди видимий).  
Share — bottom sheet компонент: показується поверх export screen.
