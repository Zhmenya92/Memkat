# User Flows — МемКат

*База: sitemap.md · 21.06.2026*
*Кожен вузол-екран відповідає екрану з sitemap.md. Стани (empty / loading / error) — окремі вузли всередині того самого екрану. Нових екранів не виявлено.*

**Умовні позначення**
- 📱 прямокутник — Екран (точка навігації)
- ⬜ ⏳ 🔴 прямокутник — Стан (empty / loading / error)
- ◆ Ромб — Точка рішення
- ✅ Успіх — job виконано
- 💀 Тупик — зупинка без виходу вперед
- `══⟹` жирна суцільна стрілка — основний шлях (happy path)
- `╌╌⟶` тонка пунктирна стрілка — альтернатива або помилка

---

## Main — зробити і викласти мем-відео поки тренд живий

```mermaid
flowchart TD
    classDef screen  fill:#192233,stroke:#3a6090,color:#90c0f0
    classDef state   fill:#271e0a,stroke:#c07a28,color:#f0a060
    classDef decide  fill:#1c1528,stroke:#6050a0,color:#c0b0f8
    classDef ok      fill:#0a1e0f,stroke:#28a060,color:#50d880
    classDef fail    fill:#22080a,stroke:#903030,color:#f05060
    classDef trigger fill:#180e1a,stroke:#8060c0,color:#c098f0

    T(["▶ Побачила мем у стрічці"]):::trigger

    T ==> PL["📱 Список проектів"]:::screen
    PL --> Q1{Є проект?}:::decide
    Q1 -. ні .-> PL_E["⬜ Порожній список\n'Почати перший проект'"]:::state
    PL_E == Почати перший проект ==> IMP["📱 Вибір відео"]:::screen

    Q1 == існуючий ==> QB{Blob у IndexedDB?}:::decide
    QB == є ==> ED["📱 Редактор"]:::screen
    QB -. зник (кеш очищено) .-> BLOB_E["🔴 Відеофайл не знайдено"]:::state
    BLOB_E == Імпортувати знову ==> IMP

    IMP -. скасувала · новий проект .-> PL
    IMP -. скасувала · + кліп .-> ED
    IMP == вибрала ==> IMP_L["⏳ Завантаження"]:::state
    IMP_L --> Q3{Валідація файлу}:::decide
    Q3 -. непідтримуваний формат .-> IMP_E1["🔴 Непідтримуваний формат"]:::state
    Q3 -. файл > 500 MB .-> IMP_E2["🔴 Файл > 500 MB"]:::state
    Q3 -. файл пошкоджено .-> IMP_E3["🔴 Файл пошкоджено"]:::state
    IMP_E1 -. інший файл .-> IMP
    IMP_E2 -. інший файл .-> IMP
    IMP_E3 -. інший файл .-> IMP
    IMP_E1 -. скасувала .-> PL
    IMP_E2 -. скасувала .-> PL
    IMP_E3 -. скасувала .-> PL
    Q3 == завантажено ==> ED

    ED == Додати мем ==> MP["📱 Мем-пікер"]:::screen
    ED -. + кліп .-> IMP
    ED -. автозбереження .-> SAVE_OK["✓ Збережено"]:::state
    ED -. збереження не вдалось .-> SAVE_ERR["⚠ Не вдалось зберегти"]:::state
    SAVE_ERR -. повторити .-> ED
    MP -. закрила .-> ED
    MP == вибрала ==> EXP["📱 Експорт · вибір формату"]:::screen

    EXP == обрала формат ==> CROP_PREV["👁 Попередній перегляд кадрування"]:::screen
    CROP_PREV == виглядає добре ==> REND["⏳ Рендер WebCodecs"]:::state
    CROP_PREV -. змінити формат .-> EXP
    REND -. скасувати .-> EXP
    REND --> Q6{Рендер OK?}:::decide
    Q6 -. збій .-> REND_E["🔴 Помилка рендеру"]:::state
    REND_E --> Q7{Повторити?}:::decide
    Q7 == так ==> REND
    Q7 -. ні .-> ED
    Q6 == успіх ==> SHARE["📤 Поділитись / завершити"]:::screen
    SHARE == поділитись ==> OK(["✅ Виклала\nзняв → мем → виклав ✓"]):::ok
    SHARE -. до списку проектів .-> PL
    SHARE -. новий проект .-> IMP
```

