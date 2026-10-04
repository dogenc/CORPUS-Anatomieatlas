// CORPUS · Vergleichsmodus „Weibliche Anatomie“.
// 3D-Daten: Human Reference Atlas (HuBMAP), 3D Reference Organs auf Basis des Visible Human Female
// (US National Library of Medicine), Lizenz CC BY 4.0. Aufbereitet mit scripts/prepare_female.mjs.
// Eigener Modus: Die Daten werden erst beim Öffnen geladen; der männliche Atlas bleibt unverändert.
let api, data = null, group = null, loading = null, active = false, sel = null, isolated = false;
const parts = [], maleClones = [];
const opts = { male: true, breast: true, ligaments: false };
const $ = (id) => document.getElementById(id);
const MALE_OFFSET = 0.40; // männliches Vergleichsbecken rechts daneben (Meter)

const OS = 'https://openstax.org/books/anatomy-and-physiology-2e/pages/';
const SRC = {
  female: [OS + '27-2-anatomy-and-physiology-of-the-ovarian-reproductive-system', 'OpenStax · Weibliche Geschlechtsorgane'],
  pelvis: [OS + '8-3-the-pelvic-girdle-and-pelvis', 'OpenStax · Becken'],
  spine: [OS + '7-3-the-vertebral-column', 'OpenStax · Wirbelsäule'],
  hra: ['https://humanatlas.io/3d-reference-library', 'Human Reference Atlas · 3D-Referenzorgane (CC BY 4.0)']
};
const GROUPS = {
  bones: { name: 'Weibliches Becken', color: '#e0d3b9' }, uterus: { name: 'Gebärmutter', color: '#b8697a' },
  ovary: { name: 'Eierstöcke', color: '#d8a1ae' }, tube: { name: 'Eileiter', color: '#c98494' }, breast: { name: 'Brust', color: '#d9a58f' }
};
// [deutsch, latein, was ist das?, Aufgabe / Besonderheit, Vergleich zum Mann (optional), Quelle, Farbe (optional)]
const INFO = {
  sacrum: ['Kreuzbein', 'Os sacrum', 'Keilförmiger Knochen aus verschmolzenen Wirbeln an der Rückseite des Beckens.', 'Verbindet die Wirbelsäule mit den Hüftbeinen und überträgt das Körpergewicht auf das Becken.', 'Bei Frauen meist breiter, kürzer und weniger gekrümmt; sein oberer Vorsprung ragt weniger ins Becken. Dadurch ist der Beckeneingang runder.', 'pelvis'],
  coccyx: ['Steißbein', 'Os coccygis', 'Unterster Abschnitt der Wirbelsäule aus kleinen, verschmolzenen Wirbeln.', 'Ansatzpunkt für Bänder und Muskeln des Beckenbodens.', null, 'spine'],
  ilium: ['Darmbein', 'Os ilium', 'Größter und oberster Teil des Hüftbeins mit der flügelförmigen Darmbeinschaufel.', 'Bildet die seitliche Beckenwand und trägt Ansätze großer Rumpf- und Hüftmuskeln.', 'Das weibliche Becken ist breiter – erkennbar am größeren Abstand der vorderen oberen Darmbeinstachel.', 'pelvis'],
  ischium: ['Sitzbein', 'Os ischii', 'Unterer, hinterer Teil des Hüftbeins.', 'Beim Sitzen ruht das Körpergewicht auf den Sitzbeinhöckern.', 'Bei Frauen liegen die Sitzbeinhöcker weiter auseinander; dadurch ist der Beckenausgang größer.', 'pelvis'],
  pubis: ['Schambein', 'Os pubis', 'Vorderer Teil des Hüftbeins. Beide Schambeine treffen sich in der Schambeinfuge.', 'Schließt das Becken nach vorn zu einem Ring.', 'Der Winkel unter der Schambeinfuge (Schambogenwinkel) ist bei Frauen größer als 80°, bei Männern kleiner als 70°.', 'pelvis'],
  'uterus-fundus': ['Gebärmuttergrund', 'Fundus uteri', 'Oberster Abschnitt der Gebärmutter oberhalb der Einmündung der Eileiter.', 'Teil des muskulären Hohlorgans, das in der Schwangerschaft den Embryo trägt.', null, 'female'],
  'uterus-body': ['Gebärmutterkörper', 'Corpus uteri', 'Mittlerer Hauptabschnitt der Gebärmutter. Außerhalb einer Schwangerschaft ist die Gebärmutter etwa 5 cm breit und 7 cm lang.', 'Die Wand besteht größtenteils aus glatter Muskulatur (Myometrium); innen liegt die Schleimhaut (Endometrium), die den wachsenden Embryo ernährt und schützt.', null, 'female'],
  'uterus-wall-anterior': ['Vorderwand der Gebärmutter', 'Paries anterior uteri', 'Vordere Wand des Gebärmutterkörpers, zur Harnblase hin.', 'Die kräftige Muskulatur (Myometrium) kann sich bei Wehen in mehrere Richtungen zusammenziehen.', null, 'female'],
  'uterus-wall-posterior': ['Hinterwand der Gebärmutter', 'Paries posterior uteri', 'Hintere Wand des Gebärmutterkörpers, zum Mastdarm hin.', 'Die kräftige Muskulatur (Myometrium) kann sich bei Wehen in mehrere Richtungen zusammenziehen.', null, 'female'],
  'uterus-isthmus': ['Unteres Gebärmuttersegment', 'Isthmus uteri', 'Schmaler Übergang zwischen Gebärmutterkörper und Gebärmutterhals.', 'Verbindet Körper und Hals der Gebärmutter.', null, 'female'],
  cervix: ['Gebärmutterhals', 'Cervix uteri', 'Schmaler unterer Teil der Gebärmutter, der in die Scheide hineinragt.', 'Bildet Schleim, der unter hohem Östrogenspiegel dünnflüssig wird.', null, 'female'],
  'uterus-cornua': ['Gebärmutterhörner', 'Cornua uteri', 'Seitliche obere Ecken der Gebärmutter.', 'Hier münden die Eileiter in die Gebärmutter.', null, 'female'],
  'os-internal': ['Innerer Muttermund', 'Ostium uteri internum', 'Innere Öffnung des Gebärmutterhalskanals zum Gebärmutterkörper.', 'Begrenzt den Halskanal nach oben.', null, 'female'],
  'os-external': ['Äußerer Muttermund', 'Ostium uteri externum', 'Öffnung des Gebärmutterhalses zur Scheide.', 'Verbindet Gebärmutter und Scheide.', null, 'female'],
  cervicovaginal: ['Übergang Gebärmutterhals – Scheide', null, 'Bereich, in dem der Gebärmutterhals in die Scheide übergeht. Die Scheide ist ein etwa 10 cm langer Muskelschlauch.', 'Der obere Teil der Scheide (Scheidengewölbe) umgibt den vorragenden Gebärmutterhals.', null, 'female'],
  ovary: ['Eierstock', 'Ovarium', 'Weibliche Keimdrüse in der Beckenhöhle, etwa 2–3 cm lang – ungefähr so groß wie eine Mandel.', 'Bildet Eizellen sowie die Hormone Östrogen und Progesteron.', 'Entspricht in der Entwicklung dem Hoden des Mannes: Beide entstehen aus derselben Anlage im Embryo.', 'female'],
  'tube-isthmus': ['Eileiterenge', 'Isthmus tubae uterinae', 'Schmaler, innerer Abschnitt des Eileiters, der mit der Gebärmutter verbunden ist.', 'Leitet die Eizelle bzw. den frühen Embryo zur Gebärmutter.', null, 'female'],
  'tube-ampulla': ['Eileiterampulle', 'Ampulla tubae uterinae', 'Weiter, mittlerer Abschnitt des Eileiters.', 'Hier findet häufig die Befruchtung statt.', null, 'female'],
  'tube-infundibulum': ['Eileitertrichter', 'Infundibulum tubae uterinae', 'Weites, äußeres Ende des Eileiters nahe dem Eierstock.', 'Der Eileiter ist nicht direkt mit dem Eierstock verbunden; der Trichter fängt die Eizelle beim Eisprung auf.', null, 'female'],
  'tube-fimbriae': ['Eileiterfransen', 'Fimbriae tubae uterinae', 'Fingerförmige Fortsätze am Eileitertrichter.', 'Streichen über den Eierstock und helfen, die Eizelle in den Eileiter zu leiten.', null, 'female'],
  'breast-fat': ['Fettgewebe der Brust', 'Corpus adiposum mammae', 'Fettgewebe, das die Drüsenlappen umgibt.', 'Bestimmt die Größe der Brust. Die Brustgröße hat keinen Einfluss auf die Milchmenge.', null, 'female', '#efd6a8'],
  'breast-lobes': ['Drüsenlappen der Brust', 'Lobi glandulae mammariae', 'Die Brustdrüse ist eine umgewandelte Schweißdrüse aus mehreren Lappen.', 'In kleinen Bläschen (Alveolen) wird die Milch gebildet.', 'Männer besitzen nur eine rudimentäre Brustdrüse ohne ausgebildete Drüsenlappen.', 'female', '#c97d7d'],
  'breast-ducts': ['Milchgänge', 'Ductus lactiferi', 'Gänge, die von den Drüsenlappen zur Brustwarze führen.', 'Leiten die Milch nach außen; 15 bis 20 Milchgänge münden an der Brustwarze.', null, 'female', '#e6cf9c'],
  'breast-sinuses': ['Milchsäckchen', 'Sinus lactiferi', 'Erweiterungen der Milchgänge kurz vor der Brustwarze.', 'Verbinden jeden Milchgang mit einem Drüsenlappen.', null, 'female', '#e6cf9c'],
  nipple: ['Brustwarze', 'Papilla mammaria', 'Erhebung in der Mitte des Warzenhofs.', 'Hier münden die Milchgänge.', null, 'female', '#b9786a'],
  areola: ['Warzenhof', 'Areola mammae', 'Pigmentierter Hautbereich um die Brustwarze.', 'Enthält Drüsen, deren Sekret die Brustwarze vor Reibung schützt.', null, 'female', '#c48b7a'],
  'breast-ligaments': ['Haltebänder der Brust', 'Ligamenta suspensoria mammaria', 'Bindegewebsbänder in der Brust.', 'Verbinden das Brustgewebe mit der Haut und stützen die Brust.', null, 'female', '#d8c4b4']
};
const baseId = (id) => id.replace(/-(l|r)$/, '');
const sideOf = (id) => (/-l$/.test(id) ? 'links' : /-r$/.test(id) ? 'rechts' : '');
const info = (p) => INFO[baseId(p.id)];
const label = (p) => { const i = info(p), s = sideOf(p.id); return { de: i[0] + (s ? ' · ' + s : ''), latin: i[1] }; };
const link = (k) => { const s = SRC[k]; return `<a class="source-link" href="${s[0]}" target="_blank" rel="noopener noreferrer">${api.esc(s[1])} ↗<small>${new URL(s[0]).hostname}</small></a>`; };

