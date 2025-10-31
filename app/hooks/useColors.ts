import { useColorScheme as useRNColorScheme } from 'react-native';
import { ColorScheme, ContainerId } from '../constants/Types';
import { CircadianPalette, ScreenPalettes } from '../constants/Colors';

type ScreenType = 'home' | 'substances' | 'patterns' | 'nourish' | 'archetypes';

export default function useColors(
  activeContainer?: ContainerId,
  useCircadian: boolean = true,
  screenType?: ScreenType
): ColorScheme {
  const systemTheme = useRNColorScheme();

  // Fallback colors
  const LightColorsFallback = { 
    bg: '#fff', 
    accent: '#000', 
    text: '#000', 
    dim: '#ccc', 
    signal: '#f00', 
    card: '#fff' 
  };
  const DarkColorsFallback = { 
    bg: '#000', 
    accent: '#fff', 
    text: '#fff', 
    dim: '#333', 
    signal: '#0f0', 
    card: '#000' 
  };

  // If screen-specific palette is requested, use it
  if (screenType && screenType !== 'home' && ScreenPalettes[screenType]) {
    return ScreenPalettes[screenType];
  }

  // Otherwise use circadian palette for home screen
  if (useCircadian && activeContainer && CircadianPalette[activeContainer]) {
    return CircadianPalette[activeContainer];
  }
  
  return systemTheme === 'dark' ? DarkColorsFallback : LightColorsFallback;
}
