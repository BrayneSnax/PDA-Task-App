import { useColorScheme as useRNColorScheme } from 'react-native';
import { ColorScheme, ContainerId } from '../constants/Types';
import { CircadianColors, LightColors, DarkColors } from '../constants/Colors';

/**
 * Get colors based on container and system theme
 * Supports circadian color shifting
 */
export function useColors(
  activeContainer?: ContainerId,
  useCircadian: boolean = true
): ColorScheme {
  const systemTheme = useRNColorScheme();
  
  // If circadian mode is enabled and we have an active container, use circadian colors
  if (useCircadian && activeContainer) {
    return CircadianColors[activeContainer];
  }
  
  // Otherwise fall back to light/dark mode
  return systemTheme === 'dark' ? DarkColors : LightColors;
}

