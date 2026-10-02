// CORPUS Werkzeuge: Schnittebenen, Messen, Lehrpfade, Notizen, Ansicht teilen.
// app.js übergibt über setup() eine kleine API mit Zugriff auf Szene, Kamera und Auswahl.
let api;
const $=id=>document.getElementById(id);
export const store={get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}};

// ---------- Schnittebenen ----------
// u = Achsrichtung. Standard: sichtbar bleibt u·p ≤ Position; „umkehren“ zeigt die andere Hälfte.
const AXES={
 axial:{u:[0,1,0],min:-.85,max:.85,lo:'Fuß',hi:'Kopf',value:p=>`Höhe ${Math.round((p+.844)*100)} cm`},
 sagittal:{u:[1,0,0],min:-.34,max:.34,lo:'rechts',hi:'links',value:p=>Math.abs(p)<.005?'Körpermitte':`${Math.round(Math.abs(p)*100)} cm ${p<0?'rechts':'links'}`},
 frontal:{u:[0,0,1],min:-.05,max:.25,lo:'hinten',hi:'vorn',value:p=>`Tiefe ${Math.round((p+.05)*100)} cm`}
};
const clip={axis:'off',t:1,flip:false,plane:null,planes:[]};
function clipPos(){const a=AXES[clip.axis];return a.min+(a.max-a.min)*clip.t}
function updateClip(){
 if(clip.axis==='off'){clip.planes.length=0}else{
  // Three.js keeps n·p + c ≥ 0: n=-u, c=pos keeps u·p ≤ pos; flipped n=u, c=-pos keeps u·p ≥ pos.
  const a=AXES[clip.axis],s=clip.flip?1:-1;clip.plane.normal.set(a.u[0]*s,a.u[1]*s,a.u[2]*s);clip.plane.constant=-s*clipPos();
  if(!clip.planes.length)clip.planes.push(clip.plane);
  $('clip-value').textContent=a.value(clipPos());
 }
 applyClip();
}
export function applyClip(){for(const m of api.meshes)m.material.clippingPlanes=clip.planes;api.redraw()}
// A click only counts on geometry that is not cut away.
export const keepHit=h=>!clip.planes.length||clip.plane.distanceToPoint(h.point)>=-1e-4;
function setAxis(axis){
 clip.axis=axis;document.querySelectorAll('[data-clip]').forEach(b=>b.classList.toggle('active',b.dataset.clip===axis));
 $('clip-controls').hidden=axis==='off';
 if(axis!=='off'){const a=AXES[axis];clip.t=axis==='sagittal'?.5:axis==='frontal'?.55:.62;$('clip-pos').value=Math.round(clip.t*1000);$('clip-lo').textContent=a.lo;$('clip-hi').textContent=a.hi;viewFor(axis)}
 updateClip();
}
// Camera on the side of the cut surface (the removed half).
function viewFor(axis){const {camera,controls,THREE}=api;if(!camera)return;const s=clip.flip?-1:1;let d=Math.max(camera.position.distanceTo(controls.target),1.6);
 // Querschnitt: auf die Schnitthöhe zielen und näher heran, damit die Schnittfläche gut sichtbar ist.
 if(axis==='axial'){controls.target.set(0,clipPos(),.08);d=1.35}
 const dir=axis==='axial'?new THREE.Vector3(0,.75*s,.66):axis==='sagittal'?new THREE.Vector3(.92*s,.1,.38):new THREE.Vector3(.18,.12,.97*s);
 camera.position.copy(controls.target).add(dir.normalize().multiplyScalar(d));controls.update();api.redraw()}

