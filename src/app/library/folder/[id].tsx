import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from '@/lib/insets';

import { Icon } from '@/components/Icon';
import { FolderIcon, MaterialTile } from '@/components/library/Folders';
import { SearchField, useMaterialOpener } from '@/components/library/LibraryUI';
import { TabBarView } from '@/components/TabBar';
import { Text } from '@/components/Text';
import { FOLDERS, MATERIALS, MATERIAL_STICKERS, findMaterial, folderItems, type Material } from '@/data/library';
import { useSaved } from '@/store/saved';
import { colors, space } from '@/theme/tokens';

const norm = (s: string) => s.toLowerCase().replace(/[’ʼ']/g, '');

/** 06 Бібліотека / Папка: back, folder title, search and a two-column grid of materials. */
export default function FolderScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const saved = useSaved();
  const [query, setQuery] = useState('');
  const { open, overlay } = useMaterialOpener(insets.bottom + 24);
  const folder = FOLDERS.find((f) => f.id === id);
  const isSaved = id === 'saved';
  const all: Material[] = isSaved ? saved.map((x) => findMaterial(x)).filter((m): m is Material => !!m) : folder ? folderItems(folder) : MATERIALS;
  const q = norm(query.trim());
  const items = q ? all.filter((m) => norm(`${m.title} ${m.subtitle ?? ''} ${m.keywords ?? ''}`).includes(q)) : all;
  const rows: Material[][] = [];
  for (let i = 0; i < items.length; i += 2) rows.push(items.slice(i, i + 2));
  const back = () => (router.canGoBack() ? router.back() : router.replace('/library'));

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 110 + insets.bottom }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.nav}>
          <Pressable onPress={back} accessibilityRole="button" accessibilityLabel="Назад" hitSlop={8} style={styles.back}>
            <Icon name="chevronLeft" size={24} strokeWidth={1.6} />
          </Pressable>
        </View>
        <View style={styles.title}>
          {folder ? <FolderIcon folder={folder} /> : <Icon name="bookmark" size={28} />}
          <Text variant="screenTitle" accessibilityRole="header" style={{ flexShrink: 1 }} numberOfLines={1}>
            {folder?.title ?? 'Збережене'}
          </Text>
        </View>
        <View style={styles.body}>
          {all.length ? <SearchField value={query} onChangeText={setQuery} placeholder="Пошук: кешбек, ОВДП, подушка…" style={{ marginHorizontal: space.lg }} /> : null}
          {items.length ? (
            <View style={styles.grid}>
              {rows.map((row, i) => (
                <View key={i} style={styles.row}>
                  {row.map((m) => (
                    <MaterialTile key={m.id} material={m} stickers={MATERIAL_STICKERS[m.id] ?? folder?.stickers.slice(0, 1) ?? ['bookmark']} onPress={() => open(m)} />
                  ))}
                  {row.length === 1 ? <View style={{ flex: 1 }} /> : null}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.empty}>
              <Text variant="text16Strong" style={{ textAlign: 'center' }}>
                {q ? 'Нічого не знайдено' : isSaved ? 'Тут поки порожньо' : 'Ще готуємо'}
              </Text>
              <Text variant="text14" color={colors.textSecondary} style={{ textAlign: 'center' }}>
                {q ? 'Спробуй інше слово.' : isSaved ? 'Зберігай матеріали закладкою, щоб повернутися до них.' : 'Реальні історії про гроші зʼявляться тут незабаром.'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <TabBarView
        tabs={[
          { key: 'index', name: 'index', focused: false },
          { key: 'library', name: 'library', focused: true },
          { key: 'profile', name: 'profile', focused: false },
        ]}
        onSelect={(k) => router.dismissTo(k === 'index' ? '/' : (`/${k}` as '/library'))}
      />
      {overlay}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.backgroundTertiary },
  nav: { height: 52, justifyContent: 'center', paddingHorizontal: space.lg },
  back: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.borderGlass, alignItems: 'center', justifyContent: 'center' },
  title: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingLeft: space.xl, paddingRight: space.lg, paddingVertical: space.md },
  body: { paddingTop: space.md, gap: space.lg },
  grid: { paddingHorizontal: space.lg, gap: space.md },
  row: { flexDirection: 'row', gap: space.md },
  empty: { marginHorizontal: space.lg, padding: space.xxl, gap: space.sm, borderRadius: 16, backgroundColor: '#fff' },
});
