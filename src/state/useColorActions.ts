import { useWorkspace } from './WorkspaceContext';
import type { DevelopmentColor } from '../data/dashboard';
import { initialRevision } from '../data/revisions';
import { useUser } from './UserContext';
export type ColorInput = Omit<DevelopmentColor, 'revision' | 'updatedAt'>;
export function useColorActions() {
  const { currentUser, requirePermission, can } = useUser();
  const { setColors, setProjects, setActivity, setRevisions } = useWorkspace();
  return (input: ColorInput) => {
    requirePermission('editColors');
    if (input.status === 'Approved' && !can('approveColors')) throw new Error('Only Administrators can approve colors.');
    const now = new Date().toISOString();
    const color: DevelopmentColor = { ...input, revision: 1, updatedAt: now };
    setRevisions(previous => ({ ...previous, [color.id]: [initialRevision(color, currentUser.name)] }));
    setColors(previous => [color, ...previous]);
    if (input.projectId) {
      setProjects(previous => previous.map(project => project.id === input.projectId ? { ...project, updatedAt: now } : project));
      setActivity(previous => [{ id: crypto.randomUUID(), actor: currentUser.name, action: `added ${input.name} to the color library`, projectId: input.projectId, hex: input.hex, occurredAt: now }, ...previous]);
    }
    return color;
  };
}