// ---------- Messen ----------
const meas={on:false,pts:[],objs:[]};
function clearMeasure(){for(const o of meas.objs){api.scene.remove(o);o.geometry.dispose();o.material.dispose()}meas.objs=[];meas.pts=[];$('measure-chip').hidden=true;api.redraw()}
function setMeasure(on){
 if(on&&api.explode>0){api.toast('Messen funktioniert nur in der zusammengefügten Ansicht (Entfalten auf 0 %).');return}
 meas.on=on;$('measure').setAttribute('aria-pressed',String(on));$('measure').classList.toggle('active',on);document.body.classList.toggle('measure-mode',on);
 if(on){clearMeasure();$('measure-chip').hidden=false;$('measure-chip').textContent='Messen: ersten Punkt antippen';$('measure-out').textContent='Zwei Punkte auf einer Oberfläche antippen.'}
 else{clearMeasure();$('measure-out').textContent=''}
}
function marker(p){const {THREE}=api;const m=new THREE.Mesh(new THREE.SphereGeometry(.0045,16,12),new THREE.MeshBasicMaterial({color:0x0e7c86,depthTest:false}));m.position.copy(p);m.renderOrder=999;api.scene.add(m);meas.objs.push(m)}
// Returns true when the click was consumed by a tool.
export function onPick(hit){
 if(!meas.on)return false;if(!hit)return true;
 if(meas.pts.length===2)clearMeasure();
 const p=hit.point.clone();meas.pts.push(p);marker(p);$('measure-chip').hidden=false;
 if(meas.pts.length===1){$('measure-chip').textContent='Messen: zweiten Punkt antippen'}
 else{const {THREE}=api,[a,b]=meas.pts,line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([a,b]),new THREE.LineBasicMaterial({color:0x0e7c86,depthTest:false}));line.renderOrder=998;api.scene.add(line);meas.objs.push(line);
  const cm=a.distanceTo(b)*100,txt=`${cm.toLocaleString('de-DE',{maximumFractionDigits:1,minimumFractionDigits:1})} cm`;
  $('measure-chip').textContent='Abstand: '+txt;$('measure-out').textContent=`Letzte Messung: ${txt} (Luftlinie, Referenzmodell).`}
 api.redraw();return true;
}
export function onExplode(){if(meas.on&&api.explode>0)setMeasure(false)}

