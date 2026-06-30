# Wireframes — Аудит консистентності (раунд 2)

*28.06.2026 · 21 HTML-файл · перевірка між екранами + у різних ширинах*

База: `_conventions.md` · `_wireframes.md`. Цей файл — список знахідок і статус фіксів.

---

## Корінь проблеми

Немає спільного джерела стилів. Кожен з 21 файлу **наново оголошує** `:root`-токени, скролбар і механіку bottom-sheet inline. Усі розбіжності нижче — це **дрейф копіпасти**: однакові блоки розповзлися по дрібницях. Поки немає спільного `wireframe.css` (або шаблону), дрейф повертатиметься.

---

## Що консистентно ✅

- Палітра: 10 базових токенів збігаються по значеннях у всіх 21 файлі.
- `body` фон `#0A0A0A` — скрізь.
- Скролбар-блок (5px, thumb `.14`→`.30`) — ідентичний скрізь.
- Глобальні брейкпоінти 640 / 1024 — у всіх (390 ніде не явний — коректний mobile-first base).
- Семантика bottom-sheet: picker і share = `<dialog>` + окремий `<div class="scrim">` (не `::backdrop`), handle 36×4px.
- `<progress>` правильно використаний у `import-loading`, `export-loading`.

---

## Знахідки

### 🔴 BUG-01 — Orphaned `@media 1024px` поза `</style>` *(новий, знайдено в раунді 2)*
У `share.html` (ряд. 134–138) і `picker.html` (ряд. 163–166) блок `@media (min-width:1024px)` розташований **після** закриваючого `</style>` → браузер трактує його як текст у `<head>`, правила **не застосовуються**. Десктопні відступи хедера (1024px+) не працюють. **Масштаб (перевірено grep):** 8 файлів — усі 4 picker + усі 3 export + share.
Додатково в `share.html`: мертве правило `main { max-width:640px }`, хоча `<main>` у файлі немає — прибрано.
**Статус:** ✅ виправлено в усіх 8 (перенесено `@media 1024px` всередину `</style>`). listings/import/editor орфану не мали.

### 🔴 FIX-1 — Рама bottom-sheet: share дрейфонув від picker *(твоя підказка)*
Контент legitimately різний (picker = скрол-грід, share = статичний success), але спільна «рама» розійшлась:

| Ознака рами | picker (еталон) | share (було) |
|---|---|---|
| Центрування @640+ | `left:50%; transform:translateX(-50%)` | `margin:0 auto` |
| `box-shadow` | `…rgba(0,0,0,.3)` | `…rgba(0,0,0,.4)` |
| `width:auto` в базі | є | немає |
| handle `flex-shrink:0` | є | немає |
| `max-height` | `65%`/`55%` | немає |

**Рішення:** уніфікувати механізм рами під picker (transform-центрування, shadow `.3`, `width:auto`, `flex-shrink:0`, `max-height`). Ширину share лишаємо вужчою (480px — success-картка), але виражену тим самим transform-механізмом, що й picker, а не `margin:auto`.
**Статус:** ✅ зроблено (share.html).

### 🟠 FIX-2 — Хаос ширини контенту в різних ширинах
Один «стовпчик контенту» на 640px+ має 5 значень без системи:

| Екран | max-width @640px |
|---|---|
| import.html | 560px |
| import-loading / import-error | 480px |
| export.html | 480px |
| export-loading.html | 400px |
| export-error.html | 440px |
| share (sheet) | 480px |
| picker (sheet) | 720px |

**Рішення:** ввести 1–2 токени (`--col: 480px`, `--sheet-wide: 720px`) і застосувати скрізь. Усередині export (480/400/440) — звести до одного.
**Статус:** ✅ зроблено. Додано токен `--col: 480px` у :root 6 контент-файлів (import×3, export×3), @640-колонка → `var(--col)`. import 560→480, export-loading 400→480, export-error 440→480. picker (720) уже був консистентний — не чіпав. @1024 (640px) теж уже консистентний — лишив літералом.

