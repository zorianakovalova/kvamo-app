import { Image } from 'expo-image';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Text } from '@/components/Text';
import type { Folder, Material } from '@/data/library';
import { colors } from '@/theme/tokens';
import { STICKERS, type StickerName } from './stickers';

const FOLDER_BACK = 'M0 17.0333C0 7.6285 6.27 0 14 0H58C63 0 66 2.43333 69 7.3L74 14.6C76 18.25 79 19.4667 83 19.4667H158C165.73 19.4667 172 27.0952 172 36.5V146H0V17.0333Z';
/** Preview cards on a folder: left, top and rotation from Figma. */
const PREVIEWS = [
  [16, 22, '-9deg'],
  [58, 12, '2deg'],
  [100, 22, '9deg'],
] as const;

/** Sticker clipped into a white card with a 2 px border, as in the Figma "Preview" frames. */
export function Sticker({ name, w, h, r, rotate, raised, style }: { name: StickerName; w: number; h: number; r: number; rotate?: string; raised?: boolean; style?: object }) {
  return (
    <View style={[{ width: w, height: h, borderRadius: r }, raised ? styles.raised : null, rotate ? { transform: [{ rotate }] } : null, style]}>
      <View style={[{ flex: 1, borderRadius: r, borderWidth: 2, borderColor: raised ? '#fff' : '#f7f9f7', backgroundColor: '#fff', overflow: 'hidden' }]}>
        <Image source={STICKERS[name]} style={{ position: 'absolute', left: (w - h) / 2 - 2, top: -2, width: h, height: h }} contentFit="cover" />
      </View>
    </View>
  );
}

/** Folder card (172×146): coloured back with a tab, three tilted previews and a glass front with the name. */
export function FolderCard({ folder, count, onPress }: { folder: Folder; count: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${folder.title}, ${count}`} style={({ pressed }) => [styles.folder, pressed && { opacity: 0.9 }]}>
      <Svg width="100%" height={146} viewBox="0 0 172 146" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
        <Path d={FOLDER_BACK} fill={folder.color} />
      </Svg>
      {PREVIEWS.map(([left, top, rotate], i) => (
        <Sticker key={i} name={folder.stickers[i]} w={56} h={64} r={10} rotate={rotate} style={{ position: 'absolute', left, top }} />
      ))}
      <View style={[styles.front, styles.glass, styles.glassFx, { backgroundColor: folder.glass + '33' }]} />
      <View style={[styles.front, styles.frontText]}>
        <Text variant="display16" color={colors.textInverse} numberOfLines={1}>
          {folder.title}
        </Text>
        <Text variant="captionStrong" color={colors.textInverse}>
          {count}
        </Text>
      </View>
    </Pressable>
  );
}

/** Small folder icon next to the folder screen title (36×30). */
export function FolderIcon({ folder }: { folder: Folder }) {
  return (
    <View style={{ width: 36, height: 30 }}>
      <Svg width={36} height={28} viewBox="0 0 172 146" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
        <Path d={FOLDER_BACK} fill={folder.color} />
      </Svg>
      <View style={{ position: 'absolute', left: 6, top: 6, width: 24, height: 14, borderRadius: 3, backgroundColor: '#fff' }} />
      <View style={{ position: 'absolute', left: 0, top: 10, width: 36, height: 20, borderRadius: 5, backgroundColor: folder.glass }} />
    </View>
  );
}

/** Material tile inside a folder: title, subtitle and one or two stickers peeking from the bottom right. */
export function MaterialTile({ material, stickers, onPress }: { material: Material; stickers: StickerName[]; onPress: () => void }) {
  const sub = material.subtitle ?? (material.minutes ? `${material.minutes} хв` : undefined);
  // Figma "Tile": 175×174, previews 48×48 tilted -6° / 6° in the bottom right corner.
  const pos = stickers.length > 1 ? [{ right: 49, bottom: 19, rotate: '-6deg' }, { right: 15, bottom: 10, rotate: '6deg' }] : [{ right: 15, bottom: 10, rotate: '6deg' }];
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={sub ? `${material.title}. ${sub}` : material.title} style={({ pressed }) => [styles.tile, pressed && { opacity: 0.85 }]}>
      <Text variant="text16Strong">{material.title}</Text>
      {sub ? (
        <Text variant="text14" color={colors.textSecondary}>
          {sub}
        </Text>
      ) : null}
      {stickers.slice(0, 2).map((name, i) => (
        <Sticker key={name} raised name={name} w={48} h={48} r={12} rotate={pos[i].rotate} style={{ position: 'absolute', right: pos[i].right, bottom: pos[i].bottom }} />
      ))}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  /** Figma "Preview" on a material tile: white 2 px edge and a 0 2 6 shadow at 10%. */
  raised: { backgroundColor: '#fff', shadowColor: '#0b100d', shadowOpacity: 0.1, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  folder: { flex: 1, height: 146, borderRadius: 16, overflow: 'hidden' },
  /** Figma "Glass" (blur 3) over the lower half of the previews. */
  glass: { borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.55)' },
  glassFx: Platform.select({ web: { backdropFilter: 'blur(1.5px)' } as object, default: {} }),
  front: { position: 'absolute', left: 0, right: 0, top: 50, height: 96, borderRadius: 16, overflow: 'hidden' },
  frontText: { padding: 12, gap: 2, justifyContent: 'flex-end' },
  tile: { flex: 1, height: 174, backgroundColor: '#fff', borderRadius: 16, padding: 12, gap: 4 },
});
