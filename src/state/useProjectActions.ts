import { useWorkspace } from './WorkspaceContext';
import { useUser } from './UserContext';
import type { DevelopmentProject, ProjectInput } from '../data/dashboard';
export function useProjectActions() {
  const { currentUser, requirePermission } = useUser();
  const { setProjects, setActivity, setColors } = useWorkspace();
  return (input: ProjectInput, existing?: DevelopmentProject) => {
    requirePermission('manageProjects');
    const now = new Date().toISOString();
    const project: DevelopmentProject = { ...input, id: existing?.id ?? crypto.randomUUID(), createdAt: existing?.createdAt ?? now, updatedAt: now };
    setProjects(previous => existing ? previous.map(item => item.id === existing.id ? project : item) : [project, ...previous]);
    if (existing && existing.company !== input.company) {
      setColors(previous => previous.map(color => color.projectId === existing.id ? { ...color, company: input.company } : color));
    }
    setActivity(previous => [{ id: crypto.randomUUID(), actor: currentUser.name, action: existing ? `updated project details (${input.status})` : 'created this collection', projectId: project.id, hex: '#C5A397', occurredAt: now }, ...previous]);
    return project;
  };
}