export const isActive = () => active;
export function setup(a) { api = a; }

async function load() {
  if (data) return;
  const d = await fetch('/assets/female.json').then((r) => { if (!r.ok) throw Error('Daten nicht erreichbar'); return r.json(); });
  const raw = await fetch(d.pack).then((r) => { if (!r.ok) throw Error('3D-Daten nicht erreichbar'); return r.arrayBuffer(); });
  const sig = new Uint8Array(raw, 0, 2);
  const buf = sig[0] === 31 && sig[1] === 139 ? await new Response(new Blob([raw]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer() : raw;
  const { THREE } = api;
  group = new THREE.Group(); group.visible = false; api.scene.add(group);
  for (const p of d.parts) {
    const pos = new Float32Array(buf, p.vo, p.vc * 3).slice();
    for (let j = 0; j < pos.length; j += 3) { pos[j] -= p.center[0]; pos[j + 1] -= p.center[1]; pos[j + 2] -= p.center[2]; }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setIndex(new THREE.BufferAttribute(new Uint32Array(buf, p.io, p.ic), 1));
    geo.computeVertexNormals(); geo.computeBoundingSphere();
    const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ roughness: 0.65, metalness: 0, side: THREE.DoubleSide }));
    mesh.position.set(...p.center); mesh.userData = { ...p, female: true }; group.add(mesh); parts.push(mesh);
  }
  // Männliches Vergleichsbecken: teilt die Geometrie mit dem Atlas, eigenes Material, rechts versetzt.
  for (const m of api.meshes.filter((x) => ['right hip bone', 'left hip bone', 'sacrum'].includes(x.userData.en))) {
    const c = new THREE.Mesh(m.geometry, new THREE.MeshStandardMaterial({ roughness: 0.65, metalness: 0, side: THREE.DoubleSide }));
    c.position.set(m.userData.center[0] + MALE_OFFSET, m.userData.center[1], m.userData.center[2]);
    c.userData = { male: m.userData }; group.add(c); maleClones.push(c);
  }
  data = d;
}

