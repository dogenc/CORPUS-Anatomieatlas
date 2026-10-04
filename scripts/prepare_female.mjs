// Wandelt weibliche 3D-Referenzorgane des Human Reference Atlas (HuBMAP, CC BY 4.0) in das CORPUS-Format um.
// Aufruf:  node scripts/prepare_female.mjs [cache-ordner]
// Lädt die GLB-Dateien (falls nicht im Cache), vereinfacht die Netze (Vertex-Clustering),
// richtet das weibliche Becken am männlichen Becken des Atlas aus und schreibt
// dist/assets/female.json + dist/assets/female.bin.gz. Keine Zusatzpakete nötig (Node ≥ 18).
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = path.resolve(process.argv[2] || path.join(ROOT, 'scripts', '.cache-hra'));
const OUT = path.join(ROOT, 'dist', 'assets');
const CDN = 'https://cdn.humanatlas.io/digital-objects/ref-organ/';

// Quelle → Datei; Versionen fest, damit das Ergebnis reproduzierbar bleibt.
const SOURCES = {
  pelvis: 'pelvis-female/v1.3/assets/3d-vh-f-pelvis.glb',
  uterus: 'uterus-female/v1.2/assets/3d-vh-f-uterus.glb',
  ovaryL: 'ovary-female-left/v1.3/assets/3d-vh-f-ovary-l.glb',
  ovaryR: 'ovary-female-right/v1.3/assets/3d-vh-f-ovary-r.glb',
  tubeL: 'fallopian-tube-female-left/v1.2/assets/3d-vh-f-fallopian-tube-l.glb',
  tubeR: 'fallopian-tube-female-right/v1.2/assets/3d-vh-f-fallopian-tube-r.glb',
  breastL: 'mammary-gland-female-left/v1.1/assets/3d-vh-f-mammary-gland-l.glb',
  breastR: 'mammary-gland-female-right/v1.1/assets/3d-vh-f-mammary-gland-r.glb'
};

// Ausgewählte Teile: Knoten-Name → [id, Gruppe, Raster in mm; 0 = Original ohne Vereinfachung].
// Dünnwandige Netze (Knochen, Organe) bleiben im Original, sonst entstehen Löcher. Nur die sehr großen
// Brust-Modelle werden vereinfacht. Spongiöse Innenschichten der Knochen entfallen.
const PARTS = [
  ['VH_F_sacrum', 'sacrum', 'bones', 0], ['VH_F_coccyx', 'coccyx', 'bones', 0],
  ['VH_F_ilium_compact_bone_L', 'ilium-l', 'bones', 0], ['VH_F_ilium_compact_bone_R', 'ilium-r', 'bones', 0],
  ['VH_F_ischium_compact_bone_L', 'ischium-l', 'bones', 0], ['VH_F_ischium_compact_bone_R', 'ischium-r', 'bones', 0],
  ['VH_F_pubis_compact_bone_L', 'pubis-l', 'bones', 0], ['VH_F_pubis_compact_bone_R', 'pubis-r', 'bones', 0],
  ['VH_F_fundus_of_uterus', 'uterus-fundus', 'uterus', 0], ['VH_F_body_of_uterus', 'uterus-body', 'uterus', 0],
  ['VH_F_anterior_wall_of_uterus', 'uterus-wall-anterior', 'uterus', 0], ['VH_F_posterior_wall_of_uterus', 'uterus-wall-posterior', 'uterus', 0],
  ['VH_F_lower_uterine_segment', 'uterus-isthmus', 'uterus', 0], ['VH_F_cervix', 'cervix', 'uterus', 0],
  ['VH_F_cornua', 'uterus-cornua', 'uterus', 0], ['VH_F_internal_cervical_os', 'os-internal', 'uterus', 0],
  ['VH_F_external_cervical_os', 'os-external', 'uterus', 0], ['VH_F_cervicovaginal_junction', 'cervicovaginal', 'uterus', 0],
  ['VH_F_left_ovary', 'ovary-l', 'ovary', 0], ['VH_F_right_ovary', 'ovary-r', 'ovary', 0],
  ['VH_F_isthmus_of_fallopian_tube_L', 'tube-isthmus-l', 'tube', 0], ['VH_F_isthmus_of_fallopian_tube_R', 'tube-isthmus-r', 'tube', 0],
  ['VH_F_ampulla_of_uterine_tube_L', 'tube-ampulla-l', 'tube', 0], ['VH_F_ampulla_of_uterine_tube_R', 'tube-ampulla-r', 'tube', 0],
  ['VH_F_uterine_tube_infundibulum_L', 'tube-infundibulum-l', 'tube', 0], ['VH_F_uterine_tube_infundibulum_R', 'tube-infundibulum-r', 'tube', 0],
  ['VH_F_fibria_of_uterine_tube_L', 'tube-fimbriae-l', 'tube', 0], ['VH_F_fibria_of_uterine_tube_R', 'tube-fimbriae-r', 'tube', 0],
  ['VH_F_fat_L', 'breast-fat-l', 'breast', 3.0], ['VH_F_fat_R', 'breast-fat-r', 'breast', 3.0],
  ['VH_F_mammary_lobes_L', 'breast-lobes-l', 'breast', 2.2], ['VH_F_mammary_lobes_R', 'breast-lobes-r', 'breast', 2.2],
  ['VH_F_main_lactiferous_ducts_L', 'breast-ducts-l', 'breast', 1.6], ['VH_F_main_lactiferous_ducts_R', 'breast-ducts-r', 'breast', 1.6],
  ['VH_F_main_lactiferous_sinuses_L', 'breast-sinuses-l', 'breast', 1.0], ['VH_F_main_lactiferous_sinuses_R', 'breast-sinuses-r', 'breast', 1.0],
  ['VH_F_nipple_L', 'nipple-l', 'breast', 0.8], ['VH_F_nipple_R', 'nipple-r', 'breast', 0.8],
  ['VH_F_areola_L', 'areola-l', 'breast', 1.0], ['VH_F_areola_R', 'areola-r', 'breast', 1.0],
  ['VH_F_suspensory_ligaments_L', 'breast-ligaments-l', 'breast', 2.2], ['VH_F_suspensory_ligaments_R', 'breast-ligaments-r', 'breast', 2.2]
];

