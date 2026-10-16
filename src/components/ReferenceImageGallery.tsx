import { useUser } from '../state/UserContext';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Upload, ImagePlus, X, Expand, Trash2, Camera, LoaderCircle } from 'lucide-react';
import { useWorkspace } from '../state/WorkspaceContext';
import type { DevelopmentColor } from '../data/dashboard';
import { deleteImage, loadImages, saveImages, storageMessage, type ReferenceImage } from '../storage/referenceImages';
import { formatDate } from '../utils/date';
import ColorReferenceImages from './ColorReferenceImages';
interface DraftImage { id:string;file:File;description:string;revision:number;url:string; }
function Photo({image,onOpen,onRemove}:{image:ReferenceImage;onOpen:()=>void;onRemove?:(()=>void)}) {
  const [url,setUrl]=useState('');
  useEffect(()=>{const next=URL.createObjectURL(image.blob);setUrl(next);return()=>URL.revokeObjectURL(next);},[image.blob]);
  return <article className="uploaded-image-card"><button className="image-preview-button" onClick={onOpen} aria-label={`View image: ${image.description}`}><img src={url || undefined} alt={image.description} loading="lazy"/><span><Expand size={15}/> View reference</span></button><div className="image-card-caption"><div className="image-revision-label">REVISION {String(image.revision.number).padStart(2,'0')}<span>PHOTO REFERENCE</span></div><h3>{image.description}</h3><p>{image.revision.title}</p><div className="image-card-date"><span>Uploaded <time dateTime={image.uploadedAt}>{formatDate(image.uploadedAt)}</time></span>{onRemove&&<button className="icon-button" onClick={onRemove} aria-label={`Remove image: ${image.description}`}><Trash2 size={14}/></button>}</div></div></article>;
}
function ImageViewer({image,onClose}:{image:ReferenceImage;onClose:()=>void}) {
  const ref=useRef<HTMLDialogElement>(null);const [url,setUrl]=useState('');
  useEffect(()=>{const next=URL.createObjectURL(image.blob);setUrl(next);ref.current?.showModal();return()=>URL.revokeObjectURL(next);},[image.blob]);
  return <dialog ref={ref} className="image-viewer" aria-labelledby="image-viewer-title" onCancel={onClose} onClick={event=>{if(event.target===ref.current)onClose();}}><div className="viewer-toolbar"><span>REFERENCE IMAGE / REVISION {image.revision.number}</span><button className="icon-button" aria-label="Close image preview" onClick={onClose}><X size={21}/></button></div><img src={url||undefined} alt={image.description}/><div className="viewer-caption"><h2 id="image-viewer-title">{image.description}</h2><p>Revision {image.revision.number} — {image.revision.title}</p><p>{image.revision.formula} <span>·</span> {image.revision.supplier}</p><span>Uploaded <time dateTime={image.uploadedAt}>{formatDate(image.uploadedAt)}</time> · {image.filename}</span></div></dialog>;
}
export default function ReferenceImageGallery({color,showIllustrations}:{color:DevelopmentColor;showIllustrations:boolean}) {
  const {can,requirePermission}=useUser();
  const {revisions}=useWorkspace();const history=revisions[color.id]??[];
  const [images,setImages]=useState<ReferenceImage[]>([]);const [drafts,setDrafts]=useState<DraftImage[]>([]);
  const [loading,setLoading]=useState(true);const [busy,setBusy]=useState(false);const [error,setError]=useState('');const [notice,setNotice]=useState('');
  const [filter,setFilter]=useState('all');const [viewing,setViewing]=useState<ReferenceImage|null>(null);const [removing,setRemoving]=useState<ReferenceImage|null>(null);
  const fileInput=useRef<HTMLInputElement>(null);const draftRef=useRef<DraftImage[]>([]);const mounted=useRef(true);
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;draftRef.current.forEach(draft=>URL.revokeObjectURL(draft.url));};},[]);
  useEffect(()=>{let active=true;loadImages(color.id).then(list=>{if(active)setImages(list);}).catch(reason=>{if(active)setError(storageMessage(reason));}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};},[color.id]);
  function updateDrafts(next:DraftImage[]){draftRef.current=next;setDrafts(next);}
  async function selectFiles(files:FileList|null) {
    requirePermission('uploadImages');
    if(!files?.length)return;
    setError('');setNotice('');const added:DraftImage[]=[];const failures:string[]=[];
    if(files.length+drafts.length>8){setError('Select up to 8 images per upload batch.');if(fileInput.current)fileInput.current.value='';return;}
    setBusy(true);
    for(const file of Array.from(files)) {
      if(!['image/jpeg','image/png','image/webp'].includes(file.type)){failures.push(`${file.name}: use JPEG, PNG, or WebP.`);continue;}
      if(file.size>10*1024*1024){failures.push(`${file.name}: exceeds the 10 MB limit.`);continue;}
      const url=URL.createObjectURL(file);
      try{await new Promise<void>((resolve,reject)=>{const image=new Image();image.onload=()=>image.naturalWidth*image.naturalHeight<=40000000?resolve():reject(new Error('dimensions'));image.onerror=()=>reject(new Error('decode'));image.src=url;});added.push({id:crypto.randomUUID(),file,url,description:'',revision:color.revision});}
      catch{URL.revokeObjectURL(url);failures.push(`${file.name}: could not read this image or it exceeds 40 megapixels.`);}
    }
    if(!mounted.current){added.forEach(item=>URL.revokeObjectURL(item.url));return;}
    updateDrafts([...draftRef.current,...added]);setError(failures.join(' '));setBusy(false);if(fileInput.current)fileInput.current.value='';
  }
  function discard(id:string){const item=drafts.find(draft=>draft.id===id);if(item)URL.revokeObjectURL(item.url);updateDrafts(drafts.filter(draft=>draft.id!==id));}
  async function upload(event:FormEvent) {
    event.preventDefault();requirePermission('uploadImages');setError('');setNotice('');
    if(drafts.some(draft=>!draft.description.trim())){setError('Add a description to every image before saving.');return;}
    const now=new Date().toISOString();const records:ReferenceImage[]=[];
    for(const draft of drafts){const revision=history.find(item=>item.number===draft.revision);if(!revision){setError('Choose an existing revision for every image.');return;}records.push({id:draft.id,colorId:color.id,blob:draft.file,filename:draft.file.name,description:draft.description.trim(),revision:{...revision},uploadedAt:now});}
    if(!records.length)return;setBusy(true);
    try{await saveImages(records);if(!mounted.current)return;setImages(previous=>[...records,...previous]);drafts.forEach(draft=>URL.revokeObjectURL(draft.url));updateDrafts([]);setFilter('all');setNotice(`${records.length} ${records.length===1?'image':'images'} saved to this browser.`);}
    catch(reason){if(mounted.current)setError(storageMessage(reason));}finally{if(mounted.current)setBusy(false);}
  }
  async function remove() {
    requirePermission('uploadImages');
    if(!removing)return;setBusy(true);setError('');
    try{await deleteImage(removing.id);if(!mounted.current)return;setImages(previous=>previous.filter(image=>image.id!==removing.id));setRemoving(null);setNotice('Reference image removed from this browser.');}catch(reason){if(mounted.current)setError(storageMessage(reason));}finally{if(mounted.current)setBusy(false);}
  }
  const filtered=images.filter(image=>filter==='all'||String(image.revision.number)===filter);
  const revisionNumbers=[...new Set([...history.map(item=>item.number),...images.map(image=>image.revision.number)])].sort((a,b)=>a-b);
  return <section className="section-block reference-image-section" aria-labelledby="reference-images-title"><div className="section-heading"><div><h2 id="reference-images-title">Reference Images</h2><p>From lab drawdowns to production samples. Keep the visual context with its revision.</p></div><Camera size={21} color="#9a7d68"/></div>
    {can('uploadImages')&&<div className="photo-upload-zone"><span className="upload-symbol"><ImagePlus size={26}/></span><div><h3>A visual record of every refinement.</h3><p>Sample photography, packaging, lab samples, and production references.</p><span>JPEG, PNG, WebP · Up to 10 MB each · 8 images per batch</span></div><input ref={fileInput} id="reference-file-input" className="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={busy} onChange={event=>void selectFiles(event.target.files)} aria-label="Select reference images"/><button className="secondary-button" disabled={busy} onClick={()=>fileInput.current?.click()}>{busy?<LoaderCircle size={16} className="loading-icon"/>:<Upload size={16}/>}Select Images</button></div>}
    {error&&<p role="alert" className="form-error image-storage-error">{error} <button className="clear-filters" onClick={()=>{setError('');setLoading(true);loadImages(color.id).then(setImages).catch(reason=>setError(storageMessage(reason))).finally(()=>setLoading(false));}} disabled={busy}>Retry gallery</button></p>}
    <p className="dashboard-notice" role="status">{notice}</p>
    {can('uploadImages')&&drafts.length>0&&<form className="image-upload-form" onSubmit={upload}><div className="section-heading"><h3>Prepare your references <span className="count-label">{drafts.length}</span></h3><span className="small-label">NOT SAVED YET</span></div>{drafts.map(draft=><div className="image-draft" key={draft.id}><img src={draft.url} alt={`Upload preview: ${draft.file.name}`}/><div><label htmlFor={`description-${draft.id}`}>Image description</label><input id={`description-${draft.id}`} required maxLength={250} disabled={busy} placeholder="e.g. Lab drawdown under D65 light, batch 024" value={draft.description} onChange={event=>updateDrafts(drafts.map(item=>item.id===draft.id?{...item,description:event.target.value}:item))}/><div className="draft-revision-row"><label>Associated revision<select aria-label={`Associated revision for ${draft.file.name}`} value={draft.revision} disabled={busy} onChange={event=>updateDrafts(drafts.map(item=>item.id===draft.id?{...item,revision:Number(event.target.value)}:item))}>{history.map(revision=><option key={revision.number} value={revision.number}>Revision {revision.number} — {revision.title}</option>)}</select></label><span>{draft.file.name}</span></div></div><button type="button" className="icon-button" disabled={busy} onClick={()=>discard(draft.id)} aria-label={`Discard ${draft.file.name}`}><X size={18}/></button></div>)}<div className="dialog-actions"><button type="button" className="secondary-button" disabled={busy} onClick={()=>{drafts.forEach(draft=>URL.revokeObjectURL(draft.url));updateDrafts([]);}}>Cancel</button><button type="submit" className="primary-button" disabled={busy}>{busy?'Saving…':'Save Images'}</button></div></form>}
    <div className="photo-gallery-toolbar"><p><strong>{filtered.length}</strong> uploaded {filtered.length===1?'reference':'references'}</p><label>Revision<select aria-label="Filter reference images by revision" value={filter} onChange={event=>setFilter(event.target.value)}><option value="all">All revisions</option>{revisionNumbers.map(number=><option key={number} value={number}>Revision {number}</option>)}</select></label></div>
    {loading?<p className="image-gallery-loading" role="status">Loading your references…</p>:filtered.length?<div className="uploaded-image-grid">{filtered.map(image=><Photo key={image.id} image={image} onOpen={()=>setViewing(image)} onRemove={can('uploadImages')?()=>setRemoving(image):undefined}/>)}</div>:<div className="image-gallery-empty"><Camera size={29}/><h3>{images.length?'No images for this revision':'Your reference gallery starts here.'}</h3><p>{images.length?'Choose another revision or add a reference for this sample.':'Upload a cosmetic sample, package, or lab photo and link it to the revision it documents.'}</p></div>}
    <p className="page-footnote">Saved on this device in this browser. Files are not sent to a server. Clearing site data removes the images and workspace records.</p>
    {showIllustrations&&<details className="illustrated-references"><summary>Illustrated mock references <span>Sample drawdown, retained lab sample, and application study</span></summary><ColorReferenceImages color={color}/></details>}
    {viewing&&<ImageViewer image={viewing} onClose={()=>setViewing(null)}/>}
    {removing&&<RemoveImageDialog error={error} busy={busy} onClose={()=>{if(!busy)setRemoving(null);}} onRemove={()=>void remove()}/>}
  </section>;
}
function RemoveImageDialog({error,busy,onClose,onRemove}:{error:string;busy:boolean;onClose:()=>void;onRemove?:(()=>void)}){
  const ref=useRef<HTMLDialogElement>(null);useEffect(()=>{ref.current?.showModal();},[]);
  return <dialog className="create-dialog" ref={ref} aria-labelledby="remove-image-title" onCancel={event=>{if(busy)event.preventDefault();else onClose();}}><h2 id="remove-image-title">Remove reference image?</h2><p className="dialog-description">This removes the image from this browser. Color and revision records stay intact.</p>{error&&<p className="form-error" role="alert">{error}</p>}<div className="dialog-actions"><button className="secondary-button" disabled={busy} onClick={onClose}>Keep image</button><button className="primary-button" disabled={busy} onClick={onRemove}>{busy?'Removing…':'Remove image'}</button></div></dialog>;
}
