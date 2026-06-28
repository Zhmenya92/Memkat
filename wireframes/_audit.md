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