**Стани**
- ⬜ empty — Список проектів: empty-state з CTA «Почати перший проект»
- 🔴 error — Відеофайл не знайдено в IndexedDB: пояснення + «Імпортувати знову»
- ⏳ loading — Вибір відео: завантаження та валідація файлу
- 🔴 error — Непідтримуваний формат / файл > 500 MB / файл пошкоджено: пояснення + «Спробувати інший файл»
- ✓ autosave — Редактор: «Збережено» (silent, 2 сек) або «Не вдалось зберегти» + retry
- 👁 preview — Попередній перегляд кадрування: перший кадр у обраному форматі + зсув вертикального кадру
- 🔴 error — Рендер: помилка + «Повторити»
- 📤 share — Поділитись / завершити: system share sheet · до списку проектів · новий проект

**Тупики**
- Помилка формату і юзер не має іншого файлу — виходить через скасувала → список проектів
- ✓ виправлено: Рендер падає повторно і юзер відмовляється повторювати → `Q7 -. ні .-> ED`
- ✓ виправлено: Рендер зависає без опції виходу → `REND -. скасувати .-> EXP`

**Примітки**
- «Скасувала» з Вибору відео: новий проект → Список проектів; + кліп → Редактор
- Autosave тригер: після кожної зміни на таймлайні

---

## R1 — знайти мем за настроєм або емоджі

```mermaid
flowchart TD
    classDef screen  fill:#192233,stroke:#3a6090,color:#90c0f0
    classDef state   fill:#271e0a,stroke:#c07a28,color:#f0a060
    classDef decide  fill:#1c1528,stroke:#6050a0,color:#c0b0f8
    classDef ok      fill:#0a1e0f,stroke:#28a060,color:#50d880
    classDef fail    fill:#22080a,stroke:#903030,color:#f05060

    MP["📱 Мем-пікер"]:::screen -- тапнула Пошук --> SRCH_E["📱 Пошук · empty\nпідказки: 😂 funny wow"]:::screen
    MP -. закрила .-> ED["📱 Редактор"]:::screen

    SRCH_E == ввела запит ==> SRCH_L["⏳ Завантаження · Giphy / Tenor"]:::state
    SRCH_E -. закрила .-> ED

    SRCH_L --> QA{API OK?}:::decide
    QA -. API недоступне .-> SRCH_ERR["🔴 Помилка API"]:::state
    SRCH_ERR --> QAR{Повторити?}:::decide
    QAR == так ==> SRCH_L
    QAR -. ні .-> ED

    QA == відповів ==> QR{Є результати?}:::decide
    QR -. нічого .-> SRCH_NR["⬜ Нічого не знайдено"]:::state
    SRCH_NR -. змінити запит .-> SRCH_E
    SRCH_NR -. закрила .-> ED
    QR == є GIF ==> LIST["📱 Список GIF"]:::screen

    LIST -. інший запит .-> SRCH_E
    LIST -. закрила .-> ED
    LIST == вибрала GIF ==> OK(["✅ R1 виконано — GIF на таймлайні"]):::ok
    LIST -. скрол до кінця .-> LIST_END["⬜ Більше результатів немає"]:::state
    LIST_END -. змінити запит .-> SRCH_E
```