export async function enter() {
  if (active) return;
  if (!api.ready()) { api.toast('Bitte warten, bis der Atlas geladen ist.'); return; }
  api.leaveModes();
  try { if (!loading) loading = load(); await loading; } catch (e) { loading = null; api.toast('Weibliche Modelle konnten nicht geladen werden: ' + e.message); return; }
  active = true; sel = null; isolated = false;
  document.body.classList.add('female-mode'); group.visible = true; $('sex-labels').hidden = false;
  try { history.replaceState(null, '', '#weiblich'); } catch {}
  api.applyVisibility(); frame(); api.renderDetail();
}

export function exit(silent) {
  if (!active) return;
  active = false; sel = null; isolated = false;
  document.body.classList.remove('female-mode'); group.visible = false; $('sex-labels').hidden = true;
  try { if (location.hash === '#weiblich') history.replaceState(null, '', location.pathname + location.search); } catch {}
  api.applyVisibility();
  if (!silent) { api.resetCamera(); api.renderDetail(); }
}

// Sichtbarkeit und Farben; wird von applyVisibility() im Atlas aufgerufen.
export function apply() {
  if (!active) return;
  const xray = api.xray(), clip = api.clipPlanes();
  for (const m of parts) {
    const p = m.userData, g = p.group, base = baseId(p.id), is = sel === p;
    let show = g !== 'breast' || opts.breast;
    if (base === 'breast-ligaments' && !opts.ligaments) show = false;
    if (isolated) show = is;
    m.visible = show || is;
    const col = info(p)[6] || GROUPS[g].color;
    m.material.color.set(is ? '#58818a' : col); m.material.emissive.set(is ? '#204452' : '#000000'); m.material.emissiveIntensity = is ? 0.12 : 0;
    const ghost = !is && ((xray && !isolated) || base === 'breast-fat');
    m.material.transparent = ghost; m.material.opacity = ghost ? (base === 'breast-fat' && !xray ? 0.26 : 0.16) : 1; m.material.depthWrite = !ghost;
    m.material.clippingPlanes = clip;
  }
  for (const c of maleClones) {
    const is = sel === c.userData;
    c.visible = opts.male && !isolated || is;
    c.material.color.set(is ? '#58818a' : '#cfd6dc'); c.material.emissive.set(is ? '#204452' : '#000000'); c.material.emissiveIntensity = is ? 0.12 : 0;
    c.material.transparent = !is && xray; c.material.opacity = c.material.transparent ? 0.16 : 1; c.material.depthWrite = !c.material.transparent; c.material.clippingPlanes = clip;
  }
  $('count').textContent = parts.filter((m) => m.visible).length + ' weibliche Strukturen sichtbar';
  api.redraw();
}

