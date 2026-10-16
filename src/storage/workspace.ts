import type { DevelopmentProject, DevelopmentColor, ProjectActivity } from '../data/dashboard';
import type { ColorRevision } from '../data/revisions';
export const workspaceKey='color-cosmetics-workspace-v1';
export interface SavedWorkspace { projects:DevelopmentProject[];colors:DevelopmentColor[];activity:ProjectActivity[];revisions:Record<string,ColorRevision[]>; }
export function readWorkspace():SavedWorkspace|null {
  try{
    const data=JSON.parse(localStorage.getItem(workspaceKey)??'null') as SavedWorkspace|null;
    if(!data || !Array.isArray(data.projects) || !Array.isArray(data.colors) || !Array.isArray(data.activity) || !data.revisions || typeof data.revisions!=='object')return null;
    const strings=(item:unknown,keys:string[])=>item!==null && typeof item==='object' && keys.every(key=>typeof (item as Record<string,unknown>)[key]==='string');
    if(!data.colors.every(color=>strings(color,['id','name','company','hex','factory','supplier','formula','productType','projectId','status','updatedAt']) && /^#[\da-f]{6}$/i.test(color.hex) && Number.isInteger(color.revision)))return null;
    if(!data.projects.every(project=>strings(project,['id','name','category','description','company','createdAt','updatedAt','status']) && Array.isArray(project.members) && project.members.every(member=>typeof member==='string')))return null;
    if(!data.activity.every(item=>strings(item,['id','actor','action','projectId','hex','occurredAt'])))return null;
    if(!Object.values(data.revisions).every(list=>Array.isArray(list) && list.every(revision=>strings(revision,['date','author','title','supplier','factory','formula','hex','notes','status']) && Number.isInteger(revision.number))))return null;
    if(!data.colors.every(color=>data.revisions[color.id]?.some(revision=>revision.number===color.revision)))return null;
    return data;
  }catch{return null;}
}
