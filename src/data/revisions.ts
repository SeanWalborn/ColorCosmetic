import type { DevelopmentColor } from './dashboard';
import { hexToRgb } from '../utils/color';
export interface ColorRevision {
  number: number;
  date: string;
  author: string;
  title: string;
  supplier: string;
  factory: string;
  formula: string;
  hex: string;
  notes: string;
  status: DevelopmentColor['status'];
}
export type RevisionInput = Pick<ColorRevision, 'title' | 'supplier' | 'factory' | 'formula' | 'hex' | 'notes' | 'status'>;
export function initialRevision(color: DevelopmentColor, author = 'Alex Morgan'): ColorRevision {
  return { number: 1, date: color.updatedAt, author, title: 'Initial Sample', supplier: color.supplier, factory: color.factory, formula: color.formula, hex: color.hex, notes: 'Created the initial color reference for supplier evaluation.', status: color.status };
}
export function seedRevisions(color: DevelopmentColor): ColorRevision[] {
  return Array.from({length:color.revision},(_,index) => {
    const number = index+1;
    const current = number === color.revision;
    const offset = color.revision-number;
    const rgb = hexToRgb(color.hex).map((channel,i) => Math.min(255,Math.max(0,channel + offset*(i === 0 ? -5 : 4))));
    const hex = current ? color.hex : '#' + rgb.map(channel=>channel.toString(16).padStart(2,'0')).join('').toUpperCase();
    return {
      number, date: new Date(Date.parse(color.updatedAt)-offset*3*86400000).toISOString(), author: current && color.status === 'Approved' ? 'Alex Morgan' : current && color.status === 'Awaiting approval' ? 'Maya Patel' : number === 1 ? 'Maya Patel' : 'Alex Morgan',
      title: current && color.status === 'Approved' ? 'Approved Production Color' : number === 1 ? 'Initial Sample' : number === 2 ? 'Increased red pigment' : number === 3 ? 'Reduced saturation' : 'Submitted for shade approval',
      supplier: !current && number === 1 ? 'Lyon Formulation' : color.supplier,
      factory: !current && number === 1 ? 'Lyon, France · LF-01' : color.factory,
      formula: !current ? `${color.formula} / Trial ${String(number).padStart(2,'0')}` : color.formula,
      hex,
      notes: current && color.status === 'Approved' ? 'Approved the retained lab drawdown as the production reference. Match this revision when requesting manufacturing samples.' : number === 1 ? 'Initial lab drawdown established under D65 lighting. Retain a physical sample for formulation and supplier comparisons.' : number === 2 ? 'Increased red pigment to correct the cool undertone observed in the initial sample. Request a fresh drawdown from the manufacturing partner.' : number === 3 ? 'Reduced saturation for a softer applied finish. Recheck the sample after a 24-hour settling period.' : 'Submitted the refined pigment blend and retained sample for shade approval. Supplier confirmation is pending.',
      status: current ? color.status : 'In development',
    };
  });
}
