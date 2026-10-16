import { useUser } from '../state/UserContext';
import { useRef, useState } from 'react';
import { Plus, ArrowDown, GitCompareArrows } from 'lucide-react';
import type { DevelopmentColor } from '../data/dashboard';
import type { ColorRevision } from '../data/revisions';
import { useWorkspace } from '../state/WorkspaceContext';
import { useRevisionActions } from '../state/useRevisionActions';
import { formatDate } from '../utils/date';
import { hexToRgb } from '../utils/color';
import StatusBadge from './StatusBadge';
import CreateRevisionDialog from './CreateRevisionDialog';
const compareFields = [ ['formula','Formula'],['supplier','Supplier'],['factory','Factory'],['hex','HEX'],['rgb','RGB'],['notes','Notes'],['status','Approval status'] ] as const;
function valueOf(revision: ColorRevision, field: typeof compareFields[number][0]) { return field === 'rgb' ? hexToRgb(revision.hex).join(', ') : revision[field]; }
export default function RevisionTracking({ color }: { color: DevelopmentColor }) {
  const { can } = useUser();
  const { revisions } = useWorkspace();
  const saveRevision = useRevisionActions();
  const history = [...(revisions[color.id] ?? [])].sort((a,b)=>a.number-b.number);
  const [creating,setCreating] = useState(false);
  const [notice,setNotice] = useState('');
  const [first,setFirst] = useState(history[0]?.number ?? 1);
  const [second,setSecond] = useState(history.at(-1)?.number ?? 1);
  const comparison = useRef<HTMLElement>(null);
  const a = history.find(item=>item.number===first);
  const b = history.find(item=>item.number===second);
  const differences = a && b ? compareFields.filter(([key])=>valueOf(a,key)!==valueOf(b,key)).length : 0;
  return <section className="section-block revision-tracking" aria-labelledby="revision-history-title"><div className="section-heading revision-section-heading"><div><h2 id="revision-history-title">Revision History</h2><p>Every sample, adjustment, and approval. Oldest to newest.</p></div><div className="revision-heading-actions">{history.length>1 && <button className="secondary-button" onClick={()=>comparison.current?.scrollIntoView({behavior:'smooth',block:'start'})}><GitCompareArrows size={15}/>Compare Revisions</button>}{can('addRevisions') && <button className="primary-button" onClick={()=>setCreating(true)}><Plus size={15}/>Create Revision</button>}</div></div>
  <p className="dashboard-notice" role="status">{notice}</p>
  <ol className="revision-timeline">{history.map(revision=><li className="revision-event" key={revision.number}><span className="timeline-dot" style={{background:revision.hex}}/><article><div className="revision-event-heading"><div><span className="eyebrow">REVISION {String(revision.number).padStart(2,'0')}</span><h3>{revision.title}</h3></div><div>{revision.number===color.revision && <span className="planned-label">CURRENT</span>}<StatusBadge status={revision.status}/></div></div><p className="revision-authorship"><time dateTime={revision.date}>{formatDate(revision.date)}</time> <span>·</span> {revision.author}</p><div className="revision-record"><div className="revision-record-swatch" style={{background:revision.hex}} aria-label={`Revision ${revision.number} color ${revision.hex}`}><span>{revision.hex}</span></div><dl>{[['Supplier',revision.supplier],['Factory',revision.factory],['Formula',revision.formula],['HEX',revision.hex],['RGB',hexToRgb(revision.hex).join(', ')]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div><div className="revision-record-notes"><span>REVISION NOTES</span><p>{revision.notes}</p></div></article></li>)}</ol>
  <section className="revision-comparison" ref={comparison} aria-labelledby="compare-revisions-title"><div className="section-heading"><div><h2 id="compare-revisions-title">Compare Revisions</h2><p>Choose two distinct revisions to see exactly what changed.</p></div><GitCompareArrows size={20} color="#9a7d68"/></div>{history.length<2 ? <div className="coming-note"><h3>One reference. A starting point.</h3><p>Create a second revision to compare color values, suppliers, formulas, and notes.</p></div> : a && b && <><div className="comparison-selectors">{[{label:'Revision A',value:first,set:setFirst,other:second},{label:'Revision B',value:second,set:setSecond,other:first}].map(({label,value,set,other})=><label key={label}>{label}<select aria-label={label} value={value} onChange={event=>set(Number(event.target.value))}>{history.map(revision=><option key={revision.number} value={revision.number} disabled={revision.number===other}>Revision {revision.number} — {revision.title}</option>)}</select></label>)}</div><p className="comparison-summary" aria-live="polite">{differences} of {compareFields.length} fields differ between revisions {first} and {second}. <span>Highlighted fields changed.</span></p><div className="comparison-swatches">{[a,b].map(revision=><article key={revision.number}><div style={{background:revision.hex}}><span>{revision.hex}</span></div><header><h3>Revision {revision.number} — {revision.title}</h3><p>{revision.author} <span>·</span> <time dateTime={revision.date}>{formatDate(revision.date)}</time></p><StatusBadge status={revision.status}/></header></article>)}</div><div className="comparison-fields">{compareFields.map(([field,label])=>{const changed=valueOf(a,field)!==valueOf(b,field);return <div className={`comparison-field ${changed?'is-changed':''}`} key={field}><div className="comparison-field-label">{label}<span>{changed?'Changed':'Unchanged'}</span></div><div className="comparison-values"><p aria-label={`${label}, revision ${first}`}>{valueOf(a,field)}</p><p aria-label={`${label}, revision ${second}`}>{valueOf(b,field)}</p></div></div>;})}</div><div className="rgb-delta"><ArrowDown size={14}/><span>RGB change from A to B: {hexToRgb(b.hex).map((value,index)=>{const delta=value-hexToRgb(a.hex)[index];return `${['R','G','B'][index]} ${delta>0?'+':''}${delta}`;}).join(' · ')}</span></div></> }</section>
  {can('addRevisions') && creating && <CreateRevisionDialog color={color} onClose={()=>setCreating(false)} onSave={input=>{const revision=saveRevision(color,input);setSecond(revision.number);setNotice(`Revision ${revision.number} saved. The current color reference is updated; previous revisions are preserved.`);setCreating(false);}}/>}
  </section>;
}