**Стани**
- ⬜ empty — Пошук відкривається порожнім: підказки (😂, funny, wow)
- ⏳ loading — спінер поки Giphy/Tenor відповідає
- ⬜ no results — «нічого не знайдено» + підказка змінити запит
- 🔴 API fail — повідомлення + «Спробувати ще»
- ⬜ LIST_END — «Більше результатів немає»: CTA «Змінити запит» → повернення до поля пошуку

**Виходи**
- Закрила з MP, Пошуку або Списку GIF → повернення до Редактора

**Тупики**
- ✓ виправлено: API Giphy/Tenor недоступне і юзер відмовляється повторювати → `QAR -. ні .-> ED`

---

## R2 — побачити актуальний контент з нуля (cold start)

```mermaid
flowchart TD
    classDef screen  fill:#192233,stroke:#3a6090,color:#90c0f0
    classDef state   fill:#271e0a,stroke:#c07a28,color:#f0a060
    classDef decide  fill:#1c1528,stroke:#6050a0,color:#c0b0f8
    classDef ok      fill:#0a1e0f,stroke:#28a060,color:#50d880
    classDef fail    fill:#22080a,stroke:#903030,color:#f05060
    classDef trigger fill:#180e1a,stroke:#8060c0,color:#c098f0

    S(["▶ Відкрила Мем-пікер"]):::trigger
    GIF["📱 Редактор — GIF на таймлайні"]:::screen

    S ==> MP["📱 Мем-пікер"]:::screen
    MP --> QH{Є нещодавні GIF?}:::decide
    MP -. закрила .-> ED["📱 Редактор"]:::screen
    QH == ні, cold start ==> TREND["📱 Trending"]:::screen
    QH -. є history .-> REC["📱 Нещодавні"]:::screen

    TREND --> QT{Trending завантажився?}:::decide
    TREND -. закрила .-> ED
    QT -. API помилка .-> TREND_E["🔴 Помилка завантаження"]:::state
    TREND_E --> QTR{Повторити?}:::decide
    QTR == так ==> TREND
    QTR -. перейти до пошуку .-> SRCH["📱 Пошук emoji / mood"]:::screen
    QT == OK ==> TREND_L["📱 Trending · список GIF"]:::screen

    TREND_L --> QTG{GIF підходить?}:::decide
    TREND_L -. закрила .-> ED
    QTG -. ні, гортає .-> TREND_L
    QTG == вибрала ==> GIF

    REC --> QRG{Є потрібний GIF?}:::decide
    REC -. закрила .-> ED
    QRG == так ==> GIF
    QRG -. ні .-> TREND

    SRCH --> QSG{GIF знайдено?}:::decide
    SRCH -. закрила .-> ED
    QSG == так ==> GIF
    QSG -. ні .-> ED

    GIF ==> DONE(["✅ R2 виконано"]):::ok
```

**Стани**
- cold start — Trending відкривається auto якщо history = 0
- ⏳ loading — Trending: скелетон поки API відповідає
- 🔴 error — «не вдалось завантажити» + «Повторити» + лінк на Пошук

**Тупики**
- ✓ виправлено: API Giphy/Tenor повністю недоступне — Trending і Пошук не працюють → `QSG -. ні .-> ED`

---

## R3 — вставити мем не виходячи з монтажу

