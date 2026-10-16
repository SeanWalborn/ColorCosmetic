import { useWorkspace } from './WorkspaceContext';
import { useUser } from './UserContext';
import type { DevelopmentColor } from '../data/dashboard';
import type { ColorRevision, RevisionInput } from '../data/revisions';
export function useRevisionActions() {
  const { currentUser, requirePermission, can } = useUser();
  const { revisions, setRevisions, setColors, setProjects, setActivity } = useWorkspace();
  return (color: DevelopmentColor, input: RevisionInput) => {
    requirePermission('addRevisions');
    if (input.status === 'Approved' && !can('approveColors')) throw new Error('Only Administrators can approve colors.');
    const history = revisions[color.id] ?? [];
    const number = Math.max(color.revision,...history.map(item=>item.number))+1;
    const revision: ColorRevision = { ...input, number, date: new Date().toISOString(), author: currentUser.name };
    setRevisions(previous => ({ ...previous, [color.id]: [...(previous[color.id] ?? []), revision] }));
    setColors(previous => previous.map(item => item.id === color.id ? { ...item, hex: revision.hex, supplier: revision.supplier, factory: revision.factory, formula: revision.formula, status: revision.status, revision: number, updatedAt: revision.date } : item));
    if (color.projectId) {
      setProjects(previous => previous.map(project=>project.id === color.projectId ? {...project,updatedAt:revision.date} : project));
      setActivity(previous => [{ id:crypto.randomUUID(), actor:currentUser.name, action:`created revision ${number} of ${color.name}`, projectId:color.projectId,hex:revision.hex,occurredAt:revision.date },...previous]);
    }
    return revision;
  };
}