// ---------- Lehrpfade ----------
const TOURS=[
 {id:'nahrung',title:'Weg der Nahrung',sub:'Vom Schlucken bis zur Ausscheidung',steps:[
  ['esophagus','Wellenartige Muskelkontraktionen (Peristaltik) transportieren den Bissen durch die Speiseröhre in den Magen – auch im Liegen.'],
  ['stomach','Im Magen wird die Nahrung mit Magensaft durchmischt. Salzsäure und Pepsin beginnen die Eiweißverdauung; der Speisebrei wird portionsweise weitergegeben.'],
  ['duodenum','Im Zwölffingerdarm kommen Galle und Bauchspeicheldrüsensaft hinzu. Sie neutralisieren die Magensäure und spalten Fette, Eiweiße und Kohlenhydrate.'],
  ['liver','Die Leber bildet die Galle und verarbeitet die über die Pfortader ankommenden Nährstoffe.'],
  ['pancreas, nsn','Die Bauchspeicheldrüse liefert Verdauungsenzyme und Bikarbonat – und mit Insulin und Glukagon wichtige Hormone.'],
  ['jejunum','Falten, Zotten und Mikrovilli vergrößern die Oberfläche des Dünndarms enorm. Hier wird ein Großteil der Nährstoffe aufgenommen.'],
  ['ileum','Der Krummdarm nimmt unter anderem Vitamin B12 und Gallensäuren auf und mündet in den Dickdarm.'],
  ['appendix','Der Wurmfortsatz hängt am Blinddarm, dem Anfang des Dickdarms. Er enthält viel lymphatisches Gewebe.'],
  ['colon, nsn','Der Dickdarm entzieht dem Inhalt Wasser und Salze. Darmbakterien verwerten unverdauliche Reste.'],
  ['rectum','Der Mastdarm speichert den Stuhl. Seine Dehnung löst den Stuhldrang aus.'],
  ['external anal sphincter','Der äußere Afterschließmuskel ist willkürlich steuerbar und ermöglicht die kontrollierte Entleerung.']]},
 {id:'atem',title:'Weg der Atemluft',sub:'Luftröhre, Bronchien, Lungenlappen, Zwerchfell',steps:[
  ['trachea','Hufeisenförmige Knorpelspangen halten die Luftröhre offen. Flimmerhärchen befördern Schleim und Partikel Richtung Rachen.'],
  ['bronchus','Die Luftröhre teilt sich in zwei Hauptbronchien, die sich baumartig immer feiner verzweigen.'],
  ['upper lobe of right lung','Die rechte Lunge besteht aus drei Lappen: Ober-, Mittel- und Unterlappen.'],
  ['middle lobe of lung','Einen Mittellappen gibt es nur rechts – links beansprucht das Herz mehr Platz.'],
  ['lower lobe of right lung','In den Lungenbläschen (Alveolen) gelangt Sauerstoff ins Blut, Kohlendioxid wird abgegeben.'],
  ['upper lobe of left lung','Die linke Lunge hat nur zwei Lappen: Ober- und Unterlappen.'],
  ['diaphragm','Das Zwerchfell ist der wichtigste Atemmuskel. Zieht es sich zusammen, flacht es ab, der Brustraum wird größer und Luft strömt ein.']]},
 {id:'kreislauf',title:'Weg des Blutes',sub:'Durch Herz, Lunge und Aorta',steps:[
  ['superior vena cava','Sauerstoffarmes Blut aus Kopf, Hals und Armen erreicht über die obere Hohlvene den rechten Vorhof.'],
  ['inferior vena cava','Die untere Hohlvene bringt Blut aus Beinen, Becken und Bauchraum zum rechten Vorhof.'],
  ['tricuspid valve','Die Trikuspidalklappe zwischen rechtem Vorhof und rechter Kammer verhindert den Rückfluss.'],
  ['pulmonary valve','Die rechte Kammer pumpt das Blut durch die Pulmonalklappe in den Lungenkreislauf.'],
  ['pulmonary artery','Die Lungenarterie führt sauerstoffarmes Blut zur Lunge – Arterien sind über die Richtung vom Herzen weg definiert, nicht über den Sauerstoffgehalt.'],
  ['pulmonary vein','Mit Sauerstoff angereichert fließt das Blut über die Lungenvenen zum linken Vorhof.'],
  ['mitral valve','Die Mitralklappe trennt linken Vorhof und linke Kammer.'],
  ['wall of heart','Die linke Kammer besitzt die kräftigste Muskelwand: Sie erzeugt den Druck für den gesamten Körperkreislauf.'],
  ['ascending aorta','Über die Aortenklappe gelangt das Blut in die aufsteigende Aorta. Direkt dort entspringen die Herzkranzarterien.'],
  ['arch of aorta','Aus dem Aortenbogen gehen die großen Gefäße für Kopf und Arme ab.'],
  ['descending aorta','Die absteigende Aorta versorgt Brustwand und Bauchorgane.'],
  ['right common iliac artery','In Höhe des 4. Lendenwirbels teilt sich die Aorta in die gemeinsamen Beckenarterien für Becken und Beine.']]},
 {id:'harn',title:'Weg des Urins',sub:'Niere bis Harnröhre',steps:[
  ['right kidney','Die Nieren filtern täglich rund 180 Liter Primärharn. Fast alles wird zurückgewonnen – übrig bleiben etwa 1,5 Liter Urin.'],
  ['right ureter','Der Harnleiter transportiert den Urin mit peristaltischen Wellen zur Blase.'],
  ['urinary bladder','Die Harnblase speichert den Urin. Ab einem bestimmten Füllungsgrad entsteht Harndrang.'],
  ['prostate','Beim Mann umschließt die Vorsteherdrüse den Anfangsteil der Harnröhre. Vergrößert sie sich, kann das Wasserlassen erschwert sein.'],
  ['urethra','Die Harnröhre leitet den Urin nach außen; beim Mann ist sie deutlich länger als bei der Frau.']]},
 {id:'schulter',title:'Rotatorenmanschette',sub:'Vier Muskeln, die die Schulter zentrieren',steps:[
  ['right supraspinatus','Der Obergrätenmuskel unterstützt das seitliche Anheben des Arms. Seine Sehne ist besonders häufig von Verschleiß betroffen.'],
  ['right infraspinatus muscle','Der Untergrätenmuskel dreht den Arm nach außen.'],
  ['right teres minor','Der kleine Rundmuskel unterstützt die Außenrotation.'],
  ['right subscapularis','Der Unterschulterblattmuskel ist der Innenrotator der Manschette. Gemeinsam halten die vier Muskeln (Merkwort „SITS“) den Oberarmkopf in der flachen Pfanne.']]},
 {id:'gehirn',title:'Gehirn & Hirnstamm',sub:'Von der Großhirnverbindung zum Kleinhirn',steps:[
  ['corpus callosum','Der Balken verbindet beide Großhirnhälften mit rund 200 Millionen Nervenfasern.'],
  ['right thalamus','Der Thalamus ist die zentrale Umschaltstation für Sinnesinformationen auf dem Weg zur Großhirnrinde (Ausnahme: Riechbahn).'],
  ['hypothalamus, nsn','Der Hypothalamus steuert Körpertemperatur, Hunger, Durst und über die Hypophyse viele Hormone.'],
  ['pituitary gland','Die Hirnanhangsdrüse ist die übergeordnete Hormondrüse und steuert u. a. Schilddrüse, Nebennieren und Keimdrüsen.'],
  ['midbrain, nsn','Das Mittelhirn enthält Reflexzentren für Sehen und Hören sowie Anteile der Bewegungssteuerung.'],
  ['pons','Die Brücke verbindet Großhirn und Kleinhirn und enthält Kerne mehrerer Hirnnerven.'],
  ['medulla oblongata','Im verlängerten Mark liegen lebenswichtige Zentren für Atmung und Kreislauf.'],
  ['cerebellum','Das Kleinhirn koordiniert Bewegungen, Gleichgewicht und motorisches Lernen.']]},
 {id:'bein',title:'Bein & Knie',sub:'Knochen, Strecker und Achillessehne',steps:[
  ['right femur','Der Oberschenkelknochen ist der längste und stärkste Knochen des Körpers.'],
  ['right rectus femoris','Der gerade Oberschenkelmuskel ist der einzige zweigelenkige Kopf des Quadrizeps: Er streckt das Knie und beugt die Hüfte.'],
  ['right patella','Die Kniescheibe ist das größte Sesambein. Sie verlängert den Hebelarm des Quadrizeps.'],
  ['right tibia','Das Schienbein trägt den Großteil des Körpergewichts zwischen Knie und Sprunggelenk.'],
  ['right calcaneal tendon','Die Achillessehne ist die kräftigste Sehne des Körpers und überträgt die Kraft der Wadenmuskeln auf die Ferse.'],
  ['right calcaneus','Das Fersenbein ist der größte Fußwurzelknochen und Ansatz der Achillessehne.']]}
];
const tour={cur:null,i:0};
function tourSteps(t){return t.steps.map(([en,text])=>[api.catalog?.meshes.find(m=>m.en===en),text]).filter(s=>s[0]?.mesh)}
function startTour(id){if(!api.catalog||!api.meshes.length){api.toast('Bitte warten, bis der Atlas geladen ist.');return}api.endQuiz?.(true);const t=TOURS.find(x=>x.id===id);tour.cur=t;tour.steps=tourSteps(t);tour.i=0;document.body.classList.add('tour-mode');$('tour-panel').hidden=false;$('tour-title').textContent=t.title;if(innerWidth<=850)$('systems-panel').classList.remove('open');showStep()}
function showStep(){const [m,text]=tour.steps[tour.i],n=tour.steps.length;$('tour-step').textContent=`${tour.i+1} / ${n}`;$('tour-name').textContent=m.label.de;$('tour-latin').textContent=m.label.latin||'';$('tour-text').textContent=text;$('tour-prev').disabled=tour.i===0;$('tour-next').textContent=tour.i===n-1?'Abschließen ✓':'Weiter →';$('tour-progress').style.width=((tour.i+1)/n*100)+'%';api.select(m,true)}
export function endTour(){if(!tour.cur)return;tour.cur=null;document.body.classList.remove('tour-mode');$('tour-panel').hidden=true}
export const tourActive=()=>!!tour.cur;

