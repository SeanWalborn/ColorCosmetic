import { createContext, useContext, useEffect, useState, type Dispatch, type SetStateAction, type ReactNode } from 'react';
import { developmentProjects, developmentColors, projectActivity, type DevelopmentProject, type DevelopmentColor, type ProjectActivity } from '../data/dashboard';
import { seedRevisions, type ColorRevision } from '../data/revisions';
import { readWorkspace, workspaceKey } from '../storage/workspace';
interface WorkspaceState {
  persistenceError: string;
  revisions: Record<string, ColorRevision[]>;
  setRevisions: Dispatch<SetStateAction<Record<string, ColorRevision[]>>>;
  projects: DevelopmentProject[];
  colors: DevelopmentColor[];
  activity: ProjectActivity[];
  setProjects: Dispatch<SetStateAction<DevelopmentProject[]>>;
  setColors: Dispatch<SetStateAction<DevelopmentColor[]>>;
  setActivity: Dispatch<SetStateAction<ProjectActivity[]>>;
}
const WorkspaceContext = createContext<WorkspaceState | null>(null);
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [saved] = useState(readWorkspace);
  const [persistenceError, setPersistenceError] = useState('');
  const [revisions, setRevisions] = useState<Record<string, ColorRevision[]>>(() => saved?.revisions ?? Object.fromEntries(developmentColors.map(color => [color.id, seedRevisions(color)])));
  const [projects, setProjects] = useState(saved?.projects ?? developmentProjects);
  const [colors, setColors] = useState(saved?.colors ?? developmentColors);
  const [activity, setActivity] = useState(saved?.activity ?? projectActivity);
  useEffect(() => {
    try { localStorage.setItem(workspaceKey, JSON.stringify({ projects, colors, activity, revisions })); setPersistenceError(''); }
    catch { setPersistenceError('Workspace changes are available for this session only because browser storage is unavailable. Images are stored separately; keep this tab open to retain new color and revision associations.'); }
  }, [projects, colors, activity, revisions]);
  return <WorkspaceContext.Provider value={{ persistenceError, revisions, setRevisions, projects, colors, activity, setProjects, setColors, setActivity }}>{children}</WorkspaceContext.Provider>;
}
export function useWorkspace() {
  const state = useContext(WorkspaceContext);
  if (!state) throw new Error('useWorkspace requires WorkspaceProvider');
  return state;
}
