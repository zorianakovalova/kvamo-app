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
    onboarding/        заставка, привітання, вхід, тест, мета, час, твій шлях
    account/           стрик, збереження прогресу, телефон, email, код, нагадування
  components/          компоненти дизайн-системи (Text, Button, Card, Icon, TabBar…)
    path/              кубики Шляху, банер модуля, зірки
  data/modules.ts      модулі й заняття
  store/progress.tsx   прогрес, зірки і серія днів (AsyncStorage, лише на пристрої)
  store/profile.tsx    відповіді онбордингу, акаунт (поки демо), нагадування
  theme/tokens.ts      кольори, шрифти, відступи, радіуси з Figma
```

Шрифти: Unbounded (заголовки) і системний шрифт (SF Pro на iPhone), як у Figma.
Ілюстрації жабки експортовано з Figma в assets/img.

## Перегляд в Expo Go

Застосунок опубліковано через EAS Update (гілка `main`, канал `main`).
Відкрийте в Expo Go (SDK 58) посилання:

```
exp://u.expo.dev/2d9a1b9d-447d-4d07-9221-beb67ae2ccfc?channel-name=main
```

Щоб опублікувати нову версію: `npm run publish:expo-go -- --message "Опис змін"` (потрібен `EXPO_TOKEN`).
