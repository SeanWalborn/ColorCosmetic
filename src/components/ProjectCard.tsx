import { useUser } from '../state/UserContext';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Pencil } from 'lucide-react';
import type { DevelopmentProject, DevelopmentColor } from '../data/dashboard';
import StatusBadge from './StatusBadge';
import { formatDate } from '../utils/date';
export default function ProjectCard({ project, colors, onEdit }: { project: DevelopmentProject; colors: DevelopmentColor[]; onEdit: () => void }) {
  const { can } = useUser();
  return <article className="collection-card project-grid-card"><Link to={`/projects/${project.id}`} className={`collection-palette ${colors.length ? '' : 'empty-palette'}`} aria-label={`View ${project.name}`}>{colors.length ? colors.map(color => <span key={color.id} style={{ background: color.hex }} title={color.name}/>) : <span>No shades yet</span>}</Link><div className="collection-body"><div className="collection-category">{project.category}<span>{colors.length} {colors.length === 1 ? 'color' : 'colors'}</span></div><h2><Link to={`/projects/${project.id}`}>{project.name}</Link></h2><div className="project-company">{project.company}</div><StatusBadge status={project.status}/><p className="project-description">{project.description}</p><div className="project-members" aria-label="Project members">{project.members.map(member => <span className="member-chip" key={member}>{member}</span>)}</div><dl className="project-card-dates"><div><dt>Created</dt><dd><time dateTime={project.createdAt}>{formatDate(project.createdAt)}</time></dd></div><div><dt>Last updated</dt><dd><time dateTime={project.updatedAt}>{formatDate(project.updatedAt)}</time></dd></div></dl><div className="project-card-actions"><Link to={`/projects/${project.id}`} className="text-link">View collection <ArrowUpRight size={15}/></Link>{can('manageProjects') && <button className="project-edit-button" onClick={onEdit} aria-label={`Edit ${project.name}`}><Pencil size={13}/>Edit</button>}</div></div></article>;
}