### 🟠 FIX-3 — Editor: 640px canvas-баг + ruler + disabled
- `canvas-video { max-height:480px }` на 640px є **тільки в editor.html**; у empty/error/loading забули → інший канвас на планшеті.
- `timeline-ruler` (мітки 0:00…0:20) — лише в base; у error/loading кліпи є, лінійки нема.
- Disabled-кнопки двома способами: editor-empty — клас `.disabled`+attr; editor-loading — колір на `.tool-btn`+attr.
- `playhead-dot` `box-shadow` є в base, нема в editor-error.
**Статус:** ✅ зроблено. canvas@640 480px додано в error+loading; лінійку часу (`timeline-ruler` + розмітку 0:00…0:20) додано в error+loading; loading disabled-кнопки переведено на клас `.disabled` (як empty); `playhead-dot` box-shadow додано в error. empty лишив без лінійки (порожні треки — контенту нема).

### 🟡 FIX-4 — Export: дрібний дрейф
- `header-title` колір: `var(--text)` в base/error, `var(--text-2)` в loading.
- ~~`.btn-secondary` вага 500 проти 600~~ — **false positive**: і export-error, і import-error мають secondary 500 (навмисний патерн: secondary легша за primary 600). Не баг.
**Статус:** ✅ зроблено. export-loading `header-title` → `var(--text)` (уніфіковано). Secondary-вагу не чіпав (не баг).

### 🟡 FIX-5 — Picker: різнобій висот по станах
- Мобільний `max-height` sheet: 65 / 68 / 55 / 65% по станах.
- `editor-behind-canvas`: 220 vs 180–200px.
- `Powered by GIPHY` footer лише в base — вирішити логіку атрибуції для search/loading.
**Статус:** ✅ числове зроблено — sheet mobile `max-height` зведено до **65%** (search-empty 68→65, error 55→65); `editor-behind-canvas` → **200/280** скрізь (picker.html 220/320→200/280, search-empty 180→200). ⏳ **Атрибуція GIPHY — на рішення дизайнера** (юридичне, per-source GIPHY vs Tenor): base має footer; loading показує GIF-грід → ймовірно теж потрібен; search-empty/error контенту не показують → ймовірно ні. Не чіпав без підтвердження джерела.

### 🟡 FIX-6 — Документ vs реалізація
- Префікс токенів: `_conventions.md` декларує `--wf-*`, усі 21 файл — голі `--`. Реалізація одностайна → **оновити док** під `--`.
- Завжди відсутні токени: `--interactive`, `--interactive-bg`. `--scrim` лише в picker/share. `--err`/`--err-bg` лише в error (ок).
- Зафіксувати окреме правило для вордмарка listings (30/22px — не підпадає під «заголовок екрана 17px»).
**Статус:** ✅ зроблено. `_conventions.md` §2: префікс `--`, прибрано невживані `--interactive`/`--interactive-bg`, додано контекстні `--scrim`/`--err`/`--err-bg`/`--col`. §7: додано рядок вордмарка + примітку.

### 🟢 FIX-7 — Семантика (дрібне)
- `listings-empty`: empty-state = `<div>` (мав `<section>`).
- `listings-error`: текст помилки в `<span>` без `role`.
**Статус:** ✅ зроблено. listings-empty `empty-state` div→`<section aria-label>`; listings-error декоративні ⚠-іконки → `aria-hidden="true"` (текст «Відеофайл не знайдено» лишається читабельним для скрін-рідера).

---

## Пріоритет

1. ✅ FIX-1 — спільна рама sheet (share↔picker).
2. ✅ BUG-01 — orphaned `</style>` виправлено у 8 файлах.
3. ✅ FIX-2 — токен `--col`, ширини зведено.
4. ✅ FIX-3 — editor (canvas/ruler/disabled/shadow).
5. ✅ FIX-4 — export header-title.
6. ✅ FIX-5 — picker висоти (числове). ⏳ атрибуція GIPHY — на рішення.
7. ✅ FIX-6 — `_conventions.md` оновлено.
8. ✅ FIX-7 — семантика listings.
9. ⏳ (Стратегічно) винести `:root` + скролбар + раму sheet у спільний блок — лишається на майбутнє.

**Відкриті рішення для дизайнера:**
- Атрибуція GIPHY/Tenor у станах picker (search-empty / loading / error).
- Чи робити стратегічний рефактор у спільний `wireframe.css` (item 9) — поки кожен файл самодостатній (зручно для Figma-embed), але дрейф повертатиметься.

---

# Раунд 3 — Аудит набору прототипів R1–R5

*28.06.2026 · 12 нових екранів (R1–R5), зроблені 5 паралельними агентами · звірка між собою та з Main flow: зони · нейминг · навігація*

