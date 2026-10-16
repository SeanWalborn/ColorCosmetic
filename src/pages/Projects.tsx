import { useUser } from '../state/UserContext';
import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import PageHeading from '../components/PageHeading';
import ProjectCard from '../components/ProjectCard';
import ProjectFormDialog from '../components/ProjectFormDialog';
import { projectStatuses, type DevelopmentProject } from '../data/dashboard';
import { useWorkspace } from '../state/WorkspaceContext';
import { useProjectActions } from '../state/useProjectActions';
export default function Projects() {
  const { can } = useUser();
  const { projects, colors } = useWorkspace();
  const saveProject = useProjectActions();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All statuses');
  const [editing, setEditing] = useState<DevelopmentProject | 'new' | null>(null);
  const [notice, setNotice] = useState('');
  const filtered = projects.filter(project => (status === 'All statuses' || project.status === status) && `${project.name} ${project.company} ${project.description} ${project.category}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <><PageHeading eyebrow="FROM CONCEPT TO COLLECTION" title="Projects" description="Develop your palettes together. Keep every collection, shade, and decision connected.">{can('manageProjects') && <div className="heading-actions"><button className="primary-button" onClick={() => setEditing('new')}><Plus size={15}/>Create Project</button></div>}</PageHeading>
    <div className="project-toolbar"><label className="search-field"><Search size={17}/><input type="search" aria-label="Search projects" placeholder="Search projects or companies…" value={query} onChange={e => setQuery(e.target.value)}/></label><select aria-label="Filter projects by status" value={status} onChange={e => setStatus(e.target.value)}><option>All statuses</option>{projectStatuses.map(item => <option key={item}>{item}</option>)}</select><span className="muted" aria-live="polite">{filtered.length} of {projects.length} projects</span></div>
    <p className="dashboard-notice" role="status">{notice}</p><div className="collection-grid project-results">{filtered.map(project => <ProjectCard key={project.id} project={project} colors={colors.filter(color => color.projectId === project.id)} onEdit={() => setEditing(project)}/>)}</div>
    {!filtered.length && <div className="coming-note"><h2>No projects found</h2><p>Try another name or status, or start a new collection.</p><button className="secondary-button" onClick={() => { setQuery(''); setStatus('All statuses'); }}>Clear filters</button></div>}
    <p className="page-footnote">Mock workspace · Project changes are shared with the dashboard and saved in this browser.</p>
    {can('manageProjects') && editing && <ProjectFormDialog project={editing === 'new' ? undefined : editing} onClose={() => setEditing(null)} onSave={input => { const project = saveProject(input, editing === 'new' ? undefined : editing); setNotice(`${project.name} ${editing === 'new' ? 'created' : 'updated'}.`); setEditing(null); setQuery(''); setStatus('All statuses'); }}/>}</>;
}
