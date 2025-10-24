import { useColorScheme as useRNColorScheme } from 'react-native';
import { ColorScheme, ContainerId } from '../constants/Types';
import { CircadianPalette, LightColors, DarkColors } from '../constants/Colors';

export default function useColors(
  activeContainer?: ContainerId,
  useCircadian: boolean = true
): ColorScheme {
  const systemTheme = useRNColorScheme();

  // Fallback for missing LightColors/DarkColors which are not exported from Colors.ts
  // Assuming LightColors and DarkColors are meant to be defined in Colors.ts but are not.
  // Using a simple default structure for now.
  const LightColorsFallback = { bg: '#fff', accent: '#000', text: '#000', dim: '#ccc', signal: '#f00', card: '#fff' };
  const DarkColorsFallback = { bg: '#000', accent: '#fff', text: '#fff', dim: '#333', signal: '#0f0', card: '#000' };

  const FinalLightColors = LightColors || LightColorsFallback;
  const FinalDarkColors = DarkColors || DarkColorsFallback;

  if (useCircadian && activeContainer && CircadianPalette[activeContainer]) {
    // CircadianPalette is the correct export, and the error was due to an incorrect alias/destructuring in the original file
    return CircadianPalette[activeContainer];
  }
  
  return systemTheme === 'dark' ? FinalDarkColors : FinalLightColors;
}