## Що консистентно ✅
- `.wf-meta`-анотація + `?embed=1`-механіка — у всіх 12 (12/12).
- BUG-01 (orphan `@media 1024` поза `</style>`) — не повторено в жодному (0/12).
- Палітра: 10 базових токенів verbatim + контекстні (`--scrim`/`--err`/`--err-bg`/`--col`) лише де вжито.
- Рами переюзані: picker-сімейство = той самий sheet (handle · tabs · scrim · editor-behind 200/280); editor = той самий header/toolbar/timeline; export = колонка `--col`.
- Кнопка [←] = `history.back()` — збігається з усталеним патерном editor/export/import (агенти витримали, не вигадали свій).
- Переходи через `location.href+location.search` (зберігає embed). Жодного битого лінка — усі цілі переходів існують (перевірено).

## Незбіги знайдені та виправлені (розриви ланцюга)

| # | Незбіг | Файли | Було → Стало | Статус |
|---|---|---|---|---|
| R3-1 | Вкладка [Нещодавні] мертва (`cursor:default`) — тепер екран існує | picker · picker-loading · picker-error · picker-search-empty | заглушка → `picker-recents.html` | ✅ |
| R3-2 | R1-вхід не вів уперед: підказки/поле Пошуку → назад у Trending | picker-search-empty | `picker.html` → `picker-search-loading.html` | ✅ |
| R3-3 | Після завантаження GIF редактор не показував оверлей вибраним — R3 не замикався | editor-loading | `editor.html` → `editor-overlay-selected.html` | ✅ |
| R3-4 | Вкладка [Пошук] мертва в loading-стані пікера | picker-loading | заглушка → `picker-search-empty.html` | ✅ |

## Свідомі рішення / залишкові нюанси

| Питання | Рішення |
|---|---|
| Нейминг нових «base»-одиниць (`picker-recents`, `picker-trending-loading`) | Складені імена в межах сімейства picker — узгоджено з наявним `picker-search-*`. Суфікси `-empty`/`-loading` збережено. |
| `picker-cdn-error` у happy-path прото R3 | Не на авто-шляху (loading авто-просувається в успіх). Лишається unhappy-гілкою: досяжна прямим лінком, у flows.md задокументована. |
| Атрибуція GIPHY у `picker-trending-loading` | Свідомо прибрана (лише скелетони, без контенту). Є у `picker.html`/`picker-recents.html` де grid. Per-source юридичне — на фінальне рішення. |
| R3-прото стартує з `editor.html` (спільний з Main) | Свідомо: R3 = «не виходячи з монтажу» → вхід Редактор. Після фіксу R3-3 редактор→overlay-selected обслуговує і Main, і R3. |

## Глибокий аудит проходимості (граф усіх 30 екранів)

Побудовано повний навігаційний граф (вихідні `location.href` кожного файлу). Симуляція проходу кожного флоу від точки входу до success.

### Критичні розриви проходимості — знайдено і виправлено
| # | Проблема | Наслідок | Фікс |
|---|---|---|---|
| T-1 | `picker-search-loading` не мав переходу вперед (лише назад/вбік) | **R1 глухо застрягав на спінері** — користувач не міг дійти до результатів | spinner-zone onclick → `picker-search-results` ✅ |
| T-2 | `picker-search-end` недосяжний кліком (нічого не лінкувало) | стан «Більше немає» неможливо побачити в прото | додано «Завантажити ще» в results → `picker-search-end` ✅ |
| T-3 | `editor-loading` wf-meta застаріла після фіксу R3-3 | анотація брехала: «→ editor base / picker-error» | оновлено на «→ editor-overlay-selected / picker-cdn-error» ✅ |

### Сироти серед нових екранів (нічого не лінкує) — класифікація
- **picker-trending-loading** — entry-вузол прото R2 (стартова сторінка iframe), не сирота по суті. ✓
- **Стани-гілки, досяжні через галерею §20 (за дизайном — як error/empty Main):** `picker-search-noresults`, `picker-cdn-error`, `picker-recents-empty`, `export-fallback`, `export-unsupported`. Консистентно з тим, як Main тримає `editor-error`/`picker-error`/`import-error`/`listings-empty` (теж лише прямий лінк/галерея). ✓ прийнятно.
- **`export-square` — НАДЛИШКОВИЙ.** `export.html` уже робить live-reframe 9:16↔1:1 у місці через JS (`setFmt()`, `data-ar`/`data-w`), без навігації. `export-square` — статичний дубль тієї ж функції. **Рекомендація:** прибрати з набору або лишити лише як статичний знімок 1:1 (не в клік-шляху). Не баг, але дублювання.

