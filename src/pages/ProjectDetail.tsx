import ProjectTeam from '../components/ProjectTeam';
import { useUser } from '../state/UserContext';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Palette } from 'lucide-react';
import PageHeading from '../components/PageHeading';
import StatusBadge from '../components/StatusBadge';
import ProjectFormDialog from '../components/ProjectFormDialog';
import { useWorkspace } from '../state/WorkspaceContext';
import { useProjectActions } from '../state/useProjectActions';
import { formatDate } from '../utils/date';
export default function ProjectDetail() {
  const { can } = useUser();
  const { projectId } = useParams();
  const { projects, colors } = useWorkspace();
  const saveProject = useProjectActions();
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState('');
  const project = projects.find(item => item.id === projectId);
  if (!project) return <><Link className="text-link back-link" to="/projects"><ArrowLeft size={15}/>All projects</Link><div className="coming-note"><h1>Project not found</h1><p>This project is unavailable in this browser workspace. Choose a collection from the projects page.</p></div></>;
  const shades = colors.filter(color => color.projectId === project.id);
  return <><Link className="text-link back-link" to="/projects"><ArrowLeft size={15}/>All projects</Link><PageHeading eyebrow={`${project.company} / ${project.category}`} title={project.name} description="Your collection’s shared color-development reference.">{can('manageProjects') && <div className="heading-actions"><button className="secondary-button" onClick={() => setEditing(true)}><Pencil size={14}/>Edit Project</button></div>}</PageHeading>
    <p className="dashboard-notice" role="status">{notice}</p>
    <section className="project-detail-summary" aria-label="Project information"><div className="project-brief"><StatusBadge status={project.status}/><h2>About this collection</h2><p>{project.description}</p><h3>Project members <span className="count-label">{project.members.length}</span></h3><ul className="detail-members">{project.members.map(member => <li key={member}><span className="avatar">{member.split(/\s+/).slice(0,2).map(part => part[0]).join('')}</span>{member}</li>)}</ul></div><dl className="project-facts"><div><dt>Company</dt><dd>{project.company}</dd></div><div><dt>Product type</dt><dd>{project.category}</dd></div><div><dt>Created</dt><dd><time dateTime={project.createdAt}>{formatDate(project.createdAt)}</time></dd></div><div><dt>Last updated</dt><dd><time dateTime={project.updatedAt}>{formatDate(project.updatedAt)}</time></dd></div></dl></section>
    <section className="section-block"><div className="section-heading"><div><h2>Collection colors <span className="count-label">{shades.length}</span></h2><p>The individual shades shaping {project.name.toLowerCase()}.</p></div><Palette size={20} color="#9a7d68"/></div><div className="color-grid project-color-grid">{shades.map(color => <article className="color-card" key={color.id}><div className="color-sample detail-color-sample" style={{ background: color.hex }}><span>{color.hex.toUpperCase()}</span><span>REV {String(color.revision).padStart(2,'0')}</span></div><div className="color-info"><h3><Link to={`/colors/${encodeURIComponent(color.id)}`}>{color.name}</Link></h3><p className="internal-color-id">Internal color ID · {color.id}</p><StatusBadge status={color.status}/><div className="shade-metadata"><span>{color.productType}</span><time dateTime={color.updatedAt}>{formatDate(color.updatedAt)}</time></div></div></article>)}</div>{!shades.length && <div className="coming-note"><Palette size={28}/><h3>Your palette starts here.</h3><p>No colors are associated with this collection yet. Use Add Color on the dashboard and select this project.</p><Link to="/" className="text-link">Go to dashboard</Link></div>}</section>
    <p className="page-footnote">Mock workspace · Changes are saved in this browser. Project status and individual shade approval are tracked separately.</p>
    <ProjectTeam project={project}/>
    {can('manageProjects') && editing && <ProjectFormDialog project={project} onClose={() => setEditing(false)} onSave={input => { saveProject(input, project); setNotice('Project details updated.'); setEditing(false); }}/>}</>;
}
