import { useColorScheme as useRNColorScheme } from 'react-native';
import { ColorScheme, ContainerId } from '../constants/Types';
import { CircadianColors, LightColors, DarkColors } from '../constants/Colors';

export function useColors(
  activeContainer?: ContainerId,
  useCircadian: boolean = true
): ColorScheme {
  const systemTheme = useRNColorScheme();
  
  if (useCircadian && activeContainer && CircadianColors[activeContainer]) {
    return CircadianColors[activeContainer];
  }
  
  return systemTheme === 'dark' ? DarkColors : LightColors;
}
