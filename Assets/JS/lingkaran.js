const $=s=>document.querySelector(s),C=230,S=14,D=Math.PI/180,mod=a=>((a%360)+360)%360,f=v=>v.toFixed(1);
const svg=$('#stage');
let mode='unsur',drag=null,handles=[],vis=new Set(['pusat','jari','diam','tali','apo']);
const def=()=>({r:6,tA:30,tB:130,tP:250,th:100,al:40,ph:20,E:[40,-30],P:[200,0]});
let st=def();
const R=()=>st.r*S,pc=t=>[R()*Math.cos(t*D),R()*Math.sin(t*D)],xy=p=>(C+p[0]).toFixed(1)+','+(C-p[1]).toFixed(1);
const ang=p=>mod(Math.atan2(p[1],p[0])/D);
const ln=(a,b,c,w=2.5,d='')=>`<line x1="${C+a[0]}" y1="${C-a[1]}" x2="${C+b[0]}" y2="${C-b[1]}" stroke="${c}" stroke-width="${w}" stroke-dasharray="${d}" stroke-linecap="round"/>`;
const tx=(p,t,c='currentColor',dx=0,dy=0)=>`<text x="${C+p[0]+dx}" y="${C-p[1]+dy}" fill="${c}" font-size="14" font-weight="700" text-anchor="middle" style="font-family:Poppins,sans-serif">${t}</text>`;
const arc=(s,sp,c,w=5)=>{const a=pc(s),b=pc(s+sp);return `<path d="M${xy(a)}A${R()} ${R()} 0 ${sp>180?1:0} 0 ${xy(b)}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`};
const wedge=(v,s,sp,rad,c,label)=>{const p1=[v[0]+rad*Math.cos(s*D),v[1]+rad*Math.sin(s*D)],p2=[v[0]+rad*Math.cos((s+sp)*D),v[1]+rad*Math.sin((s+sp)*D)],m=s+sp/2,lp=[v[0]+(rad+18)*Math.cos(m*D),v[1]+(rad+18)*Math.sin(m*D)-4];return `<path d="M${xy(v)}L${xy(p1)}A${rad} ${rad} 0 ${sp>180?1:0} 0 ${xy(p2)}Z" fill="${c}" fill-opacity=".35" stroke="${c}"/>`+tx(lp,label,c)};
const name=(t,l,c)=>{const p=pc(t),q=[p[0]*(R()+18)/R(),p[1]*(R()+18)/R()-0];return tx([q[0],q[1]-5],l,c)};
/* busur yang tidak memuat titik lain: kembalikan [start,span] */
const arcEx=(a,b,others)=>{const g=mod(b-a);return others.some(o=>mod(o-a)<g)?[b,360-g]:[a,g]};
const hit=(e,dir,sg)=>{const d=[Math.cos(dir*D),Math.sin(dir*D)],b=e[0]*d[0]+e[1]*d[1],c=e[0]**2+e[1]**2-R()**2,q=Math.sqrt(Math.max(b*b-c,0)),t=sg>0?-b+q:-b-q;return[e[0]+t*d[0],e[1]+t*d[1]]};
const PK='#FF3B9D',PU='#662E9B',GR='#1a9d6a',OR='#e08a00',GY='#8a8a9a';
const cfg={
 unsur:{s:[['r','Jari-jari (r)',2,10,.5,' cm'],['thU','Sudut pusat ∠AOB',10,350,1,'°']],steps:[
  'Geser slider <b>jari-jari</b>. Perhatikan nilai d selalu 2 × r.',
  'Seret titik <b>A</b> dan <b>B</b> di sepanjang lingkaran. Panjang tali busur AB dan apotema ikut berubah.',
  'Aktifkan <b>Juring</b> dan <b>Tembereng</b>, lalu bandingkan luasnya saat sudut ∠AOB diperbesar.',
  'Jadikan ∠AOB = 180°. Tali busur AB menjadi diameter dan apotema menjadi 0.']},
 pusat:{s:[['r','Jari-jari (r)',2,10,.5,' cm']],steps:[
  'Seret titik <b>A</b> dan <b>B</b> untuk menentukan busur AB.',
  'Seret titik <b>P</b> (sudut keliling) ke posisi mana pun pada lingkaran.',
  'Bandingkan ∠AOB dan ∠APB. Selama P di luar busur AB, ∠AOB selalu 2 × ∠APB.',
  'Atur AB menjadi diameter. Berapa ∠APB? (Jawab: 90°).']},
 dalam:{s:[['r','Jari-jari (r)',2,10,.5,' cm'],['th','Sudut antar tali busur',20,160,1,'°'],['al','Putar tali busur',0,360,1,'°']],steps:[
  'Seret titik <b>E</b> (perpotongan) di dalam lingkaran.',
  'Ubah <b>sudut antar tali busur</b>, lalu amati dua busur yang dihadapi sudut ini dan sudut bertolak belakangnya.',
  'Hitung ½ × (busur AB + busur CD) dan cocokkan dengan ∠AEB.',
  'Putar tali busur. Apakah hasilnya tetap sama?']},
 luar:{s:[['r','Jari-jari (r)',2,10,.5,' cm'],['ph','Sudut antar garis',4,60,1,'°']],steps:[
  'Seret titik <b>P</b> di luar lingkaran. Dua garis memotong lingkaran di dua titik masing-masing.',
  'Ubah <b>sudut antar garis</b>, lalu amati busur dekat (hijau) dan busur jauh (oranye).',
  'Hitung ½ × (busur jauh − busur dekat) dan cocokkan dengan ∠P.',
  'Dekatkan P ke lingkaran. Busur dekat mengecil dan hasilnya tetap cocok.']}
};
const val=k=>k==='thU'?mod(st.tB-st.tA):st[k];
function setv(k,v){
 if(k==='thU') st.tB=st.tA+v;
 else st[k]=v;
}
function clampUnsurAngle(moved, angle){
 // Hindari A dan B bertumpuk sehingga nilai sudut/tali busur tetap bermakna.
 const min=10, max=350;
 if(moved==='A'){
   st.tA=angle;
   const delta=mod(st.tB-st.tA);
   if(delta<min) st.tA=st.tB-min;
   else if(delta>max) st.tA=st.tB-max;
 } else {
   st.tB=angle;
   const delta=mod(st.tB-st.tA);
   if(delta<min) st.tB=st.tA+min;
   else if(delta>max) st.tB=st.tA+max;
 }
}
function render(){
 const c=cfg[mode],R_=R();let g=`<circle cx="${C}" cy="${C}" r="${R_}" fill="${PK}" fill-opacity=".06" stroke="${PU}" stroke-width="3"/>`,rd=[],ru='';handles=[];
 const O=[0,0];
 if(mode==='unsur'){
  const th=mod(st.tB-st.tA)||1,A=pc(st.tA),B=pc(st.tB),big=th>180?1:0,r=st.r;
  const jur=th/360*Math.PI*r*r,teb=jur-.5*r*r*Math.abs(Math.sin(th*D)),tali=2*r*Math.abs(Math.sin(th*D/2)),apo=Math.abs(r*Math.cos(th*D/2)),bus=th/360*2*Math.PI*r;
  if(vis.has('juring'))g+=`<path d="M${xy(O)}L${xy(A)}A${R_} ${R_} 0 ${big} 0 ${xy(B)}Z" fill="${PK}" fill-opacity=".3"/>`;
  if(vis.has('temb'))g+=`<path d="M${xy(A)}A${R_} ${R_} 0 ${big} 0 ${xy(B)}Z" fill="${PU}" fill-opacity=".35"/>`;
  if(vis.has('busur'))g+=arc(st.tA,th,OR,6);
  if(vis.has('diam')){const b2=[-B[0],-B[1]];g+=ln(B,b2,PU,2.5)+tx([b2[0]*.5+10,b2[1]*.5+16],'d',PU)}
  if(vis.has('jari')){g+=ln(O,A,PK,3)+tx([A[0]/2-10,A[1]/2+14],'r',PK)}
  if(vis.has('tali'))g+=ln(A,B,GR,3);
  if(vis.has('apo')){const M=[(A[0]+B[0])/2,(A[1]+B[1])/2];g+=ln(O,M,OR,2,'5 4')+tx([M[0]/2+12,M[1]/2],'apotema',OR)}
  if(vis.has('pusat'))g+=`<circle cx="${C}" cy="${C}" r="4.5" fill="${txc()}"/>`+tx([-12,-8],'O');
  g+=name(st.tA,'A',PK)+name(st.tB,'B',PK);handles=[{k:'A',p:A},{k:'B',p:B}];
  rd=[['Diameter d',f(2*r)+' cm'],['Tali busur AB',f(tali)+' cm'],['Apotema',f(apo)+' cm'],['Panjang busur',f(bus)+' cm'],['Luas juring',f(jur)+' cm²'],['Luas tembereng',f(teb)+' cm²']];
  ru='r = jari-jari; θ = sudut pusat; d = diameter; c = tali busur; a = apotema.<br>d = 2r<br>c = 2r sin(θ/2) (θ sudut pusat kecil, 0°–180°)<br>a = r|cos(θ/2)| (atau a = √[r² − (c/2)²])<br>s = (θ/360°)·2πr; luas juring = (θ/360°)·πr²<br>Luas tembereng = luas juring − ½r²|sin θ| untuk sudut yang ditampilkan (gunakan luas juring kecil untuk tembereng kecil; untuk tembereng besar, luas lingkaran dikurangi tembereng kecil).';
 }else if(mode==='pusat'){
  const A=pc(st.tA),B=pc(st.tB),P=pc(st.tP),[s,sp]=arcEx(st.tA,st.tB,[st.tP]);
  g+=arc(s,sp,OR,6)+ln(O,A,PK)+ln(O,B,PK)+ln(P,A,PU)+ln(P,B,PU);
  g+=wedge(O,s,sp,34,PK,f(sp)+'°');
  const aA=ang([A[0]-P[0],A[1]-P[1]]),aB=ang([B[0]-P[0],B[1]-P[1]]);
  const dd=mod(aB-aA),[ps,pp]=dd>180?[aB,360-dd]:[aA,dd];
  g+=wedge(P,ps,pp,30,PU,f(sp/2)+'°')+`<circle cx="${C}" cy="${C}" r="4" fill="${txc()}"/>`+name(st.tA,'A',PK)+name(st.tB,'B',PK)+name(st.tP,'P',PU);
  handles=[{k:'A',p:A},{k:'B',p:B},{k:'P',p:P}];
  rd=[['Sudut pusat ∠AOB',f(sp)+'°'],['Sudut keliling ∠APB',f(sp/2)+'°'],['Perbandingan','2 : 1']];
  ru='∠AOB = 2 × ∠APB'+(Math.abs(sp-180)<1?'<br>AB adalah diameter, maka ∠APB = 90°':'');
 }else if(mode==='dalam'){
  const E=st.E,d1=st.al+st.th/2,d2=st.al-st.th/2,A=hit(E,d1,1),Cc=hit(E,d1,-1),B=hit(E,d2,1),Dd=hit(E,d2,-1);
  const [a,b,c2,d]=[A,B,Cc,Dd].map(ang),[s1,p1]=arcEx(a,b,[c2,d]),[s2,p2]=arcEx(c2,d,[a,b]);
  g+=ln(A,Cc,PK)+ln(B,Dd,PU)+arc(s1,p1,OR,6)+arc(s2,p2,GR,6)+wedge(E,d2,st.th,30,PK,f(st.th)+'°');
  g+=tx([A[0]*1.08,A[1]*1.08],'A',PK,0,-4)+tx([B[0]*1.08,B[1]*1.08],'B',PU,0,-4)+tx([Cc[0]*1.08,Cc[1]*1.08],'C',PK,0,-4)+tx([Dd[0]*1.08,Dd[1]*1.08],'D',PU,0,-4)+tx([E[0]+14,E[1]-14],'E');
  handles=[{k:'E',p:E}];
  rd=[['Busur AB',f(p1)+'°'],['Busur CD',f(p2)+'°'],['½ × (AB + CD)',f((p1+p2)/2)+'°'],['∠AEB terukur',f(st.th)+'°']];
  ru='∠AEB = ½ × (busur AB + busur CD)';
 }else{
  const P=st.P,dist=Math.hypot(P[0],P[1]),mx=Math.floor(Math.asin(Math.min(R_/dist,1))/D*.95),beta=ang([-P[0],-P[1]]);
  if(st.ph>mx)st.ph=Math.max(mx,4);
  const d1=beta+st.ph,d2=beta-st.ph,N1=hit(P,d1,-1),F1=hit(P,d1,1),N2=hit(P,d2,-1),F2=hit(P,d2,1);
  const n=[N1,N2].map(ang),fa=[F1,F2].map(ang),[s1,p1]=arcEx(n[0],n[1],fa),[s2,p2]=arcEx(fa[0],fa[1],n);
  g+=ln(P,F1,PK)+ln(P,F2,PU)+arc(s1,p1,GR,7)+arc(s2,p2,OR,5)+wedge(P,d2,2*st.ph,34,PK,f(2*st.ph)+'°');
  g+=tx([F1[0]*1.08,F1[1]*1.08],'B',PK,0,-4)+tx([F2[0]*1.08,F2[1]*1.08],'D',PU,0,-4)+tx([P[0]+14,P[1]-14],'P');
  handles=[{k:'Q',p:P}];
  rd=[['Busur jauh',f(p2)+'°'],['Busur dekat',f(p1)+'°'],['½ × (jauh − dekat)',f((p2-p1)/2)+'°'],['∠P terukur',f(2*st.ph)+'°']];
  ru='∠P = ½ × (busur jauh − busur dekat)';st.mx=mx;
 }
 for(const h of handles)g+=`<circle cx="${C+h.p[0]}" cy="${C-h.p[1]}" r="12" fill="${PK}" fill-opacity=".25" stroke="${PK}" stroke-width="2.5" style="cursor:grab;touch-action:none"/><circle cx="${C+h.p[0]}" cy="${C-h.p[1]}" r="4.5" fill="${PK}"/>`;
 svg.innerHTML=g;
 c.s.forEach((s,i)=>{const e=$('#s'+(i+1));e.min=s[2];e.max=(s[0]==='ph'&&st.mx)?Math.max(st.mx,5):s[3];e.step=s[4];e.value=val(s[0]);$('#l'+(i+1)).textContent=s[1];$('#o'+(i+1)).textContent=f(+e.value).replace('.0','')+s[5]});
 ['c2','c3'].forEach((id,i)=>$('#'+id).style.display=c.s[i+1]?'':'none');
 $('#reads').innerHTML=rd.map(r=>`<div><small>${r[0]}</small><b>${r[1]}</b></div>`).join('');
 $('#rumus').innerHTML=ru;
}
const txc=()=>matchMedia('(prefers-color-scheme:dark)').matches?'#f1ecf7':'#0A1045';
function buildUI(){
 $('#steps').innerHTML=cfg[mode].steps.map(s=>`<li>${s}</li>`).join('');
 const hints={
  unsur:'Seret titik A atau B di keliling lingkaran. Slider mengubah jari-jari dan sudut pusat.',
  pusat:'Seret A, B, atau P di keliling lingkaran. Sudut keliling dihitung dari busur AB yang tidak memuat P.',
  dalam:'Seret titik E di bagian dalam lingkaran. Slider mengubah sudut antar tali busur dan orientasinya.',
  luar:'Seret titik P di luar lingkaran. Slider mengubah jari-jari dan sudut antar dua garis potong.'
 };
 $('#stageHint').textContent=hints[mode];
 const ch=[['pusat','Titik pusat'],['jari','Jari-jari'],['diam','Diameter'],['busur','Busur'],['tali','Tali busur'],['juring','Juring'],['temb','Tembereng'],['apo','Apotema']];
 $('#chips').innerHTML=mode==='unsur'?ch.map(c=>`<button class="chip ${vis.has(c[0])?'on':''}" data-k="${c[0]}">${c[1]}</button>`).join(''):'';
}
[1,2,3].forEach(i=>$('#s'+i).addEventListener('input',e=>{setv(cfg[mode].s[i-1][0],+e.target.value);render()}));
$('#tabs').addEventListener('click',e=>{const b=e.target.closest('.tab');if(!b)return;mode=b.dataset.m;document.querySelectorAll('#tabs .tab').forEach(t=>t.classList.toggle('on',t===b));if(mode==='luar')st.P=st.P;buildUI();render()});
$('#chips').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;const k=b.dataset.k;vis.has(k)?vis.delete(k):vis.add(k);b.classList.toggle('on');render()});
$('#reset').onclick=()=>{
 st=def();
 vis=new Set(['pusat','jari','diam','tali','apo']);
 drag=null;
 buildUI();
 render();
};
const pos=e=>{const r=svg.getBoundingClientRect();return[(e.clientX-r.left)/r.width*460-C,C-(e.clientY-r.top)/r.height*460]};
svg.addEventListener('pointerdown',e=>{const p=pos(e);let best=null,bd=34;for(const h of handles){const d=Math.hypot(h.p[0]-p[0],h.p[1]-p[1]);if(d<bd){bd=d;best=h.k}}if(best){drag=best;svg.setPointerCapture(e.pointerId);e.preventDefault()}});
svg.addEventListener('pointermove',e=>{if(!drag)return;const p=pos(e),a=ang(p),d=Math.hypot(p[0],p[1]);
 if(drag==='A'||drag==='B')clampUnsurAngle(drag,a);else if(drag==='P')st.tP=a;
 else if(drag==='E'){const k=Math.min(d,R()*.9)/(d||1);st.E=[p[0]*k,p[1]*k]}
 else if(drag==='Q'){const k=Math.min(Math.max(d,R()*1.2),215)/(d||1);st.P=[p[0]*k,p[1]*k]}
 render()});