// ---------- Notizen ----------
let notes=store.get('corpus-notes',{});
export function notesHTML(m){const p=api.progressFor(m),text=notes[m.name]?.text||'';
 return `<h3>MEINE NOTIZEN</h3><textarea id="note" rows="7" placeholder="Merksätze, klinischer Bezug, Prüfungsfragen …" aria-label="Notiz zu ${api.esc(m.label.de)}">${api.esc(text)}</textarea><p class="small muted" id="note-status">${notes[m.name]?.at?'Zuletzt gespeichert: '+new Date(notes[m.name].at).toLocaleString('de-DE'):'Wird automatisch nur auf diesem Gerät gespeichert.'}</p>
 <h3>LERNSTAND IM QUIZ</h3><p>${p?`${p.r}× richtig · ${p.w}× falsch · Stufe ${p.b} von 4${p.b>=3?' · gemeistert ✓':''}`:'Diese Struktur kam im Quiz noch nicht vor.'}</p>
 <p class="small">Notizen gelten für alle Teilmodelle mit diesem Namen (z. B. linke und rechte Seite). Sichern und Übertragen über „Werkzeuge → Exportieren“.</p>`}
export function bindNotes(m){const el=$('note');if(!el)return;let t;el.oninput=()=>{clearTimeout(t);t=setTimeout(()=>{const v=el.value.trim();if(v)notes[m.name]={text:el.value,at:Date.now(),de:m.label.de};else delete notes[m.name];store.set('corpus-notes',notes);$('note-status').textContent='Gespeichert ✓';renderNoteCount()},350)}}
function renderNoteCount(){const n=Object.keys(notes).length;$('notes-count').textContent=n?`${n} Notiz${n===1?'':'en'} gespeichert`:''}
function exportData(){const data={app:'CORPUS',version:1,exported:new Date().toISOString(),notes,progress:api.getProgress()};const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));a.download=`corpus-lernstand-${new Date().toISOString().slice(0,10)}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);api.toast('Notizen und Lernstand exportiert.')}
async function importData(file){try{const d=JSON.parse(await file.text());if(d.app!=='CORPUS')throw Error();for(const [k,v] of Object.entries(d.notes||{}))if(v&&typeof v.text==='string')notes[k]={text:v.text.slice(0,20000),at:Number(v.at)||Date.now(),de:String(v.de||'')};store.set('corpus-notes',notes);api.mergeProgress(d.progress||{});renderNoteCount();api.rerender();api.toast(`Importiert: ${Object.keys(d.notes||{}).length} Notizen, ${Object.keys(d.progress||{}).length} Lerneinträge.`)}catch{api.toast('Datei konnte nicht gelesen werden – erwartet wird ein CORPUS-Export (.json).')}}

// ---------- Ansicht als Link ----------
function viewLink(){const {camera,controls}=api,f=v=>+v.toFixed(3);const parts=[api.selected?.id||'',
 'cam='+[...camera.position.toArray(),...controls.target.toArray()].map(f).join(','),
 'sys='+[...api.visible].join(','),'x='+(+$('xray').checked),'c='+(+$('cutaway').checked)];
 if(clip.axis!=='off')parts.push(`clip=${clip.axis},${clip.t.toFixed(3)},${+clip.flip}`);
 return location.origin+location.pathname+'#'+parts.join('&')}
async function shareView(){if(!api.camera)return;const url=viewLink();if(navigator.share){try{await navigator.share({title:'CORPUS · Ansicht',url});return}catch(e){if(e.name==='AbortError')return}}try{await navigator.clipboard.writeText(url);api.toast('Link zur aktuellen Ansicht kopiert – inklusive Kamera, Systemen und Schnitt.')}catch{api.toast(url)}}
export function restoreView(hash){const q=new URLSearchParams(hash.replace(/^#[^&]*&?/,''));if(![...q.keys()].length)return;
 if(q.has('sys')){api.visible=new Set(q.get('sys').split(',').filter(s=>s in api.systems));api.renderSystems()}
 if(q.has('x'))$('xray').checked=q.get('x')==='1';if(q.has('c'))$('cutaway').checked=q.get('c')==='1';api.applyVisibility();
 if(q.has('clip')){const [axis,t,flip]=q.get('clip').split(',');if(AXES[axis]){clip.flip=flip==='1';$('clip-flip').checked=clip.flip;setAxis(axis);clip.t=Math.min(1,Math.max(0,+t||0));$('clip-pos').value=Math.round(clip.t*1000);updateClip()}}
 const c=(q.get('cam')||'').split(',').map(Number);if(c.length===6&&c.every(Number.isFinite)){api.camera.position.set(c[0],c[1],c[2]);api.controls.target.set(c[3],c[4],c[5]);api.controls.update()}
 api.redraw()}

// ---------- Allgemein ----------
export function reset(){if(meas.on)setMeasure(false);endTour();if(clip.axis!=='off'){clip.flip=false;$('clip-flip').checked=false;setAxis('off')}}
export function setup(a){api=a;clip.plane=new api.THREE.Plane();
 document.querySelectorAll('[data-clip]').forEach(b=>b.onclick=()=>setAxis(b.dataset.clip));
 $('clip-pos').oninput=e=>{clip.t=+e.target.value/1000;updateClip()};
 $('clip-flip').onchange=e=>{clip.flip=e.target.checked;updateClip();if(clip.axis!=='off')viewFor(clip.axis)};
 $('measure').onclick=()=>setMeasure(!meas.on);
 $('tours').innerHTML=TOURS.map(t=>`<button class="tour-btn" data-tour="${t.id}"><b>${t.title}</b><small>${t.sub} · ${t.steps.length} Stationen</small></button>`).join('');
 document.querySelectorAll('[data-tour]').forEach(b=>b.onclick=()=>startTour(b.dataset.tour));
 $('tour-prev').onclick=()=>{if(tour.i>0){tour.i--;showStep()}};
 $('tour-next').onclick=()=>{if(tour.i<tour.steps.length-1){tour.i++;showStep()}else{const t=tour.cur.title;endTour();api.toast(`Lehrpfad „${t}“ abgeschlossen.`)}};
 $('tour-close').onclick=endTour;
 $('share-view').onclick=shareView;$('notes-export').onclick=exportData;$('notes-import').onchange=e=>{const f=e.target.files[0];if(f)importData(f);e.target.value=''};
 renderNoteCount();
}
export const toggleMeasure=()=>setMeasure(!meas.on);
