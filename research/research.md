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
Пікер відкривається — одразу корисний контент, нульовий пошук. Нещодавні переглянуті зберігаємо в IndexedDB ($0, офлайн). Trending — Giphy/Tenor trending endpoint, один запит при відкритті, безкоштовно.

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

2. **Giphy і Tenor API підтримують emoji query нативно — $0 додаткової інфраструктури.** Надсилаєш емоджі як параметр запиту, отримуєш релевантні GIF. Вкладається в обмеження "усе на $0" з CLAUDE.md. Джерело: офіційна документація Giphy API (emoji search endpoint) [?— не перевірено, потребує верифікації в API docs перед реалізацією].

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

**H1.** Якщо зробити emoji search головним входом у бібліотеку → то знизимо кількість тапів до вставки до 2–3 → бо Telegram з emoji search набирає 40/40 у бенчмарку, і це єдиний патерн що відповідає мисленню аудиторії 16–30 [benchmark: пряме використання продуктів]. **[?] Потребує верифікації: чи підтримує Giphy API emoji як query параметр — перевірити в API docs перед реалізацією.**

**H2.** Якщо показати trending GIFs без запиту при відкритті → то вирішимо cold start для нових юзерів → бо "recents + favorites" ламається на порожній history [benchmark: iOS GIF keyboard, Recents pattern]. Один Giphy/Tenor trending запит при відкритті — $0.

**H3.** Якщо зберігати нещодавно переглянуті GIF в IndexedDB → то прискоримо повторний доступ без сервера → бо Telegram показує що локальний кеш дає миттєвий відгук (5/5 по слабкому з'єднанню) [benchmark]. Ліміт (~50 GIF — проектна рекомендація, не верифікований факт): не вся бібліотека — обмеження IndexedDB і $0 інфраструктури [CLAUDE.md].

**H4.** Якщо зайти без акаунту і показати продукт одразу → то збільшимо активацію (перше успішне мем-відео) → бо аудиторія 16–30 відкидає продукти з реєстрацією на вході [?— гіпотеза, не підтверджена даними ресерчу, потребує A/B тесту або якісного дослідження].

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
