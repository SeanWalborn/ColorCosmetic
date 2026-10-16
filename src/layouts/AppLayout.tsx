import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Layers3, Palette, ChartNoAxesCombined, UserRound, ChevronRight, Menu, X, Sparkles } from 'lucide-react';
import { useUser, initials } from '../state/UserContext';
import { useWorkspace } from '../state/WorkspaceContext';
const navigation = [{ path: '/', label: 'Dashboard', icon: LayoutDashboard }, { path: '/projects', label: 'Projects', icon: Layers3 }, { path: '/colors', label: 'Color Library', icon: Palette }, { path: '/reports', label: 'Reports', icon: ChartNoAxesCombined }, { path: '/profile', label: 'Profile', icon: UserRound }];
export default function AppLayout() {
 const { currentUser, users, switchUser } = useUser();
 const { projects, persistenceError } = useWorkspace();
 const sidebarRef = useRef<HTMLElement>(null);
 const menuRef = useRef<HTMLButtonElement>(null);
 const [open, setOpen] = useState(false);
 const location = useLocation();
 useEffect(() => { window.scrollTo(0, 0); setOpen(false); }, [location.pathname]);
 useEffect(() => {
   if (!open) return;
   const previous = document.body.style.overflow;
   document.body.style.overflow = 'hidden';
   sidebarRef.current?.querySelector<HTMLElement>('.mobile-close')?.focus();
   function onKey(event: KeyboardEvent) {
     if (event.key === 'Escape') { setOpen(false); }
     if (event.key === 'Tab') {
       const nodes = Array.from(sidebarRef.current?.querySelectorAll<HTMLElement>('a[href],button:not([disabled])') ?? []).filter(node=>node.getClientRects().length);
       const first=nodes[0],last=nodes.at(-1);
       if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
       else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
     }
   }
   const media=window.matchMedia('(min-width: 651px)');
   const onResize=()=>{if(media.matches)setOpen(false);};
   media.addEventListener('change',onResize);
   document.addEventListener('keydown',onKey);
   return()=>{document.body.style.overflow=previous;document.removeEventListener('keydown',onKey);media.removeEventListener('change',onResize);if(!media.matches)menuRef.current?.focus();};
 },[open]);
 const title = location.pathname.startsWith('/colors/') ? 'Color details' : location.pathname.startsWith('/projects/') ? 'Project details' : navigation.find(item => item.path === location.pathname)?.label ?? 'Page not found';
 return <div className="app-shell"><a href="#main-content" className="skip-link">Skip to content</a>{open && <button className="nav-backdrop" aria-label="Close navigation" onClick={() => setOpen(false)}/>}
 <aside ref={sidebarRef} aria-label="Workspace navigation" className={`sidebar ${open ? 'is-open' : ''}`}><NavLink to="/" className="brand" onClick={() => setOpen(false)}><span className="brand-mark"><span/><span/><span/><span/></span><span>color<span className="brand-subtitle">COSMETICS</span></span></NavLink><button className="mobile-close icon-button" aria-label="Close navigation" onClick={() => setOpen(false)}><X size={20}/></button><div className="workspace-label">WORKSPACE</div><nav aria-label="Main navigation">{navigation.map(({path,label,icon: Icon}) => <NavLink key={path} to={path} end={path === '/'} onClick={() => setOpen(false)} className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}><Icon size={19}/><span>{label}</span>{path === '/projects' && <span className="nav-count" aria-hidden="true">{projects.length}</span>}</NavLink>)}</nav><div className="sidebar-bottom"><div className="workspace-note"><Sparkles size={18}/><h3>A shared language for color.</h3><p>From first concept to final formula. Keep every shade connected.</p><span className="small-label">YOUR COLOR WORKSPACE</span></div><NavLink to="/profile" className="user-link"><span className="avatar">{initials(currentUser.name)}</span><span><strong>{currentUser.name}</strong><small>{currentUser.role}</small></span><ChevronRight size={16}/></NavLink></div></aside>
 <div className="main-area" inert={open}><header className="topbar"><div className="breadcrumb"><button ref={menuRef} className="mobile-menu icon-button" aria-label="Open navigation" aria-expanded={open} onClick={() => setOpen(true)}><Menu size={21}/></button><Link className="workspace-crumb" to="/">Workspace</Link><ChevronRight className="crumb-divider" size={14}/>{location.pathname.startsWith('/projects/') && <><Link to="/projects">Projects</Link><ChevronRight size={14}/></>}{location.pathname.startsWith('/colors/') && <><Link to="/colors">Library</Link><ChevronRight size={14}/></>}<strong>{title}</strong></div><div className="topbar-right"><label className="demo-user-switch">Demo user<select aria-label="Simulated logged-in user" value={currentUser.id} onChange={event=>switchUser(event.target.value)}>{users.map(user=><option key={user.id} value={user.id}>{user.name} · {user.role}</option>)}</select></label><NavLink className="top-avatar avatar" to="/profile" aria-label="Your profile">{initials(currentUser.name)}</NavLink></div></header><main id="main-content" tabIndex={-1}>{persistenceError && <p className="form-error" role="alert">{persistenceError}</p>}<div key={`${currentUser.id}-${currentUser.role}`}><Outlet/></div></main><footer><span>Color Cosmetics <span className="dot-separator">·</span> Consistency in every shade.</span><span>Prototype · Saved on this browser</span></footer></div></div>;
}
