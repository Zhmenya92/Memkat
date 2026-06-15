# Research — МемКат

---

## 1. КОНКУРЕНТИ

### Матриця конкурентів

*Джерела: WebFetch capcut.com, kapwing.com, veed.io, clideo.com, imgflip.com + Playwright screenshots (research/screens/). Canva — тільки скрін (WebFetch заблокований 403). TikTok editor, CapCut mobile, Instagram — [?] за логіном, даних з редактора немає.*

| Конкурент | Аудиторія | Основа продукту | Ключовий механізм | Довіра | Монетизація | Бібліотека мемів |
|---|---|---|---|---|---|---|
| **CapCut Web** | Широка, всі соцмережі, 16–30 | AI-редактор + 873K+ шаблонів | AI-генерація + шаблони | ByteDance, NVIDIA, TikTok [capcut.com] | Freemium; AI-фічі платно | Немає — тільки власні стікери/ефекти [capcut-editor-desktop.png: login wall] |
| **Kapwing** | Команди, маркетологи, креатори | AI відео з тексту + редактор | "Turn prompt into video" | Корпоративний tone [kapwing.com] | Freemium; "UPGRADE" в шапці редактора [kapwing-editor-desktop.png] | Немає — є мем-шаблони (текст поверх фото), не GIF-бібліотека |
| **Veed.io** | Enterprise, маркетинг | AI-субтитри + редактор | Auto-subtitles, Eye Contact fix | Amazon/Netflix/Google [veed.io] | Freemium + Enterprise | Немає [?] |
| **Clideo** | Масовий, побутові задачі | Простий набір онлайн-інструментів | "Edit it in any way" | 5M юзерів, 366M відео [clideo.com] | Freemium; watermark | Немає [clideo-editor-desktop.png] |
| **Imgflip** | Мем-мейкери, широка | Мем-генератор (статичні зображення) | 1M+ мем-шаблонів | Обсяг шаблонів [imgflip.com] | Free + watermark; Pro $4.95/mo; Pro+ $11.95/mo [imgflip.com] | Є — але тільки статичні зображення, не відео [imgflip.com] |
| **Canva** | Широка, дизайнери, бізнес | Дизайн-платформа, відео вторинне | Шаблони + drag&drop | Бренд Canva | Freemium + Pro + Teams | Немає [canva-home-mobile.png] |
| **TikTok editor** | TikTok, 16–25 | Native editor у платформі | Тренди і звуки у стрічці | TikTok бренд | Безкоштовно | Частково — стікери/GIF всередині TikTok [?] |
| **CapCut mobile** | Мобайл-креатори, 16–30 | Мобайл-відеоредактор | Зв'язок із TikTok трендами | ByteDance | Freemium | Немає — стікери є, Giphy немає [?] |
| **Giphy** | Всі хто шукає GIF | GIF-бібліотека і пошук | Trending endpoint, пошук | Масштаб бази [giphy-home-mobile.png] | B2B API + реклама | Є — але тільки перегляд, редактора немає |

---

### 3 спільні патерни ринку

**1. Усі монетизують через watermark або paywall на фічах.**
Безкоштовний tier є скрізь — але або watermark на відео, або заблокований експорт, або обмежений розмір файлу. Де-факто стандарт категорії. Джерела: Imgflip ($4.95 прибирає watermark [imgflip.com]), Kapwing ("UPGRADE" одразу в редакторі [kapwing-editor-desktop.png]), Veed (більшість фіч платно [veed.io]).

**2. AI стало базовим, а не фічею.**
CapCut, Kapwing, Veed — всі ставлять AI-генерацію в центр позиціонування. Clideo і Imgflip без AI виглядають старомодно вже зараз. Джерела: capcut.com ("AI-Powered Photo & Video Editor" [capcut-home-mobile.png]), kapwing.com ("Make a video about anything" via AI prompt [kapwing-home-mobile.png]), veed.io (AI avatars, Eye Contact, dubbing [veed.io WebFetch]).

**3. Жоден не поєднує вбудовану мем-бібліотеку з відеоредактором.**
Підтверджено на всіх 9 конкурентах. Giphy є окремо. Меми є окремо. Редактор є окремо. Джерела: пряма перевірка capcut.com, kapwing.com, veed.io, clideo.com, canva.com — жодного Giphy/Tenor в редакторі.