### Проходимість флоу — підсумок
| Флоу | Вхід | Happy path до success | Статус |
|---|---|---|---|
| Main | listings | → import → editor → picker → editor-loading → overlay-selected → export → export-loading → share → listings | ✅ |
| R1 | picker-search-empty | → loading → results → (tap GIF) editor-loading → overlay-selected · results → end → змінити запит | ✅ (після T-1/T-2) |
| R2 | picker-trending-loading | → picker (Trending) → tap GIF → editor-loading → overlay-selected · вкладки Recents/Search | ✅ |
| R3 | editor | → picker → tap GIF → editor-loading → overlay-selected (Замінити↔picker · Видалити→editor) → export | ✅ |
| R4 | picker-recents | → tap GIF → editor-loading → overlay-selected · тупик recents-empty → Пошук/Trending | ✅ |
| R5 | export | 9:16↔1:1 (in-place) → export-loading → share · гілки fallback/unsupported (галерея) | ✅ |

### Зонна консистентність
- picker-сімейство (9 файлів): handle · tabs · scrim · editor-behind · `<dialog>` — присутні в усіх (cdn-error має на 1 editor-behind елемент менше, не структурно). ✓
- editor-сімейство: header · canvas · toolbar · timeline — у всіх; overlay-selected додає overlay-action кнопки. ✓
- export-сімейство: токен `--col` у всіх; `<progress>` лише де рендер (fallback). ✓

**Вивід:** набір з 30 екранів узгоджений по зонах, неймингу та навігації; 4 розриви ланцюга + 3 розриви проходимості замкнено; усі 6 флоу (Main + R1–R5) проходяться кліком від входу до success. Залишок: `export-square` надлишковий (рекомендація прибрати); 5 станів-гілок свідомо лише в галереї (консистентно з Main). Виведено в `research.html` §19 (прототипи) + §20 (аудит).

### Пост-аудитні bug-фікси
- **GIF-плитки налазили одна на одну** (R1 результати, і латентно — уся picker-родина). Причина: `.gif-grid { flex:1; overflow:auto }` дає гриду задану висоту, авто-рядки схлопуються до контент-мінімуму плитки (крихітний SVG), а `aspect-ratio:1` робить плитку вищою за рядок → вона вилазить на сусідній. **Фікс:** скрол винесено на обгортку `.sheet-scroll { flex:1; overflow:auto }`, а `.gif-grid` став авто-висоти (рядки = aspect-ratio квадрат, без схлопування). Застосовано до 6 файлів: `picker` · `picker-loading` · `picker-recents` · `picker-search-results` · `picker-search-end` · `picker-trending-loading`.

- **Плитки різного розміру між вкладками** (Trending ~3 кол / Нещодавні + Пошук 2 кол / різні gap, рамки, svg). Причина: дрейф 3 різних агентів — той самий пікер мав 3 системи сітки. **Фікс:** уніфіковано ВСІ 6 сіток під єдину адаптивну: `repeat(auto-fill, minmax(140px, 1fr))` + `gap:6px` (2 в ряд на мін. мобілці 320px → сама додає колонки 3→4 зі зростанням ширини, без ручних @640/@1024-перекриттів — їх прибрано). Плитки: `radius 8`, `svg 36%`, без рамки (borderless, як у GIPHY). Тепер перемикання вкладок не змінює розмір плиток.

### Пост-аудитні правки (за рішенням дизайнера)
- **R3 вхід** → новий `editor-no-meme.html` (31-й файл): редактор із відео, без мему, [Додати мем] активний — чистіший старт R3. (Додавання мему до проєкту з контентом теж норм — проєкт = кілька відео/мемів.)
- **Перемикач станів** у прото §19: кожна секція R1–R5 має кнопки «Стани / гілки», що вантажать будь-який стан (зокрема error/dead-end поза happy-шляхом) у той самий вʼюпорт (`protoState()`).
- `export-square` — лишено як є (за рішенням), позначено надлишковим у таблиці рішень.

---

# Раунд 4 — прискіпливий дефект-аудит (review-only)

