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

export const getEventColor = (tags: string[]): { bg: string; text: string } => {
  if (!tags || tags.length === 0) {
    return { bg: '#f5f5f5', text: '#333' };
  }
  return getTagColor(tags[0]);
};
