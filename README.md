# Квамо

Мобільний застосунок для навчання фінансової грамотності (магістерська робота).
React Native + Expo (SDK 58) + TypeScript, навігація на Expo Router.

## Як відкрити на телефоні

1. Встанови **Expo Go** з App Store або Google Play.
2. Відскануй QR-код опублікованого оновлення (EAS Update) камерою (iPhone) або в Expo Go (Android).

## Розробка

```bash
npm install
npx expo start        # QR-код для Expo Go в локальній мережі
npm run typecheck
```

## Структура

```
src/
  app/                 маршрути Expo Router
    (tabs)/            Шлях, Бібліотека, Профіль
    lesson/[id].tsx    екран заняття
  components/          компоненти дизайн-системи (Text, Button, Card, Icon, TabBar…)
    path/              кубики Шляху, банер модуля, зірки
  data/modules.ts      модулі й заняття
  store/progress.tsx   прогрес, зірки і серія днів (AsyncStorage, лише на пристрої)
  theme/tokens.ts      кольори, шрифти, відступи, радіуси з Figma
```

Шрифти: Unbounded (заголовки) і Onest (текст).
