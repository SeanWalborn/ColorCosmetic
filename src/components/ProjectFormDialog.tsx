import { useEffect, useRef, useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { projectStatuses, type DevelopmentProject, type ProjectStatus, type ProjectInput } from '../data/dashboard';
export default function ProjectFormDialog({ project, onSave, onClose }: { project?: DevelopmentProject; onSave: (input: ProjectInput) => void; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [draft, setDraft] = useState({ name: project?.name ?? '', description: project?.description ?? '', company: project?.company ?? '', category: project?.category ?? 'Lip color', status: project?.status ?? 'Development', members: project?.members.join(', ') ?? '' });
  const [error, setError] = useState('');
  useEffect(() => { ref.current?.showModal(); }, []);
  function submit(event: FormEvent) {
    event.preventDefault();
    const members = [...new Set(draft.members.split(',').map(member => member.trim()).filter(Boolean))];
    if (!draft.name.trim() || !draft.company.trim() || !draft.description.trim() || !members.length) { setError('Enter a project name, description, company, and at least one member.'); return; }
    onSave({ ...draft, name: draft.name.trim(), description: draft.description.trim(), company: draft.company.trim(), members });
  }
  return <dialog className="create-dialog project-form-dialog" ref={ref} aria-labelledby="project-form-title" onCancel={onClose} onClick={event => { if (event.target === ref.current) onClose(); }}>
    <div className="dialog-heading"><div><div className="eyebrow">FROM CONCEPT TO COLLECTION</div><h2 id="project-form-title">{project ? 'Edit project' : 'Create project'}</h2></div><button className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={20}/></button></div>
    <p className="dialog-description">Mock workspace · Changes are shared across pages and saved in this browser.</p>
    <form onSubmit={submit}>
      <label htmlFor="project-name">Project name</label><input id="project-name" autoFocus required maxLength={100} value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} placeholder="e.g. Winter Satin Lips"/>
      <label htmlFor="project-description">Description</label><textarea id="project-description" required maxLength={1200} rows={3} value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} placeholder="Describe the collection and its color-development goals."/>
      <label htmlFor="project-company">Company</label><input id="project-company" required maxLength={100} value={draft.company} onChange={e => setDraft({ ...draft, company: e.target.value })} placeholder="e.g. Aurelia Beauty"/>
      <div className="form-columns"><div><label htmlFor="project-type">Product type</label><select id="project-type" value={draft.category} onChange={e => setDraft({ ...draft, category: e.target.value })}>{['Lip color', 'Complexion', 'Cheek color', 'Eye color', 'Nail color'].map(type => <option key={type}>{type}</option>)}</select></div><div><label htmlFor="project-status">Status</label><select id="project-status" value={draft.status} onChange={e => setDraft({ ...draft, status: e.target.value as ProjectStatus })}>{projectStatuses.map(status => <option key={status}>{status}</option>)}</select></div></div>
      <label htmlFor="project-members">Project members</label><input id="project-members" required maxLength={400} aria-describedby="members-help" value={draft.members} onChange={e => setDraft({ ...draft, members: e.target.value })} placeholder="Alex Morgan, Maya Patel"/><p id="members-help" className="field-help">Separate member names with commas. No invitations are sent.</p>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="dialog-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button">{project ? 'Save changes' : 'Create Project'}</button></div>
    </form>
  </dialog>;
}
