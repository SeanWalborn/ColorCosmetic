import { useUser } from '../state/UserContext';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { approvalStatuses, productTypes } from '../data/dashboard';
import { useWorkspace } from '../state/WorkspaceContext';
import { useColorActions } from '../state/useColorActions';
import { hexToRgb, normalizeHex, rgbToHex } from '../utils/color';
export default function AddColorDialog({ company: initialCompany, onClose, onCreated }: { company?: string; onClose: () => void; onCreated: (name: string, company: string) => void }) {
  const { can } = useUser();
  const { projects, colors } = useWorkspace();
  const addColor = useColorActions();
  const companies = [...new Set(['Aurelia Beauty', ...projects.map(project => project.company), ...colors.map(color => color.company)])].sort();
  const dialog = useRef<HTMLDialogElement>(null);
  const [draft, setDraft] = useState({ name: '', id: '', company: initialCompany ?? companies[0], productType: 'Lipstick', supplier: '', factory: '', formula: '', projectId: '', status: 'In development' as typeof approvalStatuses[number] });
  const [hex, setHex] = useState('#A56569');
  const [preview, setPreview] = useState('#A56569');
  const [rgb, setRgb] = useState(['165','101','105']);
  const [error, setError] = useState('');
  useEffect(() => { dialog.current?.showModal(); }, []);
  function updateHex(value: string) {
    setHex(value);
    const normalized = normalizeHex(value);
    if (normalized) { setPreview(normalized); setRgb(hexToRgb(normalized).map(String)); }
  }
  function updateRgb(index: number, value: string) {
    const next = rgb.map((channel,i) => i === index ? value : channel);
    setRgb(next);
    const normalized = rgbToHex(next);
    if (normalized) { setHex(normalized); setPreview(normalized); }
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    const normalized = normalizeHex(hex);
    if (!normalized || !rgbToHex(rgb)) { setError('Enter a valid HEX color and whole RGB values between 0 and 255.'); return; }
    if (![draft.name,draft.id,draft.supplier,draft.factory,draft.formula].every(value => value.trim())) { setError('Enter a color name, internal ID, supplier, factory, and formula.'); return; }
    const id = draft.id.trim().toUpperCase();
    if (colors.some(color => color.id.toUpperCase() === id)) { setError('This internal color ID is already in use. Choose a unique ID.'); return; }
    if (draft.projectId && !projects.some(project => project.id === draft.projectId && project.company === draft.company)) { setError('Choose a project belonging to this company.'); return; }
    addColor({ ...draft, id, name: draft.name.trim(), supplier: draft.supplier.trim(), formula: draft.formula.trim(), hex: normalized });
    onCreated(draft.name.trim(), draft.company);
  }
  return <dialog ref={dialog} className="create-dialog add-color-dialog" aria-labelledby="add-color-title" onCancel={onClose} onClick={event => { if(event.target === dialog.current) onClose(); }}>
    <div className="dialog-heading"><div><div className="eyebrow">BUILD YOUR SHARED COLOR REFERENCE</div><h2 id="add-color-title">Add Color</h2></div><button className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={20}/></button></div>
    <p className="dialog-description">A new reference starts at revision 1. Mock changes are saved in this browser.</p>
    <form onSubmit={submit}>
      <div className="color-picker-panel" style={{ background: preview }}><label htmlFor="visual-color" className="picker-label">Choose a shade<input id="visual-color" aria-label="Visual color picker" type="color" value={preview} onChange={e => updateHex(e.target.value)}/></label></div>
      <div className="color-value-fields"><div><label htmlFor="color-hex">HEX value</label><input id="color-hex" required value={hex} onChange={e => updateHex(e.target.value)} aria-invalid={!normalizeHex(hex)} spellCheck={false}/></div><fieldset><legend>RGB values</legend><div className="rgb-fields">{['Red','Green','Blue'].map((channel,index) => <label key={channel}>{channel}<input type="number" min="0" max="255" step="1" required value={rgb[index]} onChange={e => updateRgb(index,e.target.value)} aria-invalid={!rgbToHex(rgb)}/></label>)}</div></fieldset></div>
      <div className="form-columns"><div><label htmlFor="color-name">Standard color name</label><input id="color-name" autoFocus required maxLength={80} value={draft.name} onChange={e => setDraft({...draft,name:e.target.value})} placeholder="e.g. Rosewood"/></div><div><label htmlFor="color-id">Internal color ID</label><input id="color-id" required maxLength={40} pattern="(?:[A-Za-z0-9_]|-)+" title="Use letters, numbers, hyphens, or underscores." value={draft.id} onChange={e => setDraft({...draft,id:e.target.value})} placeholder="e.g. LIP-005"/></div></div>
      <div className="form-columns"><div><label htmlFor="color-company">Company</label><select id="color-company" value={draft.company} onChange={e => setDraft({...draft,company:e.target.value,projectId:''})}>{companies.map(company => <option key={company}>{company}</option>)}</select></div><div><label htmlFor="color-product">Product type</label><select id="color-product" value={draft.productType} onChange={e => setDraft({...draft,productType:e.target.value})}>{productTypes.map(type => <option key={type}>{type}</option>)}</select></div></div>
      <div className="form-columns"><div><label htmlFor="color-supplier">Supplier</label><input id="color-supplier" required maxLength={100} list="supplier-options" value={draft.supplier} onChange={e => setDraft({...draft,supplier:e.target.value})} placeholder="e.g. Milano Color Labs"/><datalist id="supplier-options">{[...new Set(colors.filter(color => color.company === draft.company).map(color => color.supplier))].sort().map(supplier => <option key={supplier} value={supplier}/>)}</datalist></div><div><label htmlFor="color-formula">Formula</label><input id="color-formula" required maxLength={100} list="formula-options" value={draft.formula} onChange={e => setDraft({...draft,formula:e.target.value})} placeholder="e.g. Satin Lip · SL-204"/><datalist id="formula-options">{[...new Set(colors.filter(color => color.company === draft.company).map(color => color.formula))].sort().map(formula => <option key={formula} value={formula}/>)}</datalist></div></div>
      <label htmlFor="color-factory">Factory</label><input id="color-factory" required maxLength={100} value={draft.factory} onChange={e => setDraft({...draft,factory:e.target.value})} placeholder="e.g. Crema, Italy · MCL-02"/>
      <div className="form-columns"><div><label htmlFor="color-project">Project</label><select id="color-project" value={draft.projectId} onChange={e => setDraft({...draft,projectId:e.target.value})}><option value="">Company library only</option>{projects.filter(project => project.company === draft.company).map(project => <option key={project.id} value={project.id}>{project.name}</option>)}</select></div><div><label htmlFor="color-status">Approval status</label><select id="color-status" value={draft.status} onChange={e => setDraft({...draft,status:e.target.value as typeof draft.status})}>{approvalStatuses.filter(status=>status !== 'Approved' || can('approveColors')).map(status => <option key={status}>{status}</option>)}</select></div></div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="dialog-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button">Add Color</button></div>
    </form>
  </dialog>;
}
