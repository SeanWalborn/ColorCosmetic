import { developmentColors, type DevelopmentColor } from './dashboard';
import { hexToRgb } from '../utils/color';
export interface ColorVariation { id: string; product: string; hex: string; formula: string; supplier: string; factory: string; observation: string; }
export interface ColorNote { id: string; author: string; role: string; date: string; text: string; }
const seedIds = new Set(developmentColors.map(color => color.id));
function tint(hex: string, shift: number) {
  return '#' + hexToRgb(hex).map(value => Math.max(0,Math.min(255,value + shift)).toString(16).padStart(2,'0')).join('').toUpperCase();
}
export function getColorDetails(color: DevelopmentColor) {
  // Formulation studies are mock lab records for the seeded references only.
  const isSeed = seedIds.has(color.id);
  const variations: ColorVariation[] = isSeed ? [
    { id: 'lipstick', product: 'Lipstick', hex: tint(color.hex,-5), formula: 'Satin Lip · SL-204', supplier: 'Milano Color Labs', factory: 'Crema, Italy · MCL-02', observation: 'Opaque wax base gives a deeper, more saturated appearance.' },
    { id: 'gloss', product: 'Lip gloss', hex: tint(color.hex,20), formula: 'Glass Shine · GS-118', supplier: 'Seoul Pigment Studio', factory: 'Incheon, South Korea · SPS-03', observation: 'Translucent gel base softens the shade; assess over a neutral substrate.' },
    { id: 'powder', product: 'Powder', hex: tint(color.hex,12), formula: 'Soft Press · SP-106', supplier: 'Lyon Formulation', factory: 'Lyon, France · LF-01', observation: 'Light-scattering fillers create a lighter, diffused finish.' },
    { id: 'cream', product: 'Cream', hex: tint(color.hex,-12), formula: 'Cream Cloud · CC-210', supplier: 'Milano Color Labs', factory: 'Crema, Italy · MCL-02', observation: 'Emollient base deepens the shade in the pan; check the blended drawdown.' },
  ] : [];
  const notes: ColorNote[] = isSeed ? [
    { id: 'lab-note', author: 'Maya Patel', role: 'Formulation specialist', date: color.updatedAt, text: `Use ${color.id} as the intended color reference when requesting supplier samples. Compare a controlled drawdown under D65 lighting; the bulk sample and applied finish can differ.` },
    { id: 'quality-note', author: 'Alex Morgan', role: 'Product development lead', date: new Date(Date.parse(color.updatedAt)-86400000).toISOString(), text: `Request a retained sample and batch record from ${color.factory.split(' · ')[0]} before scale-up. Approval of the reference does not automatically approve every formulation variation.` },
  ] : [];
  return { variations, notes, isSeed };
}