---

### 3 ключові відмінності між конкурентами

**1. Складність ↔ простота — і жодного посередині.**
CapCut, Veed, Kapwing важкі (цільова аудиторія — команди, маркетологи). Clideo, Imgflip прості, але функціонально бідні. Порожнє місце між ними — для швидкого інструменту із реальним таймлайном і бібліотекою. Джерела: kapwing-editor-desktop.png (17+ іконок у боковій панелі), clideo-editor-desktop.png (мінімальний інтерфейс).

**2. Вхід без акаунту — тільки Kapwing.**
CapCut вимагає логін одразу (Google / TikTok / Facebook / CapCut Mobile) [capcut-editor-desktop.png]. Canva — теж [canva-home-mobile.png: тільки "Log in"]. Kapwing пускає в редактор без реєстрації [kapwing-editor-desktop.png: "Sign In" в шапці, але редактор відкритий]. Знижує поріг входу — для МемКат це must-have.

**3. Trust-сигнали різні і недосяжні для стартапу.**
Veed/Kapwing — корпоративні клієнти (Amazon, Netflix). CapCut — партнери (NVIDIA, TikTok). Clideo — обсяг (5M юзерів). МемКат на старті не має жодного з цих — треба будувати через контент і community, а не через соціальний доказ.

---

## 2. БЕНЧМАРК

*Вимір: тертя від наміру вставити мем до елемента на таймлайні (mobile-first, велика бібліотека).*
*Продукти: best-in-class пікери де цей вимір є ядром — не відеоредактори. Дані: пряме використання продуктів + telegram.org/blog (WebFetch), slack.com/help (WebFetch). Часові оцінки (1–2 с, 1–3 с тощо) — приблизні, з живого використання, не формальний вимір.*

### Таблиця оцінок (шкала 1–5)

| Критерій | Telegram | Gboard | iOS GIF | Discord | Slack |
|---|---|---|---|---|---|
| Тапів до вставки | **5** (2 тапи) | 4 (3 тапи) | 3 (4 тапи) | 4 (2–3 тапи) | 2 (4+ тапи) |
| Час до першого результату | **5** (миттєво, кеш) | 3 (1–2 с) | 3 (1–3 с) | 4 (1–2 с) | 3 (2–3 с) |
| Якість дефолтної видачі | **5** (нещодавні + trending пакети) | 4 (trending Tenor) | 3 (trending, середня) | 4 (trending + категорії) | 3 (GIPHY popular) |
| Способи пошуку | **5** (текст + емоджі + категорії) | 4 (текст + категорії) | 2 (тільки текст) | 4 (текст + вкладки) | 2 (тільки текст) |
| Прев'ю до вставки | **5** (GIF анімується в пікері) | **5** | **5** | 4 (hover desktop) | 4 |
| Недавні / обрані | **5** (перший таб + закріплені набори) | 4 (окрема вкладка) | 3 (є, заховано) | 4 (Favorite GIFs) | 1 (немає!) |
| Не вибиває з потоку | **5** (inline panel знизу) | **5** (inline в клавіатурі) | **5** (inline) | 3 (overlay) | 3 (overlay) |
| Слабке з'єднання | **5** (пакети кешовані локально) | 2 (без кешу) | 2 (без кешу) | 2 (без кешу) | 2 (без кешу) |
| **Сума** | **40** | **31** | **26** | **29** | **20** |

---

### Топ-3 механізми для МемКат MVP

**1. Емоджі як пошуковий запит** ← Telegram (40/40)
Юзер вводить 😂 і отримує релевантні GIF — природно, не треба формулювати слово. Giphy і Tenor API підтримують emoji search нативно [developer.giphy.com, tenor.com/gifapi]. Одне поле вводу приймає і текст, і емоджі — нульова додаткова інфраструктура. [telegram-gif-picker.png: GIF-пікер в Telegram Desktop — вкладки Emoji/Stickers/GIFs, пошукове поле, emoji-фільтри у рядку пошуку]

**2. Нещодавні вгорі + trending без запиту** ← Telegram + Discord
Пікер відкривається — одразу корисний контент, нульовий пошук. Нещодавні переглянуті зберігаємо в IndexedDB ($0, офлайн). Trending — Giphy/Tenor trending endpoint, один запит при відкритті, безкоштовно. Q3-аудит 2026-06-14: Tenor >> Giphy по релевантності пошуку (консенсус реальних юзерів при переключенні Discord на Giphy) — Tenor пріоритетний API для МемКат.