export const pickables = () => group.children.filter((m) => m.visible);
export function pick(hit) {
  if (!hit) return;
  sel = hit.object.userData; // weibliche Struktur oder männliches Vergleichsbecken
  api.applyVisibility(); api.renderDetail(); api.redraw();
}

// Kamera auf die sichtbaren Teile ausrichten.
function frame(target) {
  const { THREE } = api, box = new THREE.Box3();
  const list = target ? [target] : group.children.filter((m) => m.visible);
  for (const m of list) { m.geometry.computeBoundingBox(); box.union(m.geometry.boundingBox.clone().translate(m.position)); }
  api.fitBox(box.min, box.max, !!target);
}
export function focus() { const m = group.children.find((x) => x.userData === sel); if (m) frame(m); }
export function isolate() { if (!sel || sel.male) return; isolated = !isolated; api.applyVisibility(); frame(isolated ? group.children.find((x) => x.userData === sel) : null); api.renderDetail(); }

// Beschriftung „Frau“ / „Mann“ über den Becken.
export function tick() {
  if (!active || !data) return;
  const { THREE } = api, cam = api.camera, el = api.renderer.domElement.getBoundingClientRect(), host = $('scene').getBoundingClientRect();
  const put = (node, pos, show) => {
    const v = new THREE.Vector3(...pos).project(cam);
    node.hidden = !show || v.z > 1;
    node.style.left = ((v.x + 1) / 2 * el.width + el.left - host.left) + 'px'; node.style.top = ((1 - v.y) / 2 * el.height + el.top - host.top) + 'px';
  };
  const c = data.pelvisCenter;
  // Schilder nur in der Übersicht – beim Betrachten einer Struktur würden sie das Bild verdecken.
  put($('label-female'), [c[0], c[1] + 0.16, c[2]], !sel);
  put($('label-male'), [c[0] + MALE_OFFSET, c[1] + 0.16, c[2]], opts.male && !sel);
}

export const caption = () => (sel ? (sel.male ? 'Männliches Becken · ' : 'Weiblich · ') + (sel.male ? sel.male.label.de : label(sel).de) : 'Weibliche Anatomie · Vergleich');

