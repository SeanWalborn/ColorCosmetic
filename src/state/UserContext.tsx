import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
export const roles = ['Administrator','Developer','Viewer'] as const;
export type Role = typeof roles[number];
export const permissionLabels = { viewProjects:'View projects', viewColors:'View colors', viewReports:'View reports', manageProjects:'Manage projects', editColors:'Create/edit colors', addRevisions:'Add revisions', uploadImages:'Upload images', addNotes:'Add notes', approveColors:'Approve colors', manageUsers:'Manage users', exportReports:'Export reports' };
export type Permission = keyof typeof permissionLabels;
const read:Permission[]=['viewProjects','viewColors','viewReports'];
export const rolePermissions:Record<Role,Permission[]>={Administrator:[...read,'manageProjects','editColors','addRevisions','uploadImages','addNotes','approveColors','manageUsers','exportReports'],Developer:[...read,'editColors','addRevisions','uploadImages','addNotes'],Viewer:read};
export interface DemoUser { id:string;name:string;email:string;role:Role;title:string; }
const defaults:DemoUser[]=[{id:'alex',name:'Alex Morgan',email:'alex.morgan@example.com',role:'Administrator',title:'Product development lead'},{id:'maya',name:'Maya Patel',email:'maya.patel@example.com',role:'Developer',title:'Formulation specialist'},{id:'sofia',name:'Sofia Chen',email:'sofia.chen@example.com',role:'Viewer',title:'Color quality observer'}];
function restore(){try{const data=JSON.parse(localStorage.getItem('color-cosmetics-users-v1')??'null');if(data&&Array.isArray(data.users)&&data.users.length&&data.users.every((u:DemoUser)=>typeof u.id==='string'&&typeof u.name==='string'&&typeof u.email==='string'&&typeof u.title==='string'&&roles.includes(u.role))&&data.users.some((u:DemoUser)=>u.role==='Administrator'))return data as {users:DemoUser[];activeId:string};}catch{}return {users:defaults,activeId:'alex'};}
interface UserState {users:DemoUser[];currentUser:DemoUser;can:(permission:Permission)=>boolean;requirePermission:(permission:Permission)=>void;switchUser:(id:string)=>void;changeRole:(id:string,role:Role)=>void;addUser:(name:string,email:string,role:Role)=>void;error:string;}
const UserContext=createContext<UserState|null>(null);
export function UserProvider({children}:{children:ReactNode}){
 const [saved]=useState(restore);const [users,setUsers]=useState(saved.users);const [activeId,setActiveId]=useState(saved.activeId);const [error,setError]=useState('');const currentUser=users.find(user=>user.id===activeId)??users[0];
 const can=(permission:Permission)=>rolePermissions[currentUser.role].includes(permission);
 const requirePermission=(permission:Permission)=>{if(!can(permission))throw new Error(`Your role does not allow: ${permissionLabels[permission]}.`);};
 useEffect(()=>{try{localStorage.setItem('color-cosmetics-users-v1',JSON.stringify({users,activeId}));setError('');}catch{setError('Demo user changes could not be saved in this browser.');}},[users,activeId]);
 function changeRole(id:string,role:Role){requirePermission('manageUsers');const target=users.find(user=>user.id===id);if(target?.role==='Administrator'&&role!=='Administrator'&&users.filter(user=>user.role==='Administrator').length===1)throw new Error('Keep at least one Administrator in the demo workspace.');setUsers(previous=>previous.map(user=>user.id===id?{...user,role}:user));}
 function addUser(name:string,email:string,role:Role){requirePermission('manageUsers');if(users.some(user=>user.email.toLowerCase()===email.trim().toLowerCase()||user.name.toLowerCase()===name.trim().toLowerCase()))throw new Error('A user with that name or email already exists.');setUsers(previous=>[...previous,{id:crypto.randomUUID(),name:name.trim(),email:email.trim(),role,title:'Workspace collaborator'}]);}
 return <UserContext.Provider value={{users,currentUser,can,requirePermission,switchUser:id=>{if(users.some(user=>user.id===id))setActiveId(id);},changeRole,addUser,error}}>{children}</UserContext.Provider>;
}
export function useUser(){const value=useContext(UserContext);if(!value)throw new Error('UserProvider required');return value;}
export function initials(name:string){return name.split(/\s+/).slice(0,2).map(part=>part[0]).join('');}