['pointerup','pointercancel'].forEach(n=>svg.addEventListener(n,()=>drag=null));
/* menu */
$('#menu-toggle').onclick=e=>{e.currentTarget.classList.toggle('active');$('#navbar').classList.toggle('open')};
document.querySelectorAll('.nav-link').forEach(a=>a.addEventListener('click',()=>{$('#menu-toggle').classList.remove('active');$('#navbar').classList.remove('open')}));
/* quiz */
const Q=[
 ['Diameter sebuah lingkaran 14 cm. Berapa jari-jarinya?',['7 cm','14 cm','28 cm','3,5 cm'],0,'r = d : 2 = 7 cm.'],
 ['Sudut pusat 100° dan sudut keliling menghadap busur yang sama. Besar sudut kelilingnya?',['200°','100°','50°','25°'],2,'Karena sudut pusat dan sudut keliling menghadap busur yang sama, sudut keliling = ½ × 100° = 50°.'],
 ['Sudut keliling yang menghadap diameter besarnya…',['45°','60°','90°','180°'],2,'Sudut keliling yang menghadap diameter menghadap busur setengah lingkaran (180°), sehingga besarnya ½ × 180° = 90°.'],
 ['Dua tali busur berpotongan di dalam lingkaran. Dua busur yang dihadapi sudut dan sudut bertolak belakangnya masing-masing 70° dan 50°. Berapa besar sudut dalamnya?',['120°','60°','20°','10°'],1,'Untuk dua tali busur yang berpotongan di dalam lingkaran, sudut yang terbentuk = ½ jumlah dua busur yang dihadapi: ½ × (70° + 50°) = 60°.'],
 ['Dua garis potong bertemu di titik luar lingkaran. Busur jauh 120° dan busur dekat 40°. Berapa besar sudut luarnya?',['80°','160°','40°','20°'],2,'Untuk sudut luar dari dua garis potong, gunakan setengah selisih busur jauh dan dekat: ½ × (120° − 40°) = 40°.']];