let lastShown;
export function renderDetail() {
  const esc = api.esc;
  if (lastShown !== sel) { lastShown = sel; $('detail').scrollTop = 0; }
  $('share').disabled = true; $('detail-id').textContent = 'HRA';
  if (sel && sel.male) {
    $('detail-system').textContent = 'MÄNNLICHES BECKEN · VERGLEICH'; $('latin').textContent = sel.male.label.latin || ''; $('german').textContent = sel.male.label.de;
    $('detail-meta').textContent = 'BodyParts3D · erwachsenes männliches Referenzmodell';
    $('detail-content').innerHTML = `<h3>IM VERGLEICH</h3><p>Das männliche Becken ist meist schmaler und höher, mit kleinerem Schambogenwinkel (unter 70°), herzförmigerem Beckeneingang und dickeren, schwereren Knochen. Das weibliche Becken ist an die Geburt angepasst.</p>${link('pelvis')}<button class="secondary female-back" id="female-back">← Zur Übersicht</button>`;
  } else if (sel) {
    const i = info(sel), l = label(sel);
    $('detail-system').textContent = ('Weiblich · ' + GROUPS[sel.group].name).toUpperCase(); $('latin').textContent = l.latin || ''; $('german').textContent = l.de;
    $('detail-meta').textContent = 'Visible Human Female · Human Reference Atlas';
    $('detail-content').innerHTML = `<h3>WAS IST DAS?</h3><p>${esc(i[2])}</p><h3>AUFGABE & BESONDERHEIT</h3><p>${esc(i[3])}</p>${i[4] ? `<div class="sex-note"><h3>FRAU & MANN</h3><p>${esc(i[4])}</p></div>` : ''}<h3>QUELLEN</h3>${link(i[5])}${link('hra')}<button class="secondary female-back" id="female-back">← Zur Übersicht</button>`;
  } else {
    $('detail-system').textContent = 'VERGLEICHSMODUS'; $('latin').textContent = 'Anatomia feminina'; $('german').textContent = 'Weibliche Anatomie';
    $('detail-meta').textContent = 'Becken, Gebärmutter, Eierstöcke, Eileiter und Brust einer erwachsenen Frau';
    const groups = Object.entries(GROUPS).map(([g, v]) => `<button class="tour-btn" data-female-group="${g}"><b><span class="dot" style="background:${v.color}"></span> ${v.name}</b><small>${parts.filter((m) => m.userData.group === g).length} Teilmodelle</small></button>`).join('');
    $('detail-content').innerHTML = `<p>Das Hauptmodell zeigt einen Mann. Hier siehst du die Strukturen, die sich bei Frauen unterscheiden – aus einem eigenen 3D-Datensatz einer erwachsenen Frau. Antippen zeigt Namen und Erklärung.</p>
     <label class="toggle-row"><span>Männliches Becken daneben</span><input id="female-opt-male" type="checkbox" role="switch" ${opts.male ? 'checked' : ''}></label>
     <label class="toggle-row"><span>Brust einblenden</span><input id="female-opt-breast" type="checkbox" role="switch" ${opts.breast ? 'checked' : ''}></label>
     <label class="toggle-row"><span>Haltebänder der Brust</span><input id="female-opt-lig" type="checkbox" role="switch" ${opts.ligaments ? 'checked' : ''}></label>
     <h3>STRUKTUREN</h3><div class="tour-list">${groups}</div>
     <div class="notice">Zwei verschiedene Körper: Größe und Lage können daher nicht exakt verglichen werden. Weibliche 3D-Daten: Human Reference Atlas (HuBMAP), Visible Human Female, CC BY 4.0.</div>
     ${link('hra')}${link('female')}<button class="primary female-exit" id="female-exit">Zurück zum Gesamtkörper</button>`;
    $('female-opt-male').onchange = (e) => { opts.male = e.target.checked; api.applyVisibility(); frame(); };
    $('female-opt-breast').onchange = (e) => { opts.breast = e.target.checked; api.applyVisibility(); frame(); };
    $('female-opt-lig').onchange = (e) => { opts.ligaments = e.target.checked; api.applyVisibility(); };
    document.querySelectorAll('[data-female-group]').forEach((b) => (b.onclick = () => {
      const first = parts.find((m) => m.userData.group === b.dataset.femaleGroup && !/fat|ligaments|wall/.test(m.userData.id));
      if (first) { sel = first.userData; isolated = false; if (b.dataset.femaleGroup === 'breast') opts.breast = true; api.applyVisibility(); frame(first); api.renderDetail(); }
    }));
    $('female-exit').onclick = () => exit();
  }
  const back = $('female-back'); if (back) back.onclick = () => { sel = null; isolated = false; api.applyVisibility(); frame(); renderDetail(); };
  $('isolate').disabled = !sel || !!sel.male; $('focus').disabled = !sel;
  $('isolate').innerHTML = isolated ? 'Alle weiblichen Strukturen <span>⤢</span>' : 'Struktur isolieren <span>⤢</span>';
}
