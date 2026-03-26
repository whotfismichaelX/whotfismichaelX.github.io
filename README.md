# Арабский Михаил — Product Manager Portfolio

Личный 3D-портфолио сайт Михаила Арабского. Product Manager с опытом запуска B2B SaaS продуктов с нуля.

**Демо:** [michaelpm.ru](https://michaelpm.ru)

## Технологии

- **Next.js 15** — фреймворк для React с SSR и статической генерацией
- **React 19** — библиотека для построения UI
- **React Three Fiber + DREI** — 3D-сцена с управлением камерой по скроллу
- **GSAP** — анимации
- **Zustand** — управление состоянием (portalStore, scrollStore, themeStore)
- **Tailwind CSS** — стилизация
- **TypeScript** — типизация

## Требования

- Node.js 18+

## Установка

```bash
npm install
```

## Разработка

```bash
npm run dev
```

Открывается на [localhost:3000](http://localhost:3000).

## Сборка

```bash
npm run build
```

## Линтинг

```bash
npm run lint
```

## Переменные окружения

Для настройки Google Analytics создайте файл `.env.local` на основе `.env.example`.

| Переменная | Описание | Обязательная |
|---|---|---|
| `GA_MEASUREMENT_ID` | Measurement ID для Google Analytics (формат: `G-XXXXXXXXXX`) | Нет |
