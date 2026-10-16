import { useState } from 'react';
import { useUser } from '../state/UserContext';
import { useRevisionActions } from '../state/useRevisionActions';
import CreateRevisionDialog from '../components/CreateRevisionDialog';
import ColorNotes from '../components/ColorNotes';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, FlaskConical } from 'lucide-react';
import { useWorkspace } from '../state/WorkspaceContext';
import StatusBadge from '../components/StatusBadge';
import RevisionTracking from '../components/RevisionTracking';
import ReferenceImageGallery from '../components/ReferenceImageGallery';
import { getColorDetails } from '../data/colorDetails';
import { hexToRgb } from '../utils/color';
import { formatDate } from '../utils/date';
export default function ColorDetail() {
  const { can } = useUser();
  const revise=useRevisionActions();
  const [editing,setEditing]=useState(false);
  const [notice,setNotice]=useState('');
  const { colorId } = useParams();
  const { colors, projects } = useWorkspace();
  const color = colors.find(item => item.id === colorId);
  if (!color) return <><Link to="/colors" className="text-link back-link"><ArrowLeft size={15}/>Color Library</Link><div className="coming-note"><h1>Color not found</h1><p>This reference is unavailable in the current browser workspace.</p><Link to="/colors" className="text-link">Browse the Color Library <ArrowUpRight size={15}/></Link></div></>;
  const project = projects.find(item => item.id === color.projectId);
  const details = getColorDetails(color);
  return <>
    <Link to={`/colors?company=${encodeURIComponent(color.company)}`} className="text-link back-link"><ArrowLeft size={15}/>Color Library</Link>
    <div className="color-permission-actions">{can('editColors')&&<button className="secondary-button" onClick={()=>setEditing(true)}>Edit Color</button>}{can('approveColors')&&color.status!=='Approved'&&<button className="primary-button" onClick={()=>{revise(color,{title:'Approved Production Color',hex:color.hex,supplier:color.supplier,factory:color.factory,formula:color.formula,notes:'Approved the current reference for production sample matching.',status:'Approved'});setNotice('Color approved in a new revision.');}}>Approve Color</button>}</div><p className="dashboard-notice" role="status">{notice}</p>
    <section className="color-detail-hero" aria-label="Standard color reference"><div className="master-swatch" style={{background:color.hex}}><span>STANDARD COLOR REFERENCE</span><div><strong>{color.hex.toUpperCase()}</strong><span>{color.id} <span> / </span> REV {String(color.revision).padStart(2,'0')}</span></div></div><div className="color-detail-title"><div><div className="eyebrow">{color.company} / {color.productType}</div><h1>{color.name}</h1><p>Internal color ID <strong>{color.id}</strong></p></div><StatusBadge status={color.status}/></div></section>
    <div className="color-detail-layout"><section className="color-specifications" aria-labelledby="reference-details-title"><div className="section-heading"><h2 id="reference-details-title">Reference details</h2><span className="small-label">REVISION {color.revision}</span></div><dl>{[
      ['HEX', color.hex.toUpperCase()], ['RGB', hexToRgb(color.hex).join(', ')], ['Product category', color.productType], ['Supplier', color.supplier], ['Factory', color.factory], ['Formula', color.formula], ['Current revision', `Revision ${color.revision}`],
    ].map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}<div><dt>Approval status</dt><dd><StatusBadge status={color.status}/></dd></div><div><dt>Associated project</dt><dd>{project ? <Link to={`/projects/${project.id}`}>{project.name} <ArrowUpRight size={13}/></Link> : 'Company library only'}</dd></div></dl></section><aside className="color-intent-note"><FlaskConical size={24}/><div className="eyebrow">ONE INTENT. DIFFERENT BASES.</div><h2>The formula changes<br/>the way color appears.</h2><p>Wax, oils, pigments, and powder fillers interact differently with light. Use this reference to align the intended shade, then review each formulation and supplier sample separately.</p><div><span>Last updated</span><time dateTime={color.updatedAt}>{formatDate(color.updatedAt)}</time></div></aside></div>
    <section className="section-block"><div className="section-heading"><div><h2>Color Variations</h2><p>The same intended shade, interpreted across product bases and manufacturing partners.</p></div><FlaskConical size={20} color="#9a7d68"/></div>{details.variations.length ? <><div className="variation-grid">{details.variations.map(variation => <article className="variation-card" key={variation.id}><div className={`variation-swatch ${variation.id}`} style={{background:variation.hex}}><span>{variation.hex}</span></div><div className="variation-info"><h3>{variation.product}</h3><dl><div><dt>Formula</dt><dd>{variation.formula}</dd></div><div><dt>Supplier</dt><dd>{variation.supplier}</dd></div><div><dt>Factory</dt><dd>{variation.factory}</dd></div></dl><p>{variation.observation}</p></div></article>)}</div><p className="page-footnote">Illustrative formulation study · Each swatch is a mock interpretation of {color.name}, not a separately approved production color.</p></> : <div className="coming-note"><h3>No formulation studies yet</h3><p>This new reference has no variation samples recorded.</p></div>}</section>
    <ReferenceImageGallery key={`images-${color.id}`} color={color} showIllustrations={details.isSeed}/>
    <ColorNotes key={`notes-${color.id}`} colorId={color.id} revision={color.revision} mockNotes={details.notes}/>
    {editing&&can('editColors')&&<CreateRevisionDialog color={color} onClose={()=>setEditing(false)} onSave={input=>{revise(color,input);setEditing(false);setNotice('Color updated in a new revision.');}}/>}
    <RevisionTracking key={`revisions-${color.id}`} color={color}/>
    <p className="page-footnote">{details.isSeed ? 'Mock development records and illustrated references' : 'Locally saved color reference'} · Digital swatches support communication; production approval requires physical sample review.</p>
  </>;
}
