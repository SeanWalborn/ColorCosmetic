export function normalizeHex(value: string): string | null {
  const raw = value.trim().replace(/^#/, '');
  if (/^[\da-f]{3}$/i.test(raw)) return `#${raw.split('').map(part => part + part).join('').toUpperCase()}`;
  return /^[\da-f]{6}$/i.test(raw) ? `#${raw.toUpperCase()}` : null;
}
export function hexToRgb(hex: string): [number, number, number] {
  return [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
}
export function rgbToHex(values: string[]): string | null {
  if (values.length !== 3 || values.some(value => !/^\d{1,3}$/.test(value) || Number(value) > 255)) return null;
  return `#${values.map(value => Number(value).toString(16).padStart(2,'0')).join('').toUpperCase()}`;
}