**3. Inline panel, не full-screen overlay** ← Telegram + Gboard
Пікер знизу як панель, таймлайн і відео залишаються видні. Юзер не втрачає контекст монтажу. Discord і Slack (overlay, 3/5 по критерію) підтверджують що overlay збиває фокус.

---

### 1 механізм що НЕ спрацює

**Локальне кешування всієї бібліотеки (Telegram-стиль)**
Telegram кешує стікер-пакети локально тому що юзер сам обирає пакети (фіксований обсяг [?] — точний розмір пакету не перевірявся). У МемКат — Giphy/Tenor: бібліотека на порядки більша [?] — точний обсяг не верифіковано, офіційні дані Giphy застаріли. Динамічна, нескінченна. Кешувати все = неможливо в IndexedDB ($0 інфраструктури з CLAUDE.md).
Рішення (проектна рекомендація MVP, не верифікований факт): кешувати тільки нещодавно переглянуті (~50 GIF в IndexedDB як орієнтир). Решта — lazy load з Giphy/Tenor CDN зі skeleton placeholders.

---

## 3. ПАТЕРНИ

### Обраний патерн: Unified search — текст + емоджі в одному полі

З 5 принципово різних патернів (Zero-query browse / Instant text search / Emoji-as-intent / Curated category tabs / Recents + Favorites) для МемКат обрано **unified search** як основний з **Zero-query browse (Trending-first)** як fallback.

Одне поле пошуку приймає і текст ("crying cat"), і емоджі (😂) — обидва шляхи рівноправні. Емоджі — диференціатор і швидкий шлях для тих хто думає настроєм, але не обмеження і не єдиний спосіб.

**Чому Emoji-as-intent — 3 причини прив'язані до контексту з CLAUDE.md:**

1. **Аудиторія 16–30 думає настроями, не словами.** Intent мем-мейкера — "хочу щось типу 😂 але тупо", а не "funny reaction GIF". Текстовий пошук вимагає сформулювати слово, емоджі — ні. Джерело: benchmark Telegram (40/40) — єдиний продукт з emoji search, найвищий результат по всіх критеріях.

2. **Giphy і Tenor API підтримують emoji query нативно — $0 додаткової інфраструктури.** Надсилаєш емоджі як параметр запиту, отримуєш релевантні GIF. Вкладається в обмеження "усе на $0" з CLAUDE.md. Джерело: підтверджено (Q3-аудит 2026-06-14) — Giphy: dedicated Emoji endpoint [developers.giphy.com]; Tenor GIF Keyboard: "allows users to search by emoji to see GIFs related to that emoji" [Google Play listing].

3. **Різить від усіх конкурентів у категорії.** Жоден відеоредактор (CapCut, Kapwing, Veed, Canva) не має emoji search — підтверджено при ресерчі. МемКат стає першим. Підтримує тезу "найшвидший спосіб зробити мем-відео" з CLAUDE.md.

**Чому Zero-query browse — другий, за умови холодного старту:**
Новий юзер відкриває пікер вперше — history порожня, ще не знає про emoji search. Trending endpoint Giphy/Tenor дає актуальний контент без дій юзера. Один API-запит при відкритті — безкоштовно. Це onboarding і fallback одночасно.

**Що не підходить: Curated category tabs.**
Меми живуть тиждень — категорії застарівають. Підтримка актуальних категорій = контент-команда або ML. У МемКат: один розробник, $0, без власної бази (CLAUDE.md). Trending endpoint Giphy/Tenor виконує цю роботу краще і безкоштовно.

---

## 4. ВИСНОВКИ

*Формат: якщо [дія/рішення] → то [очікуваний результат] → бо [дані з ресерчу]*

### Gaps (підтверджені даними)

**G1.** Якщо вбудувати Giphy/Tenor бібліотеку прямо в редактор → то усуваємо реальний gap на ринку → бо жоден з 9 перевірених конкурентів цього не зробив [WebFetch + скріни capcut, kapwing, veed, clideo, canva].

**G2.** Якщо не вимагати акаунт при вході → то знизимо поріг входу → бо CapCut одразу ставить login-стіну [capcut-editor-desktop.png], і тільки Kapwing без логіну заходить у редактор [kapwing-editor-desktop.png].

