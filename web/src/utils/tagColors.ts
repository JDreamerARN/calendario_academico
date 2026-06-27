export const DEFAULT_EVENT_COLOR = '#1976d2';

export const getTagColor = (tag: string): { bg: string; text: string } => {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return {
    bg: `hsl(${hue}, 70%, 90%)`,
    text: `hsl(${hue}, 70%, 30%)`,
  };
};

export const getContrastTextColor = (hexColor: string): string => {
  const hex = hexColor.replace('#', '');
  if (hex.length !== 6) return '#ffffff';
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? '#1a1a1a' : '#ffffff';
};

export const getEventDisplayColors = (color?: string) => {
  const bg = color || DEFAULT_EVENT_COLOR;
  return { bg, text: getContrastTextColor(bg) };
};