async function load(key) {
  const file = path.join(CACHE, path.basename(SOURCES[key]));
  if (!fs.existsSync(file)) {
    fs.mkdirSync(CACHE, { recursive: true });
    const res = await fetch(CDN + SOURCES[key]);
    if (!res.ok) throw new Error(`Download fehlgeschlagen: ${SOURCES[key]} (${res.status})`);
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  }
  return parseGlb(fs.readFileSync(file));
}

function parseGlb(buf) {
  const jsonLen = buf.readUInt32LE(12);
  const gltf = JSON.parse(buf.subarray(20, 20 + jsonLen).toString('utf8'));
  const binStart = 20 + jsonLen + 8;
  const bin = buf.subarray(binStart, binStart + buf.readUInt32LE(20 + jsonLen));
  const read = (idx) => {
    const a = gltf.accessors[idx], v = gltf.bufferViews[a.bufferView];
    const comps = { SCALAR: 1, VEC3: 3 }[a.type];
    const Typed = { 5126: Float32Array, 5125: Uint32Array, 5123: Uint16Array, 5121: Uint8Array }[a.componentType];
    const stride = v.byteStride || comps * Typed.BYTES_PER_ELEMENT;
    const out = new (a.componentType === 5126 ? Float32Array : Uint32Array)(a.count * comps);
    const dv = new DataView(bin.buffer, bin.byteOffset + (v.byteOffset || 0) + (a.byteOffset || 0));
    const get = { 5126: (o) => dv.getFloat32(o, true), 5125: (o) => dv.getUint32(o, true), 5123: (o) => dv.getUint16(o, true), 5121: (o) => dv.getUint8(o) }[a.componentType];
    for (let i = 0; i < a.count; i++) for (let c = 0; c < comps; c++) out[i * comps + c] = get(i * stride + c * Typed.BYTES_PER_ELEMENT);
    return out;
  };
  const byName = {};
  for (const node of gltf.nodes) {
    if (node.mesh === undefined) continue;
    if (node.matrix || node.translation || node.rotation || node.scale) throw new Error('Knoten-Transformationen werden nicht erwartet: ' + node.name);
    const pos = [], idx = [];
    for (const p of gltf.meshes[node.mesh].primitives) {
      const base = pos.length / 3, P = read(p.attributes.POSITION), I = read(p.indices);
      for (const x of P) pos.push(x); for (const i of I) idx.push(i + base);
    }
    byName[node.name] = { pos: Float32Array.from(pos), idx: Uint32Array.from(idx) };
  }
  return byName;
}