```mermaid
flowchart TD
    classDef screen  fill:#192233,stroke:#3a6090,color:#90c0f0
    classDef state   fill:#271e0a,stroke:#c07a28,color:#f0a060
    classDef decide  fill:#1c1528,stroke:#6050a0,color:#c0b0f8
    classDef ok      fill:#0a1e0f,stroke:#28a060,color:#50d880
    classDef fail    fill:#22080a,stroke:#903030,color:#f05060
    classDef warn    fill:#201a0a,stroke:#a08020,color:#f0d060

    ED["📱 Редактор · монтаж в процесі"]:::screen --> QC{Є кліп?}:::decide
    QC -. ні .-> DIS["⬜ Редактор\nДодати мем — disabled"]:::state
    DIS -. додала відео .-> ED

    QC == є кліп ==> ADD["📱 Мем-пікер відкривається"]:::screen

    ADD --> QBS{Відкрився як bottom sheet?}:::decide
    QBS -. ні, відкрився на весь екран .-> FAIL["⚠ Порушення R3\nтаймлайн і прев'ю приховані"]:::warn
    FAIL -. закрити .-> ED

    QBS == так, таймлайн видно ==> MP["📱 Мем-пікер · bottom sheet"]:::screen
    MP --> QG{GIF вибрано?}:::decide
    QG -. закрила без вибору .-> ED
    QG == вибрала GIF ==> OVL_L["⏳ Завантаження GIF з CDN"]:::state
    OVL_L --> QOVL{CDN OK?}:::decide
    QOVL == завантажено ==> OVL["📱 Редактор — GIF як оверлей"]:::screen
    QOVL -. помилка CDN .-> CDN_E["🔴 Не вдалось завантажити GIF"]:::state
    CDN_E -. повторити .-> OVL_L
    CDN_E -. інший GIF .-> MP
    OVL -. видалити .-> ED
    OVL -. замінити .-> MP
    OVL --> QP{Позиція ок?}:::decide
    QP -. переміщує .-> OVL
    QP == задоволена ==> DONE(["✅ R3 виконано\nмем додано без зміни екрану"]):::ok
```

**Стани**
- [Додати мем] disabled — таймлайн порожній
- Мем-пікер як bottom sheet — таймлайн і прев'ю залишаються видимими
- ⏳ loading — Завантаження GIF з CDN: спінер на Canvas поки буфер готовий
- 🔴 error — Помилка CDN: «Не вдалось завантажити GIF» + retry + «вибрати інший»
- start_time = позиція playhead у момент натискання «Додати мем»
- ⚠ порушення R3 — fullscreen overlay: юзер не бачить куди вставляє мем

**Тупики**
- ✓ виправлено: Fullscreen overlay замість bottom sheet — юзер може закрити overlay і повернутись до Редактора → `FAIL -. закрити .-> ED`

---

## R4 — повторно знайти мем без нового пошуку

```mermaid
flowchart TD
    classDef screen  fill:#192233,stroke:#3a6090,color:#90c0f0
    classDef state   fill:#271e0a,stroke:#c07a28,color:#f0a060
    classDef decide  fill:#1c1528,stroke:#6050a0,color:#c0b0f8
    classDef ok      fill:#0a1e0f,stroke:#28a060,color:#50d880
    classDef fail    fill:#22080a,stroke:#903030,color:#f05060

    ED["📱 Редактор"]:::screen == тапнула Додати мем ==> MP["📱 Мем-пікер"]:::screen

    MP --> QH{Default таб?}:::decide
    MP -. закрила .-> ED
    QH -. немає + cold start .-> TREND["📱 Trending"]:::screen
    QH == є (відновлення або history ≥ 1) ==> REC["📱 Нещодавні"]:::screen

    REC --> QR{Потрібний GIF є?}:::decide
    REC -. закрила .-> ED
    QR == так, знайшла без пошуку ==> GIF["📱 Редактор — GIF на таймлайні"]:::screen
    GIF ==> DONE(["✅ R4 виконано · без нового пошуку"]):::ok

    QR -. ні — кеш не містить .-> QW{Де шукає далі?}:::decide
    QW -. шукає заново .-> SRCH["📱 Пошук emoji / mood"]:::screen
    QW -. переходить до Trending .-> TREND

    TREND --> QTG{GIF підходить?}:::decide
    TREND -. закрила .-> ED
    QTG == так ==> GIF
    QTG -. ні .-> DEAD(["💀 R4 не виконано\nкеш очищено або GIF видалено"]):::fail
    DEAD -. закрити без вибору .-> ED

    SRCH --> QSG{GIF знайдено?}:::decide
    SRCH -. закрила .-> ED
    QSG == так ==> GIF
    QSG -. ні .-> DEAD
```

