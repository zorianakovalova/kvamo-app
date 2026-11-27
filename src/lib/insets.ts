import { Platform } from 'react-native';
import { useSafeAreaInsets as useRawInsets } from 'react-native-safe-area-context';

/** Web has no status bar or home indicator in the viewport, so keep Figma-like breathing room at the top and bottom. */
const WEB_MIN = { top: 16, bottom: 20 };

export function useSafeAreaInsets() {
  const i = useRawInsets();
  if (Platform.OS !== 'web') return i;
  return { ...i, top: Math.max(i.top, WEB_MIN.top), bottom: Math.max(i.bottom, WEB_MIN.bottom) };
}
