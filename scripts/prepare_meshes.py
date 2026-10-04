# Wandelt BodyParts3D-OBJ-Dateien in die gepackten 3D-Daten von CORPUS um.
# Aufruf: python3 scripts/prepare_meshes.py <ordner-mit-manifest.json-und-obj> [ausgabeordner]
# Benötigt NumPy (pip install numpy). Standard-Ausgabe: dist/assets
import json,pathlib,sys,numpy as np,gzip,collections
if len(sys.argv)<2:sys.exit('Aufruf: python3 scripts/prepare_meshes.py <quellordner> [ausgabeordner]')
src=pathlib.Path(sys.argv[1]); out=pathlib.Path(sys.argv[2]) if len(sys.argv)>2 else pathlib.Path(__file__).resolve().parent.parent/'dist'/'assets';out.mkdir(parents=True,exist_ok=True);meta=json.load(open(src/'manifest.json'))
systems={'skeletal system':'bones','muscular system':'muscles','cardiovascular system':'vessels','respiratory system':'respiratory','alimentary system':'digestive','nervous system':'nerves','urinary system':'urinary','genital system':'reproductive','endocrine system':'endocrine','lymphoid system':'lymphatic','sense organ system':'senses','integumentary system':'skin'}
priority=['integumentary system','sense organ system','skeletal system','muscular system','nervous system','urinary system','genital system','endocrine system','lymphoid system','cardiovascular system','respiratory system','alimentary system']
meshes=[];buffers=[];pack=bytearray(); triangles=0
for m in meta['meshes']:
 v=[];f=[]
 for line in open(src/m['file']):
  if line.startswith('v '):v.append(list(map(float,line.split()[1:4])))
  elif line.startswith('f '):
   q=[int(a.split('/')[0])-1 for a in line.split()[1:]]
   for k in range(1,len(q)-1): f.append([q[0],q[k],q[k+1]])
 v=np.array(v,dtype=np.float32);f=np.array(f,dtype=np.uint32)
 # Deterministic vertex clustering: retain real source geometry, reduce redundant vertices.
 step=.8 if len(f)<20000 else 1.35
 keys=np.round(v/step).astype(np.int32);_,inv=np.unique(keys,axis=0,return_inverse=True)
 counts=np.bincount(inv);vv=np.stack([np.bincount(inv,weights=v[:,i])/counts for i in range(3)],axis=1).astype(np.float32)
 ff=inv[f]; ff=ff[(ff[:,0]!=ff[:,1])&(ff[:,1]!=ff[:,2])&(ff[:,0]!=ff[:,2])].astype(np.uint32)
 if len(ff)<len(f)*.15: vv=v;ff=f
 vv=vv[:,[0,2,1]];vv[:,2]*=-1;vv/=1000; vv[:,1]-=.83
 if len(pack)>7000000: buffers.append(pack);pack=bytearray()
 off=len(pack);pack.extend(vv.astype('<f4').tobytes());ioff=len(pack);pack.extend(ff.astype('<u4').tobytes())
 sys=next((systems[s] for s in priority if s in m['systems']),'digestive')
 if sys=='vessels' and any(x in m['name'] for x in ['heart','valve','papillary','ventricle']):sys='heart'
 bmin=vv.min(0);bmax=vv.max(0)
 meshes.append({'id':m['id'],'en':m['name'],'system':sys,'pack':len(buffers),'vo':off,'vc':len(vv),'io':ioff,'ic':ff.size,'center':((bmin+bmax)/2).round(5).tolist(),'size':(bmax-bmin).round(5).tolist()})
 triangles+=len(ff)
buffers.append(pack)
for i,b in enumerate(buffers):
 with gzip.open(out/f'body-{i}.bin.gz','wb',compresslevel=6) as f:f.write(b)
json.dump({'source':meta['source'],'meshes':meshes,'packs':[f'/assets/body-{i}.bin.gz' for i in range(len(buffers))],'triangles':triangles},open(out/'catalog.json','w'),ensure_ascii=False,separators=(',',':'))
print('Converted',len(meshes),'meshes;',triangles,'triangles;',len(buffers),'packs;',round(sum((out/f'body-{i}.bin.gz').stat().st_size for i in range(len(buffers)))/1e6,2),'MB')