**Стани**
- Нещодавні — default якщо history > 0 або є збережений таб
- Trending — default якщо cold start і немає збереженого таба
- Кеш Нещодавніх — IndexedDB, зникає при очищенні браузера

**Тупики**
- ✓ виправлено: Кеш браузера очищено або GIF видалений з Giphy/Tenor — R4 не виконується → `DEAD -. закрити без вибору .-> ED`

**Примітки**
- Default таб: (1) є останній відкритий таб → відновити (localStorage); (2) немає + history > 0 → Нещодавні; (3) cold start → Trending
- R1 і R4 конкурують за default — «останній таб» вирішує без жертви жодним

---

## R5 — зберегти у правильному форматі платформи

```mermaid
flowchart TD
    classDef screen  fill:#192233,stroke:#3a6090,color:#90c0f0
    classDef state   fill:#271e0a,stroke:#c07a28,color:#f0a060
    classDef decide  fill:#1c1528,stroke:#6050a0,color:#c0b0f8
    classDef ok      fill:#0a1e0f,stroke:#28a060,color:#50d880
    classDef fail    fill:#22080a,stroke:#903030,color:#f05060

    REND["⏳ Рендер WebCodecs"]:::state

    ED["📱 Редактор"]:::screen -- тапнула Експорт --> QC{Є кліп?}:::decide
    QC == є ==> EXP["📱 Екран експорту"]:::screen
    QC -. ні .-> DIS["⬜ Редактор\nЕкспорт — disabled"]:::state
    DIS -. додала кліп .-> ED

    EXP --> QF{Формат?}:::decide
    QF == 9-16 · 1-1 ==> CROP_PREV["👁 Попередній перегляд кадрування"]:::screen
    QF -. 16-9 поза MVP .-> NA["⬜ Підказка: 16:9 не підтримується"]:::state
    NA -. вибрати інший .-> EXP

    CROP_PREV == виглядає добре ==> REND
    CROP_PREV -. змінити формат .-> EXP
    REND -. скасувати .-> EXP
    REND --> QWC{Browser підтримує WebCodecs?}:::decide
    QWC == так ==> QR{Рендер OK?}:::decide
    QWC -. ні .-> FB["⏳ Fallback рендер"]:::state

    QR == OK ==> SHARE["📤 Поділитись / завершити"]:::screen
    QR -. збій .-> RE["🔴 Помилка рендеру"]:::state
    RE --> QRT{Повторити?}:::decide
    QRT == так ==> REND
    QRT -. ні .-> ED

    FB --> QFB{Fallback OK?}:::decide
    QFB == так ==> SHARE
    QFB -. ні .-> DEAD(["💀 Старий браузер\nвідео не можна зберегти"]):::fail
    DEAD -. до Редактора .-> ED

    SHARE == поділитись ==> DONE(["✅ R5 виконано\nзняв → мем → виклав ✓"]):::ok
    SHARE -. до списку проектів .-> PL["📱 Список проектів"]:::screen
    SHARE -. новий проект .-> IMP["📱 Вибір відео"]:::screen
```

**Стани**
- [Експорт] disabled поки немає кліпу
- 9:16 pre-selected — більшість контенту вертикаль
- 16:9 поза MVP — підказка пояснює, не ховаємо мовчки
- 👁 preview — Попередній перегляд кадрування: перший кадр у обраному форматі + зсув вертикального кадру
- ⏳ progress — видима смуга або % під час рендеру
- 📤 share — Поділитись / завершити: system share sheet · до списку проектів · новий проект

**Тупики**
- ✓ виправлено: Рендер зависає без опції виходу → `REND -. скасувати .-> EXP`
- ✓ виправлено: Старий браузер без WebCodecs — відео не зберігається, але юзер може повернутись до Редактора → `DEAD -. до Редактора .-> ED`
