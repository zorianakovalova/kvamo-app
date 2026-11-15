import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

/** Canvas gradient from Figma: 110° #CBE9DD → #DDF1E5 → #E9F5DF → #F0F6D3. */
export function GradientBackground() {
  return (
    <LinearGradient
      pointerEvents="none"
      colors={['#cbe9dd', '#ddf1e5', '#e9f5df', '#f0f6d3']}
      start={{ x: -0.29, y: 0.37 }}
      end={{ x: 1.29, y: 0.63 }}
      style={StyleSheet.absoluteFill}
    />
  );
}
