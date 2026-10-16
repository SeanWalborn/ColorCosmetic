import { useUser } from '../state/UserContext';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Search, SlidersHorizontal, Palette } from 'lucide-react';
import PageHeading from '../components/PageHeading';
import LibraryColorCard from '../components/LibraryColorCard';
import AddColorDialog from '../components/AddColorDialog';
import { useWorkspace } from '../state/WorkspaceContext';
import { approvalStatuses, productTypes } from '../data/dashboard';
const emptyFilters = { product: '', supplier: '', formula: '', project: '', status: '' };
export default function ColorLibrary() {
  const { can } = useUser();
  const { projects, colors } = useWorkspace();
  const [searchParams] = useSearchParams();
  const initialCompany = searchParams.get('company');
  const [company, setCompany] = useState(initialCompany && (colors.some(color => color.company === initialCompany) || projects.some(project => project.company === initialCompany)) ? initialCompany : 'Aurelia Beauty');
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(emptyFilters);
  const [sort, setSort] = useState('updated');
  const [adding, setAdding] = useState(false);
  const [notice, setNotice] = useState('');
  const companies = [...new Set(['Aurelia Beauty', ...projects.map(project => project.company), ...colors.map(color => color.company)])].sort();
  const companyColors = colors.filter(color => color.company === company);
  const companyProjects = projects.filter(project => project.company === company);
  const filtered = companyColors.filter(color => `${color.name} ${color.id} ${color.hex}`.toLowerCase().includes(query.trim().toLowerCase()) && (!filters.product || color.productType === filters.product) && (!filters.supplier || color.supplier === filters.supplier) && (!filters.formula || color.formula === filters.formula) && (!filters.project || (filters.project === 'unassigned' ? !color.projectId : color.projectId === filters.project)) && (!filters.status || color.status === filters.status));
  filtered.sort((a,b) => sort === 'updated' ? Date.parse(b.updatedAt)-Date.parse(a.updatedAt) : (sort === 'name' ? a.name.localeCompare(b.name) : sort === 'supplier' ? a.supplier.localeCompare(b.supplier) : a.formula.localeCompare(b.formula)) || a.name.localeCompare(b.name) || a.id.localeCompare(b.id));
  const activeCount = Object.values(filters).filter(Boolean).length + (query.trim() ? 1 : 0);
  function reset() { setFilters(emptyFilters); setQuery(''); }
  return <><PageHeading eyebrow="ONE COMPANY. A SHARED LANGUAGE FOR COLOR." title="Color Library" description="Find the right shade. Know its source. Keep every formulation connected.">{can('editColors') && <div className="heading-actions"><button className="primary-button" onClick={() => setAdding(true)}><Plus size={15}/>Add Color</button></div>}</PageHeading>
    <section className="library-company-bar" aria-label="Company library"><div><span className="library-company-icon"><Palette size={22}/></span><div><label htmlFor="library-company">COMPANY LIBRARY</label><select id="library-company" value={company} onChange={e => { setCompany(e.target.value); reset(); setNotice(''); }}>{companies.map(name => <option key={name}>{name}</option>)}</select></div></div><div className="library-summary"><span><strong>{companyColors.length}</strong> colors</span><span><strong>{new Set(companyColors.map(color => color.supplier)).size}</strong> suppliers</span><span><strong>{new Set(companyColors.map(color => color.formula)).size}</strong> formulas</span></div></section>
    <section className="library-filter-panel" aria-label="Color search and filters"><div className="library-search-row"><label className="search-field"><Search size={17}/><input type="search" aria-label="Search colors" placeholder="Search color name, internal ID, or HEX…" value={query} onChange={e => setQuery(e.target.value)}/></label><span className="filter-caption"><SlidersHorizontal size={14}/>Refine your palette</span>{activeCount > 0 && <button className="clear-filters" onClick={reset}>Clear filters ({activeCount})</button>}</div><div className="library-filter-grid">
      <label>Product type<select aria-label="Filter by product type" value={filters.product} onChange={e => setFilters({...filters,product:e.target.value})}><option value="">All product types</option>{productTypes.map(type => <option key={type}>{type}</option>)}</select></label>
      <label>Supplier<select aria-label="Filter by supplier" value={filters.supplier} onChange={e => setFilters({...filters,supplier:e.target.value})}><option value="">All suppliers</option>{[...new Set(companyColors.map(color => color.supplier))].sort().map(value => <option key={value}>{value}</option>)}</select></label>
      <label>Formula<select aria-label="Filter by formula" value={filters.formula} onChange={e => setFilters({...filters,formula:e.target.value})}><option value="">All formulas</option>{[...new Set(companyColors.map(color => color.formula))].sort().map(value => <option key={value}>{value}</option>)}</select></label>
      <label>Project<select aria-label="Filter by project" value={filters.project} onChange={e => setFilters({...filters,project:e.target.value})}><option value="">All projects</option><option value="unassigned">Company library only</option>{companyProjects.map(project => <option key={project.id} value={project.id}>{project.name}</option>)}</select></label>
      <label>Approval status<select aria-label="Filter by approval status" value={filters.status} onChange={e => setFilters({...filters,status:e.target.value})}><option value="">All statuses</option>{approvalStatuses.map(status => <option key={status}>{status}</option>)}</select></label>
    </div></section>
    <p role="status" className="dashboard-notice">{notice}</p>
    <div className="library-results-heading"><p aria-live="polite"><strong>{filtered.length}</strong> of {companyColors.length} colors <span>· {company}</span></p><label>Sort by<select aria-label="Sort colors" value={sort} onChange={e => setSort(e.target.value)}><option value="updated">Recently updated</option><option value="name">Color name</option><option value="supplier">Supplier</option><option value="formula">Formula</option></select></label></div>
    <div className="color-grid library-grid">{filtered.map(color => <LibraryColorCard color={color} key={color.id} projectName={projects.find(project => project.id === color.projectId)?.name}/>)}</div>
    {!filtered.length && <div className="coming-note"><Palette size={30}/><h2>No matching shades</h2><p>Try a different supplier or formula, or clear your filters to see the full company palette.</p><button className="secondary-button" onClick={reset}>Clear all filters</button></div>}
    <p className="page-footnote">Mock company libraries · Changes are shared with Projects and Dashboard in this browser. Digital swatches are reference previews.</p>
    {can('editColors') && adding && <AddColorDialog company={company} onClose={() => setAdding(false)} onCreated={(name, savedCompany) => { setCompany(savedCompany); reset(); setSort('updated'); setNotice(`${name} added to ${savedCompany} at revision 1.`); setAdding(false); }}/>}</>;
}
