export const T = {
  bone: '#FAFAFA',
  white: '#FFFFFF',
  ink: '#1D1E20',
  inkDeep: '#0D0515',
  grey90: '#1E1E1E',
  grey60: '#6D6D6D',
  grey40: '#C4C4C4',
  grey30: '#DADADA',
  grey20: '#F0F0F0',
  grey10: '#F3F3F3',
  green: '#81A13F',
  greenLight: '#95BF46',
  greenDeep: '#5E8E3E',
  red: '#B23A3A',

  fontDisplay: "'Thunder', 'Bebas Neue', 'Oswald', sans-serif",
  fontBody: "'TWK Everett', 'Inter', system-ui, sans-serif",
  fontEditorial: "'PP Editorial New', 'Cormorant Garamond', Georgia, serif",
};

export function buildTheme(tw) {
  const dark = tw.surface === 'dark';
  return {
    ...T,
    dark,
    bg: dark ? T.ink : T.bone,
    surface: dark ? T.grey90 : T.white,
    surfaceAlt: dark ? '#141517' : T.grey10,
    fg1: dark ? T.bone : T.ink,
    fg2: dark ? 'rgba(250,250,250,0.65)' : T.grey60,
    fg3: dark ? 'rgba(250,250,250,0.4)' : 'rgba(13,5,21,0.5)',
    border: dark ? 'rgba(250,250,250,0.18)' : 'rgba(13,5,21,0.18)',
    borderStrong: dark ? 'rgba(250,250,250,0.35)' : 'rgba(13,5,21,0.35)',
    accent: T.green,
    pad: tw.density === 'compact' ? 16 : tw.density === 'spacious' ? 32 : 24,
    gap: tw.density === 'compact' ? 8 : tw.density === 'spacious' ? 20 : 12,
    cardPad: tw.density === 'compact' ? 18 : tw.density === 'spacious' ? 32 : 24,
    rowGap: tw.density === 'compact' ? 12 : tw.density === 'spacious' ? 24 : 16,
  };
}
