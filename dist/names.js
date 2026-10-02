import {profile,systems} from './knowledge.js';
const map={};
const table=`
wall of heart|Herzwand|Paries cordis
skin|Haut|Cutis
set of head hairs|Kopfhaare|Capilli
set of eyebrows|Augenbrauen|Supercilia
set of pubic hairs|Schamhaare|Pubes
stomach|Magen|Gaster
esophagus|Speiseröhre|Oesophagus
spleen|Milz|Splen
adrenal gland|Nebenniere|Glandula suprarenalis
pituitary gland|Hirnanhangsdrüse|Hypophysis
pineal body|Zirbeldrüse|Glandula pinealis
lobe of thymus|Thymuslappen|Lobus thymi
testis|Hoden|Testis
epididymis|Nebenhoden|Epididymis
prostate|Vorsteherdrüse|Prostata
deferent duct|Samenleiter|Ductus deferens
seminal vesicle|Samenbläschen|Vesicula seminalis
glans penis|Eichel|Glans penis
corpus cavernosum of penis|Penisschwellkörper|Corpus cavernosum penis
corpus spongiosum of penis|Harnröhrenschwellkörper|Corpus spongiosum penis
eyeball|Augapfel|Bulbus oculi
ear|Ohr|Auris
optic nerve|Sehnerv|Nervus opticus
optic tract|Sehbahn|Tractus opticus
optic chiasm|Sehnervenkreuzung|Chiasma opticum
thyroid cartilage|Schildknorpel|Cartilago thyroidea
set of nasal cartilages|Nasenknorpel|Cartilagines nasi
labial part of mouth|Lippenregion|Labia oris
gingiva of upper jaw|Zahnfleisch des Oberkiefers|Gingiva maxillae
gingiva of lower jaw|Zahnfleisch des Unterkiefers|Gingiva mandibulae
frontal bone|Stirnbein|Os frontale
occipital bone|Hinterhauptbein|Os occipitale
sphenoid bone|Keilbein|Os sphenoidale
temporal bone|Schläfenbein|Os temporale
ethmoid|Siebbein|Os ethmoidale
mandible|Unterkiefer|Mandibula
hyoid bone|Zungenbein|Os hyoideum
parietal bone|Scheitelbein|Os parietale
zygomatic bone|Jochbein|Os zygomaticum
lacrimal bone|Tränenbein|Os lacrimale
nasal bone|Nasenbein|Os nasale
maxilla|Oberkiefer|Maxilla
palatine bone|Gaumenbein|Os palatinum
inferior nasal concha|Untere Nasenmuschel|Concha nasalis inferior
vomer|Pflugscharbein|Vomer
atlas|Erster Halswirbel|Atlas
axis|Zweiter Halswirbel|Axis
sacrum|Kreuzbein|Os sacrum
hip bone|Hüftbein|Os coxae
costal cartilage|Rippenknorpel|Cartilago costalis
manubrium|Brustbeingriff|Manubrium sterni
body of sternum|Brustbeinkörper|Corpus sterni
xiphoid process|Schwertfortsatz|Processus xiphoideus
scaphoid|Kahnbein der Hand|Os scaphoideum
lunate|Mondbein|Os lunatum
triquetral|Dreiecksbein|Os triquetrum
pisiform|Erbsenbein|Os pisiforme
trapezium|Großes Vieleckbein|Os trapezium
trapezoid|Kleines Vieleckbein|Os trapezoideum
capitate|Kopfbein|Os capitatum
hamate|Hakenbein|Os hamatum
navicular bone of foot|Kahnbein des Fußes|Os naviculare
medial cuneiform bone|Inneres Keilbein|Os cuneiforme mediale
intermediate cuneiform bone|Mittleres Keilbein|Os cuneiforme intermedium
lateral cuneiform bone|Äußeres Keilbein|Os cuneiforme laterale
cuboid bone|Würfelbein|Os cuboideum
sesamoid bone of foot|Sesambein des Fußes|Os sesamoideum pedis
interosseous membrane of forearm|Zwischenknochenmembran des Unterarms|Membrana interossea antebrachii
interosseous membrane of leg|Zwischenknochenmembran des Unterschenkels|Membrana interossea cruris
long plantar ligament|Langes Sohlenband|Ligamentum plantare longum
inguinal ligament|Leistenband|Ligamentum inguinale
iliotibial tract|Seitlicher Oberschenkelfaszienstreifen|Tractus iliotibialis
flexor retinaculum of wrist|Beugesehnenhalteband|Retinaculum flexorum
linea alba|Weiße Bauchlinie|Linea alba
aponeurosis of epicranius|Schädel-Sehnenhaube|Galea aponeurotica
intermediate tendon|Zwischensehne|Tendo intermedius
tendinous arch of levator ani|Sehnenbogen des Afterhebers|Arcus tendineus musculi levatoris ani
ascending aorta|Aufsteigende Hauptschlagader|Aorta ascendens
arch of aorta|Aortenbogen|Arcus aortae
descending aorta|Absteigende Hauptschlagader|Aorta descendens
inferior vena cava|Untere Hohlvene|Vena cava inferior
superior vena cava|Obere Hohlvene|Vena cava superior
pulmonary artery|Lungenschlagader|Arteria pulmonalis
pulmonary vein|Lungenvene|Vena pulmonalis
common carotid artery|Gemeinsame Halsschlagader|Arteria carotis communis
brachiocephalic artery|Arm-Kopf-Gefäßstamm|Truncus brachiocephalicus
subclavian artery|Unterschlüsselbeinarterie|Arteria subclavia
brachiocephalic vein|Arm-Kopf-Vene|Vena brachiocephalica
internal jugular vein|Innere Drosselvene|Vena jugularis interna
subclavian vein|Unterschlüsselbeinvene|Vena subclavia
renal artery|Nierenarterie|Arteria renalis
renal vein|Nierenvene|Vena renalis
splenic artery|Milzarterie|Arteria splenica
splenic vein|Milzvene|Vena splenica
celiac artery|Bauchhöhlenstamm|Truncus coeliacus
common hepatic artery|Gemeinsame Leberarterie|Arteria hepatica communis
gastric artery|Magenarterie|Arteria gastrica
superior mesenteric artery|Obere Gekrösearterie|Arteria mesenterica superior
inferior mesenteric artery|Untere Gekrösearterie|Arteria mesenterica inferior
superior mesenteric vein|Obere Gekrösevene|Vena mesenterica superior
common iliac artery|Gemeinsame Beckenarterie|Arteria iliaca communis
external iliac artery|Äußere Beckenarterie|Arteria iliaca externa
internal iliac artery|Innere Beckenarterie|Arteria iliaca interna
common iliac vein|Gemeinsame Beckenvene|Vena iliaca communis
external iliac vein|Äußere Beckenvene|Vena iliaca externa
internal iliac vein|Innere Beckenvene|Vena iliaca interna
coronary sinus|Herzvenensammelgefäß|Sinus coronarius
great cardiac vein|Große Herzvene|Vena cardiaca magna
middle cardiac vein|Mittlere Herzvene|Vena cardiaca media
set of anterior cardiac veins|Vordere Herzvenen|Venae cardiacae anteriores
set of posterior veins of ventricle|Hintere Herzkammervenen|Venae posteriores ventriculi
stem of coronary artery|Stamm der Herzkranzarterie|Truncus arteriae coronariae
trunk of coronary artery|Stamm der Herzkranzarterie|Truncus arteriae coronariae
circumflex branch of coronary artery|Umschlingender Herzkranzarterienast|Ramus circumflexus
marginal branch of coronary artery|Randast der Herzkranzarterie|Ramus marginalis
anterior interventricular branch of coronary artery|Vorderer Zwischenkammerast|Ramus interventricularis anterior
posterior interventricular branch of coronary artery|Hinterer Zwischenkammerast|Ramus interventricularis posterior
posterolateral branch of coronary artery|Hinterer seitlicher Herzkranzast|Ramus posterolateralis
set of interventricular septal branches of coronary artery|Äste zur Kammerscheidewand|Rami interventriculares septales
white matter structure of cerebral hemisphere|Weiße Substanz der Großhirnhälfte|Substantia alba hemispherii cerebri
septum pellucidum|Durchsichtige Scheidewand|Septum pellucidum
anterior commissure|Vordere Hirnkommissur|Commissura anterior
posterior commissure|Hintere Hirnkommissur|Commissura posterior
commissure of fornix of forebrain|Kommissur des Hirngewölbes|Commissura fornicis
fornix of forebrain|Hirngewölbe|Fornix
lamina terminalis|Endplatte des Zwischenhirns|Lamina terminalis
midbrain|Mittelhirn|Mesencephalon
habenula|Zügelregion|Habenula
peduncle of midbrain|Großhirnschenkel|Pedunculus cerebri
tuber cinereum|Grauer Höcker|Tuber cinereum
caudate nucleus|Schweifkern|Nucleus caudatus
putamen|Schalenkern|Putamen
globus pallidus|Blasser Kern|Globus pallidus
amygdala|Mandelkern|Corpus amygdaloideum
anterior limb of internal capsule|Vorderer Schenkel der inneren Kapsel|Crus anterius capsulae internae
stria terminalis|Grenzstreifen|Stria terminalis
stria medullaris of thalamus|Markstreifen des Thalamus|Stria medullaris thalami
occipital lobe|Hinterhauptlappen|Lobus occipitalis
insula|Inselrinde|Insula
lateral geniculate body|Seitlicher Kniehöcker|Corpus geniculatum laterale
medial geniculate body|Mittlerer Kniehöcker|Corpus geniculatum mediale
superior colliculus|Oberer Hügel der Vierhügelplatte|Colliculus superior
inferior colliculus|Unterer Hügel der Vierhügelplatte|Colliculus inferior
brachium of superior colliculus|Arm des oberen Hügels|Brachium colliculi superioris
brachium of inferior colliculus|Arm des unteren Hügels|Brachium colliculi inferioris
mammillary body|Mamillarkörper|Corpus mamillare
interpeduncular fossa|Grube zwischen den Hirnschenkeln|Fossa interpeduncularis
interventricular foramen|Zwischenkammeröffnung|Foramen interventriculare
lateral ventricle|Seitenventrikel|Ventriculus lateralis
third ventricle|Dritter Hirnventrikel|Ventriculus tertius
fourth ventricle|Vierter Hirnventrikel|Ventriculus quartus
cerebral aqueduct|Hirnwasserkanal|Aqueductus mesencephali
central canal of spinal cord|Zentralkanal des Rückenmarks|Canalis centralis
choroid plexus of cerebral hemisphere|Adergeflecht der Großhirnhälfte|Plexus choroideus
superior parietal lobule precuneus|Oberes Scheitelläppchen / Vorzwickel|Lobulus parietalis superior / Precuneus
orbital gyri straight gyrus|Orbitale Windungen / gerade Windung|Gyri orbitales / Gyrus rectus
superior frontal gyrus|Obere Stirnwindung|Gyrus frontalis superior
middle frontal gyrus|Mittlere Stirnwindung|Gyrus frontalis medius
precentral gyrus|Vordere Zentralwindung|Gyrus precentralis
postcentral gyrus|Hintere Zentralwindung|Gyrus postcentralis
supramarginal gyrus|Überrandwindung|Gyrus supramarginalis
angular gyrus|Winkelwindung|Gyrus angularis
middle temporal gyrus|Mittlere Schläfenwindung|Gyrus temporalis medius
inferior temporal gyrus|Untere Schläfenwindung|Gyrus temporalis inferior
superior temporal gyrus|Obere Schläfenwindung|Gyrus temporalis superior
fusiform gyrus|Spindelwindung|Gyrus fusiformis
accessory short gyrus|Zusätzliche kurze Inselwindung|Gyrus brevis accessorius
parahippocampal gyrus|Windung neben dem Hippocampus|Gyrus parahippocampalis
cingulate gyrus|Gürtelwindung|Gyrus cinguli
mesocolic taenia|Gekröseband des Dickdarms|Taenia mesocolica
omental taenia|Netzband des Dickdarms|Taenia omentalis
free taenia|Freies Längsband des Dickdarms|Taenia libera
`;
table.trim().split('\n').forEach(l=>{const [e,de,la]=l.split('|');map[e]=[de,la]});
const muscle=`sternohyoid|Brustbein-Zungenbein-Muskel|sternohyoideus
omohyoid|Schulter-Zungenbein-Muskel|omohyoideus
sternothyroid|Brustbein-Schildknorpel-Muskel|sternothyroideus
thyrohyoid|Schildknorpel-Zungenbein-Muskel|thyrohyoideus
pectoralis minor|Kleiner Brustmuskel|pectoralis minor
rectus abdominis|Gerader Bauchmuskel|rectus abdominis
external oblique|Äußerer schräger Bauchmuskel|obliquus externus abdominis
internal oblique|Innerer schräger Bauchmuskel|obliquus internus abdominis
transversus abdominis|Querer Bauchmuskel|transversus abdominis
rhomboid major|Großer Rautenmuskel|rhomboideus major
rhomboid minor|Kleiner Rautenmuskel|rhomboideus minor
scalenus posterior|Hinterer Treppenmuskel|scalenus posterior
scalenus medius|Mittlerer Treppenmuskel|scalenus medius
scalenus anterior|Vorderer Treppenmuskel|scalenus anterior
serratus anterior|Vorderer Sägemuskel|serratus anterior
serratus posterior superior|Oberer hinterer Sägemuskel|serratus posterior superior
serratus posterior inferior|Unterer hinterer Sägemuskel|serratus posterior inferior
sternocleidomastoid|Kopfwender|sternocleidomastoideus
subclavius|Unterschlüsselbeinmuskel|subclavius
iliacus|Darmbeinmuskel|iliacus
obturator internus|Innerer Hüftlochmuskel|obturatorius internus
obturator externus|Äußerer Hüftlochmuskel|obturatorius externus
gluteus minimus|Kleiner Gesäßmuskel|gluteus minimus
gemellus superior|Oberer Zwillingsmuskel|gemellus superior
gemellus inferior|Unterer Zwillingsmuskel|gemellus inferior
quadratus femoris|Quadratischer Schenkelmuskel|quadratus femoris
piriformis|Birnenförmiger Muskel|piriformis
psoas major|Großer Lendenmuskel|psoas major
pyramidalis|Pyramidenmuskel|pyramidalis
quadratus lumborum|Quadratischer Lendenmuskel|quadratus lumborum
sartorius|Schneidermuskel|sartorius
semitendinosus|Halbsehnenmuskel|semitendinosus
semimembranosus|Halbmembranmuskel|semimembranosus
tensor fasciae latae|Schenkelbindenspanner|tensor fasciae latae
pectineus|Kammmuskel|pectineus
adductor brevis|Kurzer Schenkelanzieher|adductor brevis
adductor longus|Langer Schenkelanzieher|adductor longus
adductor magnus|Großer Schenkelanzieher|adductor magnus
adductor minimus|Kleinster Schenkelanzieher|adductor minimus
gracilis|Schlanker Muskel|gracilis
extensor hallucis longus|Langer Großzehenstrecker|extensor hallucis longus
extensor digitorum longus|Langer Zehenstrecker|extensor digitorum longus
fibularis tertius|Dritter Wadenbeinmuskel|fibularis tertius
fibularis longus|Langer Wadenbeinmuskel|fibularis longus
fibularis brevis|Kurzer Wadenbeinmuskel|fibularis brevis
plantaris|Sohlenmuskel|plantaris
popliteus|Kniekehlenmuskel|popliteus
splenius cervicis|Halsriemenmuskel|splenius cervicis
splenius capitis|Kopfriemenmuskel|splenius capitis
iliocostalis lumborum|Lenden-Darmbein-Rippenmuskel|iliocostalis lumborum
iliocostalis thoracis|Brust-Darmbein-Rippenmuskel|iliocostalis thoracis
iliocostalis cervicis|Hals-Darmbein-Rippenmuskel|iliocostalis cervicis
longissimus thoracis|Längster Brustmuskel|longissimus thoracis
longissimus capitis|Längster Kopfmuskel|longissimus capitis
longissimus cervicis|Längster Halsmuskel|longissimus cervicis
spinalis thoracis|Brust-Dornfortsatzmuskel|spinalis thoracis
spinalis cervicis|Hals-Dornfortsatzmuskel|spinalis cervicis
semispinalis thoracis|Halbdornmuskel der Brust|semispinalis thoracis
semispinalis cervicis|Halbdornmuskel des Halses|semispinalis cervicis
semispinalis capitis|Halbdornmuskel des Kopfes|semispinalis capitis
multifidus|Vielgefiederter Rückenmuskel|multifidus
thoracic rotator|Brustwirbeldreher|rotator thoracis
lumbar rotator|Lendenwirbeldreher|rotator lumborum
cervical rotator|Halswirbeldreher|rotator cervicis
rectus capitis posterior major|Großer hinterer gerader Kopfmuskel|rectus capitis posterior major
rectus capitis posterior minor|Kleiner hinterer gerader Kopfmuskel|rectus capitis posterior minor
obliquus capitis superior|Oberer schräger Kopfmuskel|obliquus capitis superior
obliquus capitis inferior|Unterer schräger Kopfmuskel|obliquus capitis inferior
levator scapulae|Schulterblattheber|levator scapulae
teres major|Großer Rundmuskel|teres major
teres minor|Kleiner Rundmuskel|teres minor
trapezius|Trapezmuskel|trapezius
abductor pollicis brevis|Kurzer Daumenabspreizer|abductor pollicis brevis
abductor pollicis longus|Langer Daumenabspreizer|abductor pollicis longus
opponens pollicis|Daumengegensteller|opponens pollicis
abductor digiti minimi|Kleinfinger-/Kleinzehenabspreizer|abductor digiti minimi
flexor digiti minimi brevis|Kurzer Kleinfinger-/Kleinzehenbeuger|flexor digiti minimi brevis
opponens digiti minimi|Kleinfinger-/Kleinzehengegensteller|opponens digiti minimi
abductor hallucis|Großzehenabspreizer|abductor hallucis
flexor digitorum brevis|Kurzer Zehenbeuger|flexor digitorum brevis
flexor hallucis brevis|Kurzer Großzehenbeuger|flexor hallucis brevis
adductor hallucis|Großzehenanzieher|adductor hallucis
flexor accessorius|Quadratischer Sohlenmuskel|quadratus plantae
flexor pollicis brevis|Kurzer Daumenbeuger|flexor pollicis brevis
adductor pollicis|Daumenanzieher|adductor pollicis
platysma|Flächiger Halsmuskel|platysma
stylohyoid|Griffelfortsatz-Zungenbein-Muskel|stylohyoideus
pubococcygeus|Schambein-Steißbein-Muskel|pubococcygeus
puborectalis|Schambein-Mastdarm-Muskel|puborectalis
iliococcygeus|Darmbein-Steißbein-Muskel|iliococcygeus
coccygeus|Steißbeinmuskel|coccygeus
longus colli|Langer Halsmuskel|longus colli
digastric|Zweibäuchiger Muskel|digastricus
longus capitis|Langer Kopfmuskel|longus capitis
rectus capitis anterior|Vorderer gerader Kopfmuskel|rectus capitis anterior
rectus capitis lateralis|Seitlicher gerader Kopfmuskel|rectus capitis lateralis
mylohyoid|Kiefer-Zungenbein-Muskel|mylohyoideus
geniohyoid|Kinn-Zungenbein-Muskel|geniohyoideus
frontalis|Stirnmuskel|frontalis
occipitalis|Hinterhauptmuskel|occipitalis
temporoparietalis|Schläfen-Scheitel-Muskel|temporoparietalis
orbicularis oculi|Augenringmuskel|orbicularis oculi
corrugator supercilii|Augenbrauenrunzler|corrugator supercilii
levator labii superioris alaeque nasi|Oberlippen- und Nasenflügelheber|levator labii superioris alaeque nasi
levator labii superioris|Oberlippenheber|levator labii superioris
zygomaticus major|Großer Jochbeinmuskel|zygomaticus major
zygomaticus minor|Kleiner Jochbeinmuskel|zygomaticus minor
depressor labii inferioris|Unterlippensenker|depressor labii inferioris
levator anguli oris|Mundwinkelheber|levator anguli oris
mentalis|Kinnmuskel|mentalis
depressor anguli oris|Mundwinkelsenker|depressor anguli oris
buccinator|Wangenmuskel|buccinator
risorius|Lachmuskel|risorius
orbicularis oris|Mundringmuskel|orbicularis oris
masseter|Kaumuskel|masseter
temporalis|Schläfenmuskel|temporalis
medial pterygoid|Innerer Flügelmuskel|pterygoideus medialis
lateral pterygoid|Äußerer Flügelmuskel|pterygoideus lateralis
extensor digitorum brevis|Kurzer Zehenstrecker|extensor digitorum brevis
extensor hallucis brevis|Kurzer Großzehenstrecker|extensor hallucis brevis
nasalis|Nasenmuskel|nasalis
depressor septi nasi|Nasenscheidewandsenker|depressor septi nasi
procerus|Nasenwurzelmuskel|procerus
flexor hallucis longus|Langer Großzehenbeuger|flexor hallucis longus
flexor digitorum longus|Langer Zehenbeuger|flexor digitorum longus
tibialis posterior|Hinterer Schienbeinmuskel|tibialis posterior
brachialis|Oberarmmuskel|brachialis
coracobrachialis|Hakenarmmuskel|coracobrachialis
anconeus|Knorrenmuskel|anconeus
pronator teres|Runder Einwärtsdreher|pronator teres
flexor carpi radialis|Speichenseitiger Handbeuger|flexor carpi radialis
palmaris longus|Langer Hohlhandmuskel|palmaris longus
flexor carpi ulnaris|Ellenseitiger Handbeuger|flexor carpi ulnaris
flexor digitorum superficialis|Oberflächlicher Fingerbeuger|flexor digitorum superficialis
flexor digitorum profundus|Tiefer Fingerbeuger|flexor digitorum profundus
flexor pollicis longus|Langer Daumenbeuger|flexor pollicis longus
pronator quadratus|Quadratischer Einwärtsdreher|pronator quadratus
brachioradialis|Oberarm-Speichen-Muskel|brachioradialis
extensor carpi radialis longus|Langer speichenseitiger Handstrecker|extensor carpi radialis longus
extensor carpi radialis brevis|Kurzer speichenseitiger Handstrecker|extensor carpi radialis brevis
extensor digitorum|Fingerstrecker|extensor digitorum
extensor digiti minimi|Kleinfingerstrecker|extensor digiti minimi
extensor carpi ulnaris|Ellenseitiger Handstrecker|extensor carpi ulnaris
supinator|Auswärtsdreher|supinator
extensor pollicis brevis|Kurzer Daumenstrecker|extensor pollicis brevis
extensor pollicis longus|Langer Daumenstrecker|extensor pollicis longus
extensor indicis|Zeigefingerstrecker|extensor indicis
external anal sphincter|Äußerer Afterschließmuskel|sphincter ani externus
external intercostal muscle|Äußere Zwischenrippenmuskeln|intercostales externi
internal intercostal muscle|Innere Zwischenrippenmuskeln|intercostales interni
innermost intercostal muscle|Innerste Zwischenrippenmuskeln|intercostales intimi
transversus thoracis|Querer Brustmuskel|transversus thoracis
vastus lateralis|Äußerer breiter Oberschenkelmuskel|vastus lateralis
vastus medialis|Innerer breiter Oberschenkelmuskel|vastus medialis
vastus intermedius|Mittlerer breiter Oberschenkelmuskel|vastus intermedius`;
muscle.split('\n').forEach(l=>{const[e,de,la]=l.split('|');map[e]=[de,'Musculus '+la]});
const modifiers={'long head':'langer Kopf','short head':'kurzer Kopf','lateral head':'seitlicher Kopf','medial head':'innerer Kopf','humeral head':'Oberarmkopf','ulnar head':'Ellenkopf','radial head':'Speichenkopf','humeroulnar head':'Oberarm-Ellen-Kopf','superficial head':'oberflächlicher Kopf','deep head':'tiefer Kopf','oblique head':'schräger Kopf','transverse head':'querer Kopf','upper head':'oberer Kopf','lower head':'unterer Kopf','anterior belly':'vorderer Bauch','posterior belly':'hinterer Bauch','ascending part':'aufsteigender Anteil','descending part':'absteigender Anteil','transverse part':'querer Anteil','clavicular part':'Schlüsselbeinanteil','acromial part':'Schulterhöhenanteil','spinal part':'Schulterblattgrätenanteil','sternocostal part':'Brustbein-Rippen-Anteil','abdominal part':'Bauchanteil','superficial part':'oberflächlicher Anteil','deep part':'tiefer Anteil','orbital part':'Augenhöhlenanteil','palpebral part':'Lidanteil','anterior part':'vorderer Anteil','posterior part':'hinterer Anteil','superior oblique part':'oberer schräger Anteil','inferior oblique part':'unterer schräger Anteil','vertical intermediate part':'mittlerer senkrechter Anteil'};
const ordinal=['first','second','third','fourth','fifth','sixth','seventh','eighth','ninth','tenth','eleventh','twelfth'];
export function nameOf(m){let en=m.en.replace(/, nsn/g,'');const side=/\bleft\b/.test(en)?'links':/\bright\b/.test(en)?'rechts':'';en=en.replace(/\b(left|right)\b/g,'').replace(/\s+/g,' ').trim();let modifier='';for(const[k,v]of Object.entries(modifiers)){if(en.startsWith(k+' of ')){en=en.slice(k.length+4);modifier=v;break;}}
let found=map[en];const number=ordinal.findIndex(x=>new RegExp('\\b'+x+'\\b').test(en))+1;
if(!found&&en.includes('vertebra')&&!en.includes('disk')){const r=en.includes('cervical')?['Halswirbel','Vertebra cervicalis','C']:en.includes('thoracic')?['Brustwirbel','Vertebra thoracica','Th']:['Lendenwirbel','Vertebra lumbalis','L'];found=[r[0]+' '+r[2]+number,r[1]+' '+number];}
if(!found&&en.includes('intervertebral disk')){const r=en.includes('cervical')||en.includes('axis')?'Hals':en.includes('thoracic')?'Brust':'Lenden';found=['Bandscheibe · '+r+'wirbelsäule'+(number?' '+number:en.includes('axis')?' 2':''),'Discus intervertebralis'];}
if(!found&&/\brib\b/.test(en))found=['Rippe '+number,'Costa '+number];
if(!found&&en.includes('costal cartilage'))found=['Rippenknorpel'+(number?' '+number:''),'Cartilago costalis'];
if(!found&&en.includes('metacarpal'))found=['Mittelhandknochen '+number,'Os metacarpale '+number];
if(!found&&en.includes('metatarsal'))found=['Mittelfußknochen '+number,'Os metatarsale '+number];
if(!found&&en.includes('phalanx')){const pos=en.startsWith('proximal')?['Grundglied','proximalis']:en.startsWith('middle')?['Mittelglied','media']:['Endglied','distalis'];const digit=en.includes('thumb')?'Daumen':en.includes('index finger')?'Zeigefinger':en.includes('middle finger')?'Mittelfinger':en.includes('ring finger')?'Ringfinger':en.includes('little finger')?'Kleinfinger':en.includes('big toe')?'Großzehe':en.includes('little toe')?'Kleinzehe':'Zehe '+number;found=[pos[0]+' · '+digit,'Phalanx '+pos[1]];}
if(!found&&en.includes('tooth')){const t=en.includes('premolar')?['Vormahlzahn','Dens premolaris']:en.includes('molar')?['Mahlzahn','Dens molaris']:en.includes('canine')?['Eckzahn','Dens caninus']:['Schneidezahn','Dens incisivus'];found=[t[0]+' · '+(en.includes('upper')?'Oberkiefer':'Unterkiefer')+(number?' '+number:'')+(en.includes('central')?' · mittig':en.includes('lateral')?' · seitlich':''),t[1]];}
if(!found&&en.includes('lobe of lung'))found=[(en.includes('upper')?'Oberer':en.includes('lower')?'Unterer':'Mittlerer')+' Lungenlappen','Lobus '+(en.includes('upper')?'superior':en.includes('lower')?'inferior':'medius')+' pulmonis'];
if(!found&&/ (of foot|of hand)$/.test(en)){const ending=en.endsWith('of foot')?'Fuß':'Hand';const b=en.replace(/ of (foot|hand)$/,'');if(map[b]){found=[map[b][0].replace('Kleinfinger-/Kleinzehen',ending==='Fuß'?'Kleinzehen':'Kleinfinger')+' · '+ending,map[b][1]];}}
if(!found&&/interspinal|intertransvers|interosse|lumbrical|levatores costarum/.test(en)){const t=en.includes('interspinal')?['Zwischendornmuskeln','Musculi interspinales']:en.includes('intertransvers')?['Zwischenquerfortsatzmuskeln','Musculi intertransversarii']:en.includes('lumbrical')?['Wurmförmige Muskeln','Musculi lumbricales']:en.includes('levatores')?['Rippenheber','Musculi levatores costarum']:['Zwischenknochenmuskeln','Musculi interossei'];const place=en.includes('hand')?'Hand':en.includes('foot')?'Fuß':en.includes('cervic')?'Hals':en.includes('lumb')?'Lende':en.includes('thorac')?'Brust':'';found=[t[0]+(place?' · '+place:'')+(number?' '+number:''),t[1]];modifier+=(en.includes('dorsal')?' · rückseitig':en.includes('palmar')?' · handflächenseitig':en.includes('plantar')?' · sohlenseitig':'')+(en.includes('anterior')?' · vorn':en.includes('posterior')?' · hinten':'')+(en.includes('longi')?' · lang':en.includes('breves')?' · kurz':'');}
if(!found){const p=profile({...m,en});if(p)found=[p[1],p[2]];}
if(!found)return{de:systems[m.system].name+' · '+m.id,latin:null,side,modifier,untranslated:true};
return{de:found[0]+(side?' · '+side:''),latin:found[1],side,modifier:modifier.replace(/^ · /,''),untranslated:false};}
