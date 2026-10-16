import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { DevelopmentColor } from '../data/dashboard';
import { hexToRgb } from '../utils/color';
import StatusBadge from './StatusBadge';
export default function LibraryColorCard({ color, projectName }: { color: DevelopmentColor; projectName?: string }) {
  return <article className="color-card library-color-card"><Link to={`/colors/${encodeURIComponent(color.id)}`} aria-label={`View ${color.name} (${color.id})`} className="color-sample library-swatch" style={{ background:color.hex }}><span>{color.id}</span><span>REV {String(color.revision).padStart(2,'0')}</span></Link><div className="library-card-body"><div className="library-card-title"><h2><Link to={`/colors/${encodeURIComponent(color.id)}`}>{color.name}</Link></h2><StatusBadge status={color.status}/></div><p className="library-product">{color.productType} <span>·</span> {color.id}</p><div className="color-codes"><div><span>HEX</span><strong>{color.hex.toUpperCase()}</strong></div><div><span>RGB</span><strong>{hexToRgb(color.hex).join(', ')}</strong></div></div><dl className="library-details"><div><dt>Supplier</dt><dd>{color.supplier}</dd></div><div><dt>Formula</dt><dd>{color.formula}</dd></div><div><dt>Current revision</dt><dd>Revision {color.revision}</dd></div></dl><div className="library-project">{projectName ? <Link to={`/projects/${color.projectId}`}>{projectName} <ArrowUpRight size={13} aria-hidden="true"/></Link> : <span>Company library reference</span>}</div></div></article>;
}