// Vertex-Clustering wie scripts/prepare_meshes.py: echte Geometrie bleibt erhalten, redundante Punkte werden zusammengefasst.
function cluster({ pos, idx }, stepMm) {
  if (!stepMm) return { pos: Float32Array.from(pos), idx: Uint32Array.from(idx) };
  const step = stepMm / 1000, map = new Map(), sum = [], cnt = [], remap = new Uint32Array(pos.length / 3);
  for (let i = 0; i < pos.length / 3; i++) {
    const k = `${Math.round(pos[i * 3] / step)},${Math.round(pos[i * 3 + 1] / step)},${Math.round(pos[i * 3 + 2] / step)}`;
    let c = map.get(k);
    if (c === undefined) { c = cnt.length; map.set(k, c); cnt.push(0); sum.push(0, 0, 0); }
    remap[i] = c; cnt[c]++; sum[c * 3] += pos[i * 3]; sum[c * 3 + 1] += pos[i * 3 + 1]; sum[c * 3 + 2] += pos[i * 3 + 2];
  }
  const v = new Float32Array(cnt.length * 3);
  for (let c = 0; c < cnt.length; c++) for (let j = 0; j < 3; j++) v[c * 3 + j] = sum[c * 3 + j] / cnt[c];
  const f = [];
  for (let t = 0; t < idx.length; t += 3) {
    const a = remap[idx[t]], b = remap[idx[t + 1]], d = remap[idx[t + 2]];
    if (a !== b && b !== d && a !== d) f.push(a, b, d);
  }
  return { pos: v, idx: Uint32Array.from(f) };
}

const bbox = (pos) => { const mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity]; for (let i = 0; i < pos.length; i += 3) for (let j = 0; j < 3; j++) { mn[j] = Math.min(mn[j], pos[i + j]); mx[j] = Math.max(mx[j], pos[i + j]); } return [mn, mx]; };

// Männliches Becken im Atlas: Mittelpunkt aus Hüftbeinen und Kreuzbein.
const catalog = JSON.parse(fs.readFileSync(path.join(OUT, 'catalog.json'), 'utf8'));
const male = catalog.meshes.filter((m) => ['right hip bone', 'left hip bone', 'sacrum'].includes(m.en));
const mMin = [0, 1, 2].map((j) => Math.min(...male.map((m) => m.center[j] - m.size[j] / 2)));
const mMax = [0, 1, 2].map((j) => Math.max(...male.map((m) => m.center[j] + m.size[j] / 2)));
const maleCenter = mMin.map((v, j) => (v + mMax[j]) / 2);

const nodes = {};
for (const key of Object.keys(SOURCES)) Object.assign(nodes, await load(key));
const fPelvis = ['VH_F_sacrum', 'VH_F_ilium_compact_bone_L', 'VH_F_ilium_compact_bone_R', 'VH_F_pubis_compact_bone_L', 'VH_F_pubis_compact_bone_R', 'VH_F_ischium_compact_bone_L', 'VH_F_ischium_compact_bone_R'];
const fb = fPelvis.map((n) => bbox(nodes[n].pos));
const fMin = [0, 1, 2].map((j) => Math.min(...fb.map((b) => b[0][j]))), fMax = [0, 1, 2].map((j) => Math.max(...fb.map((b) => b[1][j])));
const shift = maleCenter.map((v, j) => v - (fMin[j] + fMax[j]) / 2);

let pack = Buffer.alloc(0), tris = 0;
const parts = [];
for (const [name, id, group, step] of PARTS) {
  if (!nodes[name]) throw new Error('Teil fehlt in den Quelldaten: ' + name);
  const m = cluster(nodes[name], step);
  for (let i = 0; i < m.pos.length; i += 3) for (let j = 0; j < 3; j++) m.pos[i + j] += shift[j];
  const [mn, mx] = bbox(m.pos);
  const vo = pack.length, pb = Buffer.from(m.pos.buffer), io = vo + pb.length, ib = Buffer.from(m.idx.buffer);
  pack = Buffer.concat([pack, pb, ib]);
  parts.push({ id, src: name, group, vo, vc: m.pos.length / 3, io, ic: m.idx.length, center: mn.map((v, j) => +((v + mx[j]) / 2).toFixed(5)), size: mn.map((v, j) => +(mx[j] - v).toFixed(5)) });
  tris += m.idx.length / 3;
}
fs.writeFileSync(path.join(OUT, 'female.bin.gz'), zlib.gzipSync(pack, { level: 9 }));
fs.writeFileSync(path.join(OUT, 'female.json'), JSON.stringify({
  source: 'Human Reference Atlas (HuBMAP), 3D Reference Organs – Visible Human Female; CC BY 4.0',
  license: 'https://creativecommons.org/licenses/by/4.0/', pack: '/assets/female.bin.gz',
  pelvisCenter: maleCenter.map((v) => +v.toFixed(5)), parts
}));
console.log(`${parts.length} Teile, ${tris} Dreiecke, ${(fs.statSync(path.join(OUT, 'female.bin.gz')).size / 1e6).toFixed(2)} MB (gzip)`);
