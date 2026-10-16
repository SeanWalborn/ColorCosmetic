export const projectStatuses = ['Development', 'Review', 'Approved', 'Production'] as const;
export type ProjectStatus = typeof projectStatuses[number];
export interface DevelopmentProject {
  id: string;
  name: string;
  category: string;
  status: ProjectStatus;
  description: string;
  company: string;
  createdAt: string;
  members: string[];
  updatedAt: string;
}
export type ProjectInput = Pick<DevelopmentProject, 'name' | 'description' | 'company' | 'category' | 'status' | 'members'>;
export const productTypes = ['Lipstick', 'Foundation', 'Blush', 'Eyeshadow', 'Eyeliner'] as const;
export const approvalStatuses = ['In development', 'Awaiting approval', 'Approved'] as const;
export interface DevelopmentColor {
  company: string;
  productType: string;
  supplier: string;
  factory: string;
  formula: string;
  id: string;
  name: string;
  hex: string;
  projectId: string;
  status: 'In development' | 'Awaiting approval' | 'Approved';
  revision: number;
  updatedAt: string;
}
export interface ProjectActivity {
  id: string;
  actor: string;
  action: string;
  projectId: string;
  hex: string;
  occurredAt: string;
}
export const developmentProjects: DevelopmentProject[] = [
  { id: 'summer-lip', description: 'A summer wardrobe of satin lip colors, balancing buildable berry pigments with warm, everyday rose tones. Align lab samples across our formulation partners before shade approval.', company: 'Aurelia Beauty', createdAt: '2026-08-12T09:00:00-07:00', members: ['Alex Morgan', 'Maya Patel', 'Sofia Chen'], name: 'Summer Lip Collection', category: 'Lip color', status: 'Development', updatedAt: '2026-10-15T15:20:00-07:00' },
  { id: 'fall-foundation', description: 'Develop a skin-first foundation range with warm and neutral undertones. Validate shade references across liquid formulas and manufacturing sites.', company: 'Atelier Skin', createdAt: '2026-08-24T09:00:00-07:00', members: ['Sofia Chen', 'Alex Morgan'], name: 'Fall Foundation Collection', category: 'Complexion', status: 'Review', updatedAt: '2026-10-15T13:45:00-07:00' },
  { id: 'blush', description: 'Soft-focus powder blushes inspired by petals and sun-warmed apricot. Refine payoff and preserve the approved shade across pressed powder batches.', company: 'Aurelia Beauty', createdAt: '2026-09-03T09:00:00-07:00', members: ['Maya Patel', 'Alex Morgan'], name: 'Blush Collection', category: 'Cheek color', status: 'Development', updatedAt: '2026-10-14T16:10:00-07:00' },
];
export const developmentColors: DevelopmentColor[] = [
  { company: 'Aurelia Beauty', productType: 'Lipstick', supplier: 'Milano Color Labs', factory: 'Crema, Italy · MCL-02', formula: 'Satin Lip · SL-204', id: 'LIP-001', name: 'Guava Kiss', hex: '#CD7E79', projectId: 'summer-lip', status: 'In development', revision: 3, updatedAt: '2026-10-15T15:20:00-07:00' },
  { company: 'Atelier Skin', productType: 'Foundation', supplier: 'Lyon Formulation', factory: 'Lyon, France · LF-01', formula: 'Skin Fluid · SF-301', id: 'FND-001', name: 'Warm Sand', hex: '#D5B59A', projectId: 'fall-foundation', status: 'Awaiting approval', revision: 2, updatedAt: '2026-10-15T13:45:00-07:00' },
  { company: 'Aurelia Beauty', productType: 'Lipstick', supplier: 'Milano Color Labs', factory: 'Crema, Italy · MCL-02', formula: 'Satin Lip · SL-204', id: 'LIP-002', name: 'Berry Velvet', hex: '#713849', projectId: 'summer-lip', status: 'Awaiting approval', revision: 4, updatedAt: '2026-10-15T10:30:00-07:00' },
  { company: 'Aurelia Beauty', productType: 'Blush', supplier: 'Lyon Formulation', factory: 'Lyon, France · LF-01', formula: 'Soft Press · SP-106', id: 'BLH-001', name: 'Soft Petal', hex: '#E7BDB7', projectId: 'blush', status: 'In development', revision: 2, updatedAt: '2026-10-14T16:10:00-07:00' },
  { company: 'Aurelia Beauty', productType: 'Lipstick', supplier: 'Seoul Pigment Studio', factory: 'Incheon, South Korea · SPS-03', formula: 'Velvet Matte · VM-112', id: 'LIP-003', name: 'Rosewood', hex: '#A56569', projectId: 'summer-lip', status: 'Approved', revision: 3, updatedAt: '2026-10-14T11:00:00-07:00' },
  { company: 'Atelier Skin', productType: 'Foundation', supplier: 'Lyon Formulation', factory: 'Lyon, France · LF-01', formula: 'Skin Fluid · SF-301', id: 'FND-002', name: 'Golden Beige', hex: '#BA916E', projectId: 'fall-foundation', status: 'Awaiting approval', revision: 2, updatedAt: '2026-10-13T14:00:00-07:00' },
  { company: 'Atelier Skin', productType: 'Foundation', supplier: 'Seoul Pigment Studio', factory: 'Incheon, South Korea · SPS-03', formula: 'Serum Base · SB-208', id: 'FND-003', name: 'Deep Cocoa', hex: '#6E5148', projectId: 'fall-foundation', status: 'In development', revision: 1, updatedAt: '2026-10-13T09:00:00-07:00' },
  { company: 'Aurelia Beauty', productType: 'Blush', supplier: 'Milano Color Labs', factory: 'Crema, Italy · MCL-02', formula: 'Cream Cloud · CC-210', id: 'BLH-002', name: 'Apricot Veil', hex: '#DCA68A', projectId: 'blush', status: 'In development', revision: 1, updatedAt: '2026-10-12T12:00:00-07:00' },
  { company: 'Aurelia Beauty', productType: 'Blush', supplier: 'Lyon Formulation', factory: 'Lyon, France · LF-01', formula: 'Soft Press · SP-106', id: 'BLH-003', name: 'Dusty Rose', hex: '#B67F85', projectId: 'blush', status: 'In development', revision: 2, updatedAt: '2026-10-12T10:00:00-07:00' },
  { id: 'EYE-001', name: 'Champagne Silk', hex: '#C7AC87', company: 'Aurelia Beauty', productType: 'Eyeshadow', supplier: 'Seoul Pigment Studio', factory: 'Incheon, South Korea · SPS-03', formula: 'Pearl Press · PP-401', projectId: '', status: 'Approved', revision: 2, updatedAt: '2026-10-11T10:00:00-07:00' },
  { id: 'EYE-002', name: 'Espresso Ink', hex: '#3F3230', company: 'Aurelia Beauty', productType: 'Eyeliner', supplier: 'Milano Color Labs', factory: 'Crema, Italy · MCL-02', formula: 'Gel Glide · GG-502', projectId: '', status: 'Awaiting approval', revision: 1, updatedAt: '2026-10-10T10:00:00-07:00' },
  { id: 'LIP-004', name: 'Rosewood', hex: '#AD7270', company: 'Aurelia Beauty', productType: 'Lipstick', supplier: 'Milano Color Labs', factory: 'Crema, Italy · MCL-02', formula: 'Satin Lip · SL-204', projectId: 'summer-lip', status: 'In development', revision: 1, updatedAt: '2026-10-09T10:00:00-07:00' },
  { id: 'FND-004', name: 'Ivory Veil', hex: '#E8CFB2', company: 'Aurelia Beauty', productType: 'Foundation', supplier: 'Lyon Formulation', factory: 'Lyon, France · LF-01', formula: 'Skin Fluid · SF-301', projectId: '', status: 'In development', revision: 1, updatedAt: '2026-10-08T10:00:00-07:00' },
];
export const projectActivity: ProjectActivity[] = [
  { id: 'activity-1', actor: 'Alex Morgan', action: 'updated Guava Kiss to revision 3', projectId: 'summer-lip', hex: '#CD7E79', occurredAt: '2026-10-15T15:20:00-07:00' },
  { id: 'activity-2', actor: 'Maya Patel', action: 'submitted Warm Sand for approval', projectId: 'fall-foundation', hex: '#D5B59A', occurredAt: '2026-10-15T13:45:00-07:00' },
  { id: 'activity-3', actor: 'Maya Patel', action: 'refined the Soft Petal lab sample', projectId: 'blush', hex: '#E7BDB7', occurredAt: '2026-10-14T16:10:00-07:00' },
  { id: 'activity-4', actor: 'Alex Morgan', action: 'approved Rosewood, revision 3', projectId: 'summer-lip', hex: '#A56569', occurredAt: '2026-10-14T11:00:00-07:00' },
];
