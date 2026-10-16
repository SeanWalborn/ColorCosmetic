import type { ColorRevision } from '../data/revisions';
export interface ReferenceImage {
  id: string;
  colorId: string;
  blob: Blob;
  filename: string;
  description: string;
  revision: ColorRevision;
  uploadedAt: string;
}
function database(): Promise<IDBDatabase> {
  return new Promise((resolve,reject)=>{
    const request=indexedDB.open('color-cosmetics-references',1);
    request.onupgradeneeded=()=>{const store=request.result.createObjectStore('images',{keyPath:'id'});store.createIndex('colorId','colorId');};
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error);
    request.onblocked=()=>reject(new Error('Close other Color Cosmetics tabs and retry.'));
  });
}
export async function loadImages(colorId:string):Promise<ReferenceImage[]> {
  const db=await database();
  try{return await new Promise((resolve,reject)=>{
    const tx=db.transaction('images','readonly');const request=tx.objectStore('images').index('colorId').getAll(colorId);
    request.onsuccess=()=>resolve((request.result as ReferenceImage[]).sort((a,b)=>b.uploadedAt.localeCompare(a.uploadedAt)));
    request.onerror=()=>reject(request.error);
  });}finally{db.close();}
}
export async function saveImages(images:ReferenceImage[]):Promise<void> {
  const db=await database();
  try{await new Promise<void>((resolve,reject)=>{const tx=db.transaction('images','readwrite');images.forEach(image=>tx.objectStore('images').put(image));tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});}finally{db.close();}
}
export async function deleteImage(id:string):Promise<void> {
  const db=await database();
  try{await new Promise<void>((resolve,reject)=>{const tx=db.transaction('images','readwrite');tx.objectStore('images').delete(id);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});}finally{db.close();}
}
export function storageMessage(error:unknown) {
  return error instanceof DOMException && error.name==='QuotaExceededError' ? 'Browser storage is full. Remove a reference image or choose a smaller file, then retry.' : 'Images could not be saved or loaded in this browser. Check browser storage permissions and retry.';
}