*Перевірка всіх 31 `wireframes/*.html` проти `_conventions.md` · `sitemap.md` · `flows.md`. Дефекти: заглушки / пропущені стани / глухі кути / зона без головної дії / екран не з карти. Це огляд із пріоритетами — wireframes не чіпались.*

## Чисті категорії ✅
- **Заглушки (lorem / «Заголовок N»):** 0 — справжній доменний текст у всіх 31 файлі.
- **Пропущені стани (`_screens.md`):** 0 — усі 14 станів зведеної таблиці мають файл.
- **Глухі кути:** 0 — кожен empty/error/dead-end має ≥1 вихід уперед або назад.

## Знахідки (пріоритезовано)

| # | Екран(и) | Тип | Що не так | Як виправити | Пріор. |
|---|---|---|---|---|---|
| 1 | усі loading: export-loading · export-fallback · import-loading · editor-loading · picker-loading · picker-trending-loading · picker-search-loading | зона без головної дії | Перехід **уперед** = невидимий клік по екрану/зоні (лише `cursor`+`title`); видимого «готово» немає. Дало скаргу «R1 крутиться вічно». | Видима підказка «торкніться, щоб продовжити» / кнопка далі; або авто-перехід по таймеру (конфліктує з перемикачем станів §19). | **HIGH** |
| 2 | editor-no-meme | не з карти | Немає в `sitemap.md` і `flows.md` (створений пост-аудит як старт R3). | Додати під-стан екрана 3 у sitemap + вузол у flows R3, або позначити «прото-допоміжний». | MED |
| 3 | export-square | не з карти | Надлишковий: `export.html` робить reframe 9:16↔1:1 in-place через JS; у flows лише вузол-стан `QF`, не окремий екран. | Прибрати з набору / лишити статичним знімком поза клік-шляхом. | MED |
| 4 | editor-empty | зона без головної дії | Головна дія (додати відео) = пасивний лейбл «Додайте відео щоб розпочати» + вторинна toolbar-кнопка «＋ Кліп»; виразного CTA немає. | Зробити «Додати відео» головним CTA. | LOW-MED |
| 5 | picker-trending-loading | зона без головної дії | Перехід уперед = клік по вже активній вкладці Trending — неінтуїтивно. | Клікабельний скелетон або підказка. | LOW |
| 6 | import-loading | анотація | `wf-meta` «Скасувати → Список проектів», а кнопка → `import.html` (Вибір відео). | Узгодити анотацію з переходом. | LOW |
| 7 | export (flows.md) | пропущений стан (minor) | Вузол flows `NA` «16:9 не підтримується» без екрана. Але 16:9 не пропонується (лише 9:16/1:1) — підказка зайва. | Прибрати вузол `NA` з flows.md або лишити свідомо нереалізованим. | LOW |

**Вивід:** набір здоровий — без заглушок, тупиків і пропущених станів. Системна проблема одна (#1 — невидимий forward на loading-екранах), решта — гігієна карти (#2, #3) і дрібний полір. Фіксів у цьому раунді не вносили (review-only).

## Статус впровадження (30.06.2026)

Рішення: впроваджено **#2, #3, #4, #6, #7**. **#1** і **#5** свідомо не робимо (loading-екрани лишаємо як є — авто-перехід конфліктує з перемикачем станів §19; trending-loading прийнятний).

| # | Що зроблено | Файли |
|---|---|---|
| 2 | `editor-no-meme` додано на карту: під-стан екрана 3 у `sitemap.md` + іменований вузол старту R3 у `flows.md` (ED + рядок у «Стани»). | sitemap.md · flows.md |
| 3 | `export-square` виведено з клік-шляху прото: у §19 R5 прибрано окрему кнопку «1:1» (reframe 9:16↔1:1 робиться in-place через `setFmt()`); файл лишається статичним знімком (галерея §20). Інвентар оновлено. | research.html §19 · _wireframes.md |
| 4 | `editor-empty`: додано головний CTA «＋ Додати відео» в порожній canvas (замість пасивного лейбла); wf-meta оновлено. | editor-empty.html |
| 6 | `import-loading`: wf-meta «Скасувати» приведено у відповідність до реального переходу → 📱 Вибір відео (було «Список проектів»). | import-loading.html |
| 7 | Прибрано фантомний вузол `NA` «16:9 не підтримується» з `flows.md` (16:9 взагалі не пропонується — лише 9:16/1:1); примітку в «Стани» переформульовано. | flows.md |
