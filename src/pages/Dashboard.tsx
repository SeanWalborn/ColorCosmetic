import { useUser } from '../state/UserContext';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers3, Palette, Clock3, CircleCheck, Plus } from 'lucide-react';
import PageHeading from '../components/PageHeading';
import StatusBadge from '../components/StatusBadge';
import AddColorDialog from '../components/AddColorDialog';
import { useWorkspace } from '../state/WorkspaceContext';
import { useProjectActions } from '../state/useProjectActions';
import ProjectFormDialog from '../components/ProjectFormDialog';
const dateFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const timeFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
function DisplayDate({ value, withTime = false }: { value: string; withTime?: boolean }) { return <time dateTime={value}>{(withTime ? timeFormat : dateFormat).format(new Date(value))}</time>; }
export default function Dashboard() {
  const { currentUser, can } = useUser();
  const { projects, colors, activity } = useWorkspace();
  const saveProject = useProjectActions();
  const [dialog, setDialog] = useState<'project' | 'color' | null>(null);
  const [notice, setNotice] = useState('');
  const recentColors = [...colors].sort((a,b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)).slice(0,4);
  return <>
    <PageHeading eyebrow="YOUR COLOR DEVELOPMENT STUDIO" title={`Welcome back, ${currentUser.name.split(' ')[0]}.`} description="From first lab sample to approved shade. Here’s where your collections stand."><div className="heading-actions">{can('editColors') && <button className="secondary-button" onClick={() => setDialog('color')}><Plus size={15}/>Add Color</button>}{can('manageProjects') && <button className="primary-button" onClick={() => setDialog('project')}><Plus size={15}/>Create Project</button>}</div></PageHeading>
    <div className="dashboard-context"><span><span className="live-dot"/>Collection overview</span><span>Sample workspace · Saved in this browser</span></div>
    <div className="dashboard-notice" role="status">{notice}</div>
    <section className="stats-grid development-stats" aria-label="Development summary">{[
      { label: 'Active Projects', value: projects.filter(project => project.status !== 'Approved' && project.status !== 'Production').length, note: 'Collections taking shape', icon: Layers3 },
      { label: 'Colors being developed', value: colors.filter(color => color.status === 'In development').length, note: 'Formulation & shade refinement', icon: Palette },
      { label: 'Colors awaiting approval', value: colors.filter(color => color.status === 'Awaiting approval').length, note: 'Ready for a shade review', icon: Clock3 },
      { label: 'Approved colors', value: colors.filter(color => color.status === 'Approved').length, note: 'Your production references', icon: CircleCheck },
    ].map(({ label, value, note, icon: Icon }) => <article className="stat-card" key={label}><div><span>{label}</span><Icon size={18}/></div><strong>{value}</strong><p>{note}</p></article>)}</section>
    <section className="section-block"><div className="section-heading"><div><h2>Active collections</h2><p>The palettes behind your next product launch.</p></div><Link to="/projects" className="text-link">Projects overview <ArrowRight size={15}/></Link></div>
      <div className="collection-grid">{projects.filter(project => project.status === 'Development' || project.status === 'Review').map(project => {
        const shades = colors.filter(color => color.projectId === project.id);
        const approved = shades.length > 0 && shades.every(color => color.status === 'Approved');
        const awaiting = shades.filter(color => color.status === 'Awaiting approval').length;
        return <article className="collection-card" key={project.id}><Link to={`/projects/${project.id}`} className={`collection-palette ${shades.length ? '' : 'empty-palette'}`} aria-label={`${project.name} color palette`}>{shades.length ? shades.map(color => <span key={color.id} style={{ background: color.hex }} title={color.name}/>) : <span>No shades yet</span>}</Link><div className="collection-body"><div className="collection-category">{project.category}<span>{shades.length} {shades.length === 1 ? 'color' : 'colors'}</span></div><h3><Link to={`/projects/${project.id}`}>{project.name}</Link></h3><StatusBadge status={project.status}/><p className="collection-review">{awaiting ? `${awaiting} ${awaiting === 1 ? 'shade' : 'shades'} awaiting approval` : approved ? 'All color references approved' : shades.length ? 'Shade development in progress' : 'Ready for your first color'}</p><div className="collection-updated">Last updated <DisplayDate value={project.updatedAt}/></div></div></article>;
      })}</div>{!projects.some(project=>project.status === 'Development'||project.status === 'Review')&&<div className="coming-note"><h3>No active collections</h3><p>Your projects are approved or in production. Browse projects to review their palettes.</p><Link to="/projects" className="text-link">Browse projects</Link></div>}
    </section>
    <section className="section-block"><div className="section-heading"><div><h2>Recently updated colors</h2><p>A closer look at the shades moving forward.</p></div><Link to="/colors" className="text-link">Color library <ArrowRight size={15}/></Link></div><div className="color-grid dashboard-colors">{recentColors.map(color => <article className="color-card development-color" key={color.id}><div className="color-sample" style={{ background: color.hex }}><span>{color.id}</span><span>REV {String(color.revision).padStart(2,'0')}</span></div><div className="color-info"><h3><Link to={`/colors/${encodeURIComponent(color.id)}`}>{color.name}</Link></h3><p>{projects.find(project => project.id === color.projectId)?.name ?? 'Company library reference'}</p><StatusBadge status={color.status}/><div className="shade-metadata"><span>{color.hex.toUpperCase()}</span><DisplayDate value={color.updatedAt}/></div></div></article>)}</div>{!recentColors.length&&<div className="coming-note"><h3>Your palette starts here.</h3><p>No color references have been added yet.</p><Link to="/colors" className="text-link">Open Color Library</Link></div>}</section>
    <section className="section-block"><div className="section-heading"><div><h2>Recent project activity</h2><p>Small refinements. Shared progress.</p></div><span className="small-label">LATEST UPDATES</span></div><ol className="activity-feed">{[...activity].sort((a,b) => Date.parse(b.occurredAt) - Date.parse(a.occurredAt)).slice(0,5).map(item => <li key={item.id}><span className="activity-swatch" style={{ background: item.hex }}/><div className="activity-copy"><p><strong>{item.actor}</strong> {item.action}.</p><span><Link to={`/projects/${item.projectId}`}>{projects.find(project => project.id === item.projectId)?.name}</Link></span></div><DisplayDate value={item.occurredAt} withTime/></li>)}</ol>{!activity.length&&<div className="coming-note"><h3>No activity yet</h3><p>Project and color updates will appear here.</p></div>}</section>
    {dialog === 'project' && <ProjectFormDialog onClose={() => setDialog(null)} onSave={input => { const project = saveProject(input); setNotice(`${project.name} created. Saved in this browser.`); setDialog(null); }}/>}
    {dialog === 'color' && <AddColorDialog onClose={() => setDialog(null)} onCreated={name => { setNotice(`${name} added. Saved in this browser.`); setDialog(null); }}/>}
  </>;
}