let sc=0,done=0;
$('#quiz').innerHTML=Q.map((q,i)=>`<div class="q"><p>${i+1}. ${q[0]}</p>${q[1].map((o,j)=>`<button class="opt" data-q="${i}" data-o="${j}">${o}</button>`).join('')}<div class="fb"></div></div>`).join('');
$('#quiz').addEventListener('click',e=>{const b=e.target.closest('.opt');if(!b)return;const box=b.parentElement;if(box.dataset.d)return;box.dataset.d=1;const i=+b.dataset.q,j=+b.dataset.o,ok=j===Q[i][2];box.querySelectorAll('.opt')[Q[i][2]].classList.add('good');if(!ok)b.classList.add('bad');else sc++;box.querySelector('.fb').textContent=(ok?'Benar! ':'Belum tepat. ')+Q[i][3];if(++done===Q.length)$('#score').textContent='Skormu: '+sc+' / '+Q.length+(sc===Q.length?' 🎉':' — coba ulangi simulasinya!')});
/* Pop Quiz Wayground: modal dibuka saat thumbnail dipilih, dan iframe dikosongkan saat ditutup. */
const kuisModal=$('#kuisModal'),frameKuis=$('#frameKuis'),bukaKuisBtn=$('#bukaKuisBtn'),tutupKuisBtn=$('#tutupKuisBtn');
const bukaKuis=()=>{kuisModal.style.display='flex';kuisModal.setAttribute('aria-hidden','false');frameKuis.src='https://wayground.com/join?gc=44054819';document.body.classList.add('quiz-modal-open');tutupKuisBtn.focus()};
const tutupKuis=()=>{kuisModal.style.display='none';kuisModal.setAttribute('aria-hidden','true');frameKuis.src='';document.body.classList.remove('quiz-modal-open');bukaKuisBtn.focus()};
bukaKuisBtn.addEventListener('click',bukaKuis);
tutupKuisBtn.addEventListener('click',tutupKuis);
kuisModal.addEventListener('click',e=>{if(e.target===kuisModal)tutupKuis()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&kuisModal.getAttribute('aria-hidden')==='false')tutupKuis()});
buildUI();render();
