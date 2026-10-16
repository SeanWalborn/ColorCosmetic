import { useUser } from '../state/UserContext';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { approvalStatuses, type DevelopmentColor } from '../data/dashboard';
import type { RevisionInput } from '../data/revisions';
import { hexToRgb, normalizeHex } from '../utils/color';

export default function CreateRevisionDialog({ color, onSave, onClose }: { color: DevelopmentColor; onSave: (input: RevisionInput)=>void; onClose:()=>void }) {
  const { currentUser, can } = useUser();
  const dialog = useRef<HTMLDialogElement>(null);
  const [draft,setDraft] = useState<RevisionInput>({ title:'',supplier:color.supplier,factory:color.factory,formula:color.formula,hex:color.hex,notes:'',status:'In development' });
  const [error,setError] = useState('');
  const validHex = normalizeHex(draft.hex);
  useEffect(()=>{dialog.current?.showModal();},[]);
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!validHex) {setError('Enter a valid 3- or 6-digit HEX color.');return;}
    if (![draft.title,draft.supplier,draft.factory,draft.formula,draft.notes].every(value=>value.trim())) {setError('Complete the revision title, supplier, factory, formula, and notes.');return;}
    onSave({...draft,title:draft.title.trim(),supplier:draft.supplier.trim(),factory:draft.factory.trim(),formula:draft.formula.trim(),notes:draft.notes.trim(),hex:validHex});
  }
  return <dialog ref={dialog} className="create-dialog revision-dialog" aria-labelledby="revision-dialog-title" onCancel={onClose} onClick={event=>{if(event.target===dialog.current)onClose();}}><div className="dialog-heading"><div><div className="eyebrow">{color.name} / {color.id}</div><h2 id="revision-dialog-title">Create Revision {color.revision+1}</h2></div><button className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={20}/></button></div><p className="dialog-description">Recorded as {currentUser.name}. This becomes the current reference; earlier revisions are preserved. Changes are saved in this browser.</p><form onSubmit={submit}>
  <label htmlFor="revision-title">Revision title</label><input id="revision-title" autoFocus required maxLength={100} value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})} placeholder="e.g. Reduced saturation"/>
  <div className="revision-color-input"><label htmlFor="revision-picker">Visual color picker<input id="revision-picker" type="color" value={validHex ?? color.hex} onChange={e=>setDraft({...draft,hex:e.target.value.toUpperCase()})}/></label><div><label htmlFor="revision-hex">HEX value</label><input id="revision-hex" required aria-invalid={!validHex} value={draft.hex} onChange={e=>setDraft({...draft,hex:e.target.value})}/><p className="field-help">RGB: {validHex ? hexToRgb(validHex).join(', ') : 'Enter a valid HEX value'}</p></div></div>
  <div className="form-columns"><div><label htmlFor="revision-supplier">Supplier</label><input id="revision-supplier" required maxLength={100} value={draft.supplier} onChange={e=>setDraft({...draft,supplier:e.target.value})}/></div><div><label htmlFor="revision-factory">Factory</label><input id="revision-factory" required maxLength={100} value={draft.factory} onChange={e=>setDraft({...draft,factory:e.target.value})}/></div></div>
  <label htmlFor="revision-formula">Formula</label><input id="revision-formula" required maxLength={100} value={draft.formula} onChange={e=>setDraft({...draft,formula:e.target.value})}/>
  <label htmlFor="revision-notes">Revision notes</label><textarea id="revision-notes" required rows={3} maxLength={1200} value={draft.notes} onChange={e=>setDraft({...draft,notes:e.target.value})} placeholder="What changed, why, and what should the next reviewer check?"/>
  <label htmlFor="revision-status">Approval status</label><select id="revision-status" value={draft.status} onChange={e=>setDraft({...draft,status:e.target.value as RevisionInput['status']})}>{approvalStatuses.filter(status=>status !== 'Approved' || can('approveColors')).map(status=><option key={status}>{status}</option>)}</select><p className="field-help">New revisions start in development. Approval applies to this revision only.</p>
  {error && <p role="alert" className="form-error">{error}</p>}<div className="dialog-actions"><button className="secondary-button" type="button" onClick={onClose}>Cancel</button><button className="primary-button" type="submit">Save Revision</button></div></form></dialog>;
}