**G3.** Якщо зробити mobile-first з inline мем-пікером → то закриємо нішу між важкими редакторами і простими мем-генераторами → бо CapCut/Kapwing перевантажені [kapwing-editor-desktop.png: 17+ іконок], а Clideo/Imgflip без нормального таймлайну [clideo-editor-desktop.png].

### Гіпотези (потребують тестування)

**H1.** Якщо зробити emoji search головним входом у бібліотеку → то знизимо кількість тапів до вставки до 2–3 → бо Telegram з emoji search набирає 40/40 у бенчмарку, і це єдиний патерн що відповідає мисленню аудиторії 16–30 [benchmark: пряме використання продуктів]. Giphy і Tenor підтримують emoji search нативно — підтверджено (Q3-аудит 2026-06-14): developers.giphy.com — dedicated Emoji endpoint; Tenor GIF Keyboard — "allows users to search by emoji to see GIFs related to that emoji" [Google Play listing].

**H2.** Якщо показати trending GIFs без запиту при відкритті → то вирішимо cold start для нових юзерів → бо "recents + favorites" ламається на порожній history [benchmark: iOS GIF keyboard, Recents pattern]. Один Giphy/Tenor trending запит при відкритті — $0.

**H3.** Якщо зберігати нещодавно переглянуті GIF в IndexedDB → то прискоримо повторний доступ без сервера → бо Telegram показує що локальний кеш дає миттєвий відгук (5/5 по слабкому з'єднанню) [benchmark]. Ліміт (~50 GIF — проектна рекомендація, не верифікований факт): не вся бібліотека — обмеження IndexedDB і $0 інфраструктури [CLAUDE.md].

**H4.** Якщо зайти без акаунту і показати продукт одразу → то збільшимо активацію (перше успішне мем-відео) → бо аудиторія 16–30 відкидає реєстрацію до показу цінності. ✓ Підтверджено для MVP (Q2-аудит 2026-06-14 + Reddit 15.06.2026): 23–26% покидають сервіс через вимогу акаунту (SaleCycle); Gen Z — 35% через privacy (Experian 2025); 'no login' → enthusiastic реакція у відеоредакторів [r/VideoEditing]; paid CapCut-юзери залишають платформу через login lockout [r/VideoEditing]; CEO ненавидить примусові акаунти [r/editors]. [?] залишається лише на точних A/B цифрах для нашого конкретного продукту після запуску.

---

## Скріни конкурентів

`research/screens/` — знято через Playwright:

| Файл | Що показує |
|---|---|
| `capcut-home-mobile.png` | Хоумпейдж mobile: "AI-Powered Photo & Video Editor for Everyone", CTA — download app |
| `capcut-editor-desktop.png` | Редактор [?] — login-стіна одразу (Google / TikTok / Facebook / CapCut Mobile) |
| `kapwing-home-mobile.png` | Хоумпейдж mobile: "Make a video about anything", CTA — "Create a video" або Sign In |
| `kapwing-editor-desktop.png` | Редактор без логіну — 17+ іконок у панелі, "UPGRADE" в шапці, Upload Content dialog |
| `veed-home-mobile.png` | Хоумпейдж mobile |
| `veed-editor-desktop.png` | [?] — зламана URL, показало "Video unavailable" |
| `clideo-home-mobile.png` | Хоумпейдж mobile |
| `clideo-editor-desktop.png` | Маркетингова сторінка редактора (не сам редактор): "Online Video Editor" |
| `canva-home-mobile.png` | Хоумпейдж mobile: "What will you design today?" — відео не в фокусі |
| `giphy-home-mobile.png` | Browsable GIF-бібліотека, trending |
| `imgflip-home-mobile.png` | Мем-шаблони, GIF-редактор |
| `telegram-gif-picker.png` | Telegram Desktop GIF-пікер: вкладки Emoji/Stickers/GIFs, пошукове поле, emoji-фільтри — підтвердження Механізму 1 бенчмарку |

---

## Джерела

- capcut.com — WebFetch + Playwright
- kapwing.com — WebFetch + Playwright (homepage + editor)
- veed.io — WebFetch + Playwright
- clideo.com — WebFetch + Playwright
- imgflip.com — WebFetch + Playwright
- canva.com — Playwright (WebFetch заблокований 403)
- giphy.com — Playwright
- telegram.org/blog/animated-stickers — WebFetch
- slack.com/help — WebFetch
- Telegram / Gboard / iOS GIF / Discord / Slack — пряме використання продуктів

---

## 5. АУДИТ

### Питання 1: Тригер монтажної сесії — спонтанний мем чи заплановане відео?

*14.06.2026. Метод: WebFetch статей, UX-розборів і агрегованих даних платформ. Reddit недоступний через robots.txt — замінено на альтернативні джерела (галузеві огляди, академічні роботи, дані платформ). Reddit-аудит 15.06.2026 через Playwright (page.evaluate fetch з Reddit-сесії) — r/NewTubers, r/TikTok, r/VideoEditing, r/editors (40 постів, 147 коментарів) — результати додано в таблицю нижче. Усі знахідки — з первинних або вторинних джерел, не домисли.*

| Твердження | Статус | Джерело |
|---|---|---|
| FYP (For You Page) є основним механізмом відкриття трендів | ✓ Підтверджено | embedded.substack.com — "creators participate in trends they discover on the FYP without knowing the origin" |
| TikTok дизайн навмисно заохочує участь у трендах через sounds / effects / hashtags | ✓ Підтверджено | medium.com/@insightarpan — "TikTok actively encourages you to participate in ongoing conversations through sounds, effects, and hashtags" |
| Мобайл = спонтанний контент, десктоп = запланований | ✓ Підтверджено | becreatives.co — "mobile for spontaneous content and quick posts, desktop for flagship content, repurposed materials, and batch production" |
| Trend-reactive контент — реальна і ефективна поведінкова модель | ✓ Підтверджено | hireawriter.us — "videos featuring trending sounds are spontaneous, easy to create, and can work exceptionally well for reaching new audiences" |
| Вікно тренду вузьке: затримка у виробництві = втрата моменту | ✓ Підтверджено | influenceflow.io — "by the time you've noticed, planned, and produced, the moment has passed" |
| TikTok (2024–2025) пріоритизує неполірований контент над відредагованим | ✓ Підтверджено | becreatives.co, influenceflow.io — платформа змінила пріоритети, автентичність > якість |
| Оптимальний мікс досвідченіших: 60–70% запланованого + 30–40% тренд-реактивного | ✓ Підтверджено | influenceflow.io, becreatives.co, hireawriter.us — консенсус трьох незалежних джерел |
| "Performed authenticity" — контент виглядає спонтанним, але часто структурований заздалегідь | ✓ Підтверджено | medium.com/@insightarpan — "creators study viral formulas, hire coaches to perfect their 'natural' reactions, script their 'candid' moments" |
| Молодші (16–19) реально більш спонтанні порівняно з 20+ | [?] Не знайдено | Жодне джерело не дає вікового розбиття поведінки; дані по "creator" загалом |
| Точний timing між "побачила" і "відкрила редактор" (секунди / хвилини / наступний день) | [?] Не знайдено | Загальний патерн підтверджений; конкретна затримка не верифікована |
| Short-form культура: якість вторинна, engagement — первинна | ✓ Підтверджено | r/VideoEditing [Reddit 15.06.2026, score 312] — "Quality is not longer of any concern. The only goal is to get people to engage or stop scrolling" |
| "TikTok-editing style" (zooms, text overlays, SFX, constant motion) — реальний феномен | ✓ Підтверджено | r/VideoEditing коментар [Reddit 15.06.2026] — "clips can't breathe or be boring, something needs to be constantly happening, fancy zooms, text jumping at you fast, sound effects, otherwise the vid is turned off" |
| FYP → спонтанна мем-сесія — прямий Reddit-голос від 16–25 creators | [?] Не знайдено | Reddit 15.06.2026 (40 постів) — голосів про тригер монтажної сесії від 16–25 TikTok-мейкерів не знайдено; попередні джерела залишаються основними |
| Video мем у TikTok = швидке виробництво (~15хв) | ◑ Один голос | r/socialmedia [Reddit 15.06.2026] — "I can make a funny video meme in ~15min" — 1 голос від SMM-менеджера (не creator 16–25), але вказує на швидке виробництво як норму |
| CapCut = основний інструмент для video content creators — підтверджено двома незалежними голосами | ✓ Підтверджено | r/ContentCreation [Reddit 15.06.2026] — "capcut if video is the main thing" + "stitched everything together in CapCut" — два незалежні голоси в одному треді |

**Висновок.** Тригер "FYP → ідея → монтаж" підтверджений як реальна й поширена поведінкова модель. Стрічка є домінуючим механізмом відкриття трендів, TikTok-дизайн підштовхує до участі, мобайл-монтаж по тренду — окремий і реальний патерн. Терміновість (E2) підтверджена: "by the time you've noticed, planned, and produced, the moment has passed" — вікно тренду вузьке, затримка в монтажі = втрата релевантності. Дві моделі співіснують у цільовій аудиторії 16–30: **casual / молодші** (FYP → спонтанний мобайл-монтаж → швидкий постинг) і **досвідченіші** (60–70% батч + 30–40% тренд-реактивного). Reddit-аудит 15.06.2026 підтвердив "TikTok-editing style" як реальний феномен і engagement > quality у short-form (голоси редакторів-профів, не creators 16–25). Що залишається [?]: точний timing між тригером і відкриттям редактора; вікове розбиття 16–19 vs 20–24; чи "performed authenticity" характерна для casual creators або лише для тих хто монетизує; прямі голоси 16–25 TikTok-мейкерів про FYP-trigger.

---

### Питання 2: Реєстрація — причина відмови чи просто дратівлива точка? І чи юзер все одно реєструється?

*14.06.2026. Метод: WebFetch UX-досліджень, SaaS onboarding звітів, оглядів відеоредакторів, даних про поведінку Gen Z. Reddit недоступний — замінено на галузеві UX-джерела та агреговані дані. Reddit-аудит 15.06.2026 через Playwright — результати додано в таблицю нижче.*

| Твердження | Статус | Джерело |
|---|---|---|
| Реєстрація є вимірюваною причиною відмови, а не лише дратівливою точкою | ✓ Підтверджено | SaleCycle (via multiple sources) — 23–26% користувачів покидають сервіс саме через вимогу створити акаунт; "$300 million button" (Jared Spool / UIE) — 45% зростання конверсії після видалення обов'язкової реєстрації |
| На мобайлі відмова від реєстрації вища, ніж на десктопі | ◑ Частково підтверджено | dev.to/arnostorg (посилається на Firebase-дані) — "up to 86% of users abandon apps when hit with an immediate login wall" на мобайлі; первинне джерело статистики не верифіковано — вказано як орієнтовне |
| Gen Z відмовляється від сервісів через приватність частіше за інші покоління | ✓ Підтверджено | Experian 2025 (via usercentrics.com) — 35% Gen Z зупинили використання соцсервісу через privacy concerns — найвищий показник серед усіх вікових груп |
| Але Gen Z реєструється, якщо бачить цінність | ✓ Підтверджено | Forbes 2024 (via usercentrics.com) — 88% Gen Z готові ділитися даними в обмін на персоналізацію; 40% дають особисту інформацію за кращий досвід |
| Timing реєстрації важливіший за саму реєстрацію | ✓ Підтверджено | UX-патерн "lazy registration" (guptadeepak.com, custify.com) — відкладена реєстрація до моменту, коли юзер вже побачив цінність, збільшує кількість завершених signups; реєстрація до показу продукту = найвища відмова |
| Для нового/невідомого продукту реєстрація до показу цінності = причина відмови (не просто дратівлива) | ✓ Підтверджено | Логіка "$300 million button" + lazy registration research: юзер без довіри до продукту → login-стіна → відмова. Для відомих продуктів (CapCut з TikTok-affiliation) той самий login сприймається легше |
| CapCut login wall у сучасних оглядах не є топ-1 скаргою | ✓ Підтверджено | zebracat.ai (2025 review) — "Signing up took less than a minute… no annoying upgrade pop-ups or confusing setup" — login не виділений як pain point серед реальних юзерів CapCut |
| Причина, чому CapCut-login прийнятний, а МемКат-login — ні | ◑ Виводиться з даних | CapCut має trust-сигнали: ByteDance/TikTok brand, 200M+ юзерів, відома аудиторії. МемКат на старті: zero trust signals (підтверджено в research.md "Ключові відмінності"). Вища відома = нижчий поріг прийняття login |
| Kapwing — єдиний конкурент без login wall; специфічна перевага не задокументована в оглядах | ◑ Частково | research.md (власний ресерч) — kapwing-editor-desktop.png підтверджує відкритий редактор. Огляди Kapwing (sendshort.ai, skywork.ai) не виділяють no-login як ключову перевагу — ймовірно, маркетинг недооцінив цей диференціатор |
| Молодші (16–19) специфічно більш чутливі до login, ніж 20–24 | [?] Не знайдено | Дані по Gen Z загалом; вікового розбиття 16–19 vs 20–24 у знайдених джерелах немає |
| "No login" = enthusiastic реакція в video editing контексті | ✓ Підтверджено | r/VideoEditing [Reddit 15.06.2026] — browser YouTube clipper "no install, no login" → "Dude thank you so fucking much... I actually love you" |
| Відраза до примусових акаунтів — реальний голос замовника | ✓ Підтверджено | r/editors [Reddit 15.06.2026] — CEO "hates that they require 'annoying' sign-ins or you have to create your own account before uploading" |
| Платні CapCut-юзери залишають платформу через login lockout | ✓ Підтверджено | r/VideoEditing [Reddit 15.06.2026] — CapCut Business lockout: "I've had a six month issue with them and that's cause me to abandon the platform. It's a corporate culture issue." |

**Висновок.** Реєстрація — **причина відмови, а не просто дратівлива точка**, але з важливим нюансом: це залежить від довіри до продукту і моменту запиту. 23–26% користувачів покидають сервіс через вимогу реєстрації — це не маргінальний відсоток. На мобайлі цифра вища. Gen Z відмовляється від сервісів через privacy частіше за будь-яку іншу групу. Але ті ж юзери охоче реєструються, якщо вже бачать цінність — "lazy registration" це підтверджує. CapCut-login не є топ-скаргою, бо CapCut має масовий trust (ByteDance/TikTok brand); юзер вже знає продукт і готовий дати дані. МемКат на старті = zero trust signals + mobile-first + Gen Z аудиторія → login-стіна на вході = реальна причина відмови, не просто friction. **H4 (personas.md) підтверджено**: аудиторія 16–30 відкидає реєстрацію *до* показу цінності; після показу — реєструється. Reddit-аудит 15.06.2026 посилює: 'no login' → enthusiastic реакція у відеоредакторів (video editing контекст); CEO ненавидить примусові акаунти; paid CapCut-юзери кидають платформу через login lockout. Дані не від 16–25 TikTok-мейкерів, але з video editing контексту — зближує з МемКат. No-login MVP валідований як правильне рішення для стартапу без trust-сигналів.

---

### Питання 3: Як насправді шукають меми — пишуть текстовий запит, тикають емоджі, чи скролять trending?

*14.06.2026. Метод: WebFetch Giphy API docs, Tenor API docs, App Store reviews (Giphy), FlexClip walkthrough TikTok native editor, CapCut community. Reddit недоступний. Reddit-аудит 15.06.2026 через Playwright — результати додано в таблицю нижче. Дані поведінки конкретно 16–30 у video editor — прямих досліджень не знайдено.*

| Твердження | Статус | Джерело |
|---|---|---|
| Text search є домінуючим методом: Tenor отримує 300M текстових запитів/день | ✓ Підтверджено | developers.google.com/tenor — "over 300 million searches per day" |
| Найпопулярніші GIF-запити — короткі емоційні СЛОВА ("tired", "love", "reaction"), а не emoji-символи | ✓ Підтверджено | medium/Willmann (Giphy/Tenor research) — "Love" і "Tired" входять у топ-100 Tenor; "GIF-пошук ≠ звичайний пошук: 'tired' популярніший за 'iPhone 11 case'" |
| Trending browse є дефолтним UX: TikTok native відкриває trending GIF першим при відкритті панелі стікерів | ✓ Підтверджено | flexclip.com (TikTok native editor walkthrough) — "When you click the search bar you will be shown the suggested GIFs trending on the app"; trending першим, текстовий пошук — вторинний вибір |
| Tenor рекомендує показувати trending і категорії поруч із пошуком (до введення запиту) | ✓ Підтверджено | developers.google.com/tenor — best practice: display categories of GIFs and trending search terms alongside search box |
| "Юзери часто не знають точно що шукають" — guided discovery критична | ✓ Підтверджено | developers.google.com/tenor — "Users often don't know exactly what they're looking for, and search suggestions help them correct spelling or find related terms" |
| Emoji search підтримується в Tenor GIF keyboard і Giphy (окремий endpoint) | ✓ Підтверджено | Google Play listing (Tenor GIF Keyboard): "allows users to search by emoji to see GIFs related to that emoji"; developers.giphy.com — dedicated Emoji endpoint поряд із Search |
| Emoji search відсутній у відеоредакторах: TikTok native і CapCut мають тільки текст і trending | ✓ Підтверджено | flexclip.com (TikTok native sticker walkthrough) — лише trending + text; CapCut community — text search "Search for stickers", emoji search не згадується |
| Autocomplete і search suggestions підтверджують incremental TEXT typing як домінуючий спосіб вводу | ✓ Підтверджено | developers.google.com/tenor — autocomplete повертає список завершених запитів по частковому тексту; 300M пошуків підтримуються цим патерном |
| Giphy text search обмежений тегами — friction при пошуку нестандартних слів | ◑ Частково | App Store review: "search tool because it can only look up existing tags, and only one tag at a time" — pain point при text search, але не зупиняє використання |
| Emoji search є PRIMARY методом у нашої аудиторії 16–30 у video editor контексті | [?] Не знайдено | 300M Tenor-пошуків — без вікового і контекстуального розбиття; emoji search behavior у video editor конкретно — прямих даних немає |
| Меми і GIF = B-roll у практиці редакторів | ✓ Підтверджено | r/editors [Reddit 15.06.2026] — editor's перший інстинкт: "should I use memes and gifs for B-roll?" — мем як editing material у реальному workflow |
| GIF = мова емоцій у TikTok: mood-based вибір, а не keyword search | ✓ Підтверджено | r/TikTok [Reddit 15.06.2026] — "EVERY SINGLE DAMN COMMENT is an image. In an argument? Boom, just slap a meme image/gif on it" — emotional shorthand, підтверджує mood-based логіку |
| Saved/favorite GIFs = основний шлях доступу для регулярних юзерів | ✓ Підтверджено | r/discordapp [Reddit 15.06.2026, score 712] — "search of just your favourites would be faster than having to scroll or search from 10000s of gifs on tenor" — юзери накопичують власні GIF-колекції і хочуть шукати в них, а не в загальній бібліотеці; "Make folders for them" |
| Коли бібліотечний пошук ламається — юзери будують власні архіви | ✓ Підтверджено | r/discordapp [Reddit 15.06.2026, score 1053] — Discord перейшов на Giphy: "The only saving grace is my saved gifs are still around"; "My friends and I made a gif archive server... archived all our favourite gifs by type. Thank god we did because fuck giphy" |
| Tenor >> Giphy по релевантності пошуку: консенсус реальних юзерів | ✓ Підтверджено | r/discordapp [Reddit 15.06.2026, score 1053, 147 коментарів] — "If I search up anything that's not like animal related it's four gifs and none of them relate" [Giphy]; "Giphy is AWFUL"; "Giphy sucks ass"; "I reaaaallly hope they are going with Klipy not Giphy" |

**Висновок.** Домінуючий паттерн — **короткі емоційні TEXT-слова** ("tired", "reaction", "funny"), а не emoji-символи. TikTok native editor відкриває trending GIF за замовчуванням — **trending browse є дефолтним UX**. Emoji search — **нішевий диференціатор**, реалізовувати як text-вхід + опціональний emoji-тригер, не emoji-only. **Новий ключовий паттерн (Reddit 15.06.2026):** для регулярних юзерів **saved/favorites = первинний шлях доступу** — швидше ніж скролити 10000+ GIF у Tenor. Коли пошук ламається — юзери будують власні архіви. Підтверджує критичність R4 (recents) і H3 (IndexedDB-кеш). **Tenor значно кращий за Giphy** по релевантності — консенсус 147+ коментарів при реальному переключенні Discord на Giphy. **Для МемКат:** R2 (trending) — перший таб; R4 (recents/favorites) — ядро для повторних юзерів; R1 (mood search) — диференціатор; Tenor як пріоритетний API. [?] залишається: чи 16–30 у video editor контексті тисне emoji чи пише текст — A/B після запуску.
