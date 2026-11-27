import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FolderCard } from '@/components/library/Folders';
import { SearchField } from '@/components/library/LibraryUI';
import { Text } from '@/components/Text';
import { FOLDERS, TERMS, folderItems, plural, type Folder } from '@/data/library';
import { colors, space } from '@/theme/tokens';

const countLabel = (f: Folder) => {
  const n = f.id === 'terms' ? TERMS.length : folderItems(f).length;
  return n ? `${n} ${plural(n, ...f.forms)}` : 'Скоро';
};

/** 01 Бібліотека / Головна · Папки: search and six folders. */
export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const openFolder = (f: Folder) => (f.id === 'terms' ? router.push('/library/glossary') : router.push({ pathname: '/library/folder/[id]', params: { id: f.id } }));
  const rows = [FOLDERS.slice(0, 2), FOLDERS.slice(2, 4), FOLDERS.slice(4, 6)];

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 110 + insets.bottom }} showsVerticalScrollIndicator={false}>
        <View style={styles.title}>
          <Text variant="screenTitle" accessibilityRole="header">
            Бібліотека
          </Text>
        </View>
        <View style={styles.body}>
          <SearchField onPress={() => router.push('/library/search')} style={{ marginHorizontal: space.lg }} />
          <View style={styles.grid}>
            {rows.map((row, i) => (
              <View key={i} style={styles.row}>
                {row.map((f) => (
                  <FolderCard key={f.id} folder={f} count={countLabel(f)} onPress={() => openFolder(f)} />
                ))}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.backgroundTertiary },
  title: { height: 64, justifyContent: 'center', paddingHorizontal: space.xl },
  body: { paddingTop: space.sm, gap: space.xxl },
  grid: { paddingHorizontal: space.lg, gap: space.xl },
  row: { flexDirection: 'row', gap: space.lg },
});
