import { Link, Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ColorLibrary from './pages/ColorLibrary';
import ColorDetail from './pages/ColorDetail';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import ProjectDetail from './pages/ProjectDetail';
import { UserProvider } from './state/UserContext';
import { WorkspaceProvider } from './state/WorkspaceContext';
export default function App() { return <UserProvider><WorkspaceProvider><Routes><Route element={<AppLayout/>}><Route index element={<Dashboard/>}/><Route path="projects" element={<Projects/>}/><Route path="projects/:projectId" element={<ProjectDetail/>}/><Route path="colors" element={<ColorLibrary/>}/><Route path="colors/:colorId" element={<ColorDetail/>}/><Route path="reports" element={<Reports/>}/><Route path="profile" element={<Profile/>}/><Route path="*" element={<div className="coming-note"><h1>Page not found</h1><p>This page isn't part of your workspace.</p><Link className="text-link" to="/">Return to dashboard</Link></div>}/></Route></Routes></WorkspaceProvider></UserProvider>; }
