'use strict';

/* ============================================================
   IMAGE INJECTION
   ============================================================ */
function injectImages() {
  if (typeof IMG === 'undefined') return;
  ['nav-logo-img','footer-logo'].forEach(id => { const el=document.getElementById(id); if(el) el.src=IMG.logo; });
  const map = {
    'hps-img-front': IMG.selaras1, 'hps-img-mid': IMG.iatm1, 'hps-img-back': IMG.selaras2,
    'about-photo': IMG.selaras2,
    'pp-selaras': IMG.selaras1, 'pp-iatm1': IMG.iatm2, 'pp-iatm2': IMG.iatm3,
    'gi-selaras1': IMG.selaras1, 'gi-selaras2': IMG.selaras2,
    'gi-iatm1': IMG.iatm1, 'gi-iatm2': IMG.iatm2, 'gi-iatm3': IMG.iatm3,
    'profil-img1': IMG.selaras2, 'profil-img2': IMG.iatm1,
  };
  Object.entries(map).forEach(([id, src]) => { const el=document.getElementById(id); if(el) el.src=src; });
}

/* ============================================================
   PAGE NAVIGATION
   ============================================================ */
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => { p.classList.remove('active'); p.style.display='none'; });
  const target = document.getElementById('page-'+pageId);
  if (target) {
    target.style.display = 'block';
    void target.offsetWidth; // reflow
    target.classList.add('active');
    window.scrollTo({ top:0, behavior:'smooth' });
  }
  if (pageId === 'booking') {
    document.getElementById('booking-card').style.display = 'block';
    document.getElementById('success-card').style.display = 'none';
  }
}

/* ============================================================
   NAVBAR
   ============================================================ */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.style.boxShadow = window.scrollY > 10 ? '0 4px 24px rgba(0,0,0,.3)' : 'none';
});
function toggleMobileMenu() {
  document.getElementById('nav-links').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('active');
}
function closeMobileMenu() {
  document.getElementById('nav-links')?.classList.remove('open');
  document.getElementById('hamburger')?.classList.remove('active');
}
document.addEventListener('click', e => {
  const nav = document.querySelector('.nav-inner');
  if (nav && !nav.contains(e.target)) closeMobileMenu();
});

/* ============================================================
   GALLERY FILTER
   ============================================================ */
function filterGaleri(el, cat) {
  document.querySelectorAll('#galeri-filters .ftab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('#galeri-grid .gi').forEach(item => {
    const show = cat==='semua' || item.classList.contains(cat);
    item.style.transition = 'opacity .3s ease, transform .3s ease';
    if (show) { item.style.display='block'; item.style.opacity='1'; item.style.transform='scale(1)'; }
    else { item.style.opacity='0'; item.style.transform='scale(.96)'; setTimeout(()=>{ item.style.display='none'; },300); }
  });
}

/* ============================================================
   FAQ
   ============================================================ */
function toggleFaq(btn) {
  const ans = btn.nextElementSibling;
  const icon = btn.querySelector('.faq-icon');
  const isOpen = ans.classList.contains('open');
  document.querySelectorAll('.faq-a').forEach(a=>a.classList.remove('open'));
  document.querySelectorAll('.faq-icon').forEach(i=>i.classList.remove('open'));
  if (!isOpen) { ans.classList.add('open'); icon.classList.add('open'); }
}

/* ============================================================
   BOOKING FORM
   ============================================================ */
let currentStep=1, formData={}, selectedBudget='';

function goToStep(s) {
  document.querySelectorAll('.form-step').forEach(fs=>fs.classList.remove('active'));
  document.getElementById('fs-'+s)?.classList.add('active');
  for(let i=1;i<=5;i++){
    const dot=document.getElementById('sb-'+i);
    const line=document.getElementById('sl-'+i);
    if(dot){ dot.classList.remove('active','done'); if(i<s)dot.classList.add('done'); if(i===s)dot.classList.add('active'); }
    if(line&&i<5) line.classList.toggle('done',i<s);
  }
  currentStep=s;
}
function nextStep(s){ if(!validateStep(s))return; collectStepData(s); if(s===4)buildReview(); goToStep(s+1); }
function prevStep(s){ goToStep(s-1); }

function validateStep(s) {
  if(s===1){
    const vals=['f-nama','f-instansi','f-jabatan','f-wa','f-email'].map(id=>document.getElementById(id)?.value.trim());
    if(vals.some(v=>!v)){ showAlert('Harap lengkapi semua field yang wajib diisi (*)'); return false; }
    if(!vals[4].includes('@')){ showAlert('Format email tidak valid'); return false; }
  }
  if(s===2){
    if(!document.getElementById('f-jenis')?.value||!document.getElementById('f-tanggal')?.value||!document.getElementById('f-pengunjung')?.value){
      showAlert('Harap lengkapi jenis acara, tanggal, dan estimasi pengunjung'); return false;
    }
  }
  if(s===3&&!selectedBudget){ showAlert('Harap pilih estimasi anggaran event'); return false; }
  return true;
}
function collectStepData(s) {
  if(s===1){ formData.nama=document.getElementById('f-nama').value.trim(); formData.instansi=document.getElementById('f-instansi').value.trim(); formData.jabatan=document.getElementById('f-jabatan').value; formData.wa=document.getElementById('f-wa').value.trim(); formData.email=document.getElementById('f-email').value.trim(); }
  if(s===2){ formData.jenis=document.getElementById('f-jenis').value; formData.tanggal=document.getElementById('f-tanggal').value; formData.pengunjung=document.getElementById('f-pengunjung').value; formData.venue=document.getElementById('f-venue').value; formData.lokasi=document.getElementById('f-lokasi').value.trim()||'Belum ditentukan'; }
  if(s===3){ formData.budget=selectedBudget; formData.tema=document.getElementById('f-tema').value.trim()||'—'; const checks=document.querySelectorAll('.checkbox-list input:checked'); formData.kebutuhan=checks.length?[...checks].map(c=>c.parentElement.textContent.trim()).join(', '):'—'; }
}
function selectBudget(el,val){ document.querySelectorAll('.bg-opt').forEach(o=>o.classList.remove('selected')); el.classList.add('selected'); selectedBudget=val; }
function buildReview() {
  const box=document.getElementById('review-box'); if(!box)return;
  const rows=[['Nama',formData.nama],['Instansi',formData.instansi],['Jabatan',formData.jabatan],['WhatsApp',formData.wa],['Email',formData.email],['Jenis Acara',formData.jenis],['Tanggal',formData.tanggal],['Est. Pengunjung',formData.pengunjung],['Status Venue',formData.venue],['Lokasi',formData.lokasi],['Anggaran',formData.budget],['Tema/Konsep',formData.tema],['Kebutuhan Tambahan',formData.kebutuhan]];
  box.innerHTML=rows.filter(([,v])=>v).map(([l,v])=>`<div class="rv-row"><div class="rv-label">${l}</div><div class="rv-value">${v}</div></div>`).join('');
}
function submitForm() {
  if(!document.getElementById('confirm-check').checked){ showAlert('Harap centang persetujuan sebelum mengirim formulir'); return; }
  const reg='EO-2026-'+String(Math.floor(1000+Math.random()*9000));
  document.getElementById('sc-reg-num').textContent=reg;
  document.getElementById('booking-card').style.display='none';
  const sc=document.getElementById('success-card'); sc.style.display='block';
  window.scrollTo({top:0,behavior:'smooth'});
}

/* ============================================================
   STATUS
   ============================================================ */
function checkStatus() {
  const val=document.getElementById('reg-input')?.value.trim().toUpperCase();
  if(!val){ showAlert('Masukkan nomor registrasi terlebih dahulu'); return; }
  if(!/^EO-\d{4}-\d{4}$/.test(val)){ showAlert('Format tidak valid. Contoh: EO-2026-1234'); return; }
  document.getElementById('sr-num-display').textContent=val;
  const res=document.getElementById('status-result'); res.style.display='block';
}

/* ============================================================
   ADMIN
   ============================================================ */
function adminLogin() {
  if(document.getElementById('au').value==='admin'&&document.getElementById('ap').value==='swarna2025'){
    document.getElementById('admin-login').style.display='none';
    document.getElementById('admin-dash').style.display='grid';
  } else showAlert('Username atau password salah. Coba: admin / swarna2025');
}
function adminTab(tabId,el) {
  document.querySelectorAll('.admin-tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('tab-'+tabId)?.classList.add('active');
  document.querySelectorAll('.as-nav a').forEach(a=>a.classList.remove('active'));
  el.classList.add('active');
}

/* ============================================================
   MODAL
   ============================================================ */
const modalData = {
  selaras1:{title:'Selaras 7.0',sub:'Pentas Seni · 2025 · Jakarta',key:'selaras1',desc:'Event pentas seni tahunan yang menampilkan ratusan siswa dengan panggung megah dan tata cahaya profesional. Swarna Creation menangani seluruh aspek dari konsep tema, sound & lighting, talent management, hingga dokumentasi lengkap.'},
  selaras2:{title:'Selaras 7.0 — Tim',sub:'Pentas Seni · 2025 · Jakarta',key:'selaras2',desc:'Tim Swarna Creation berfoto bersama usai suksesnya event Selaras 7.0. Dedikasi tim kami tercermin dari hasil akhir yang memuaskan semua pihak.'},
  iatm1:{title:'IATM Fun Water Run',sub:'Event Publik · 2025 · Lapangan Monas',key:'iatm1',desc:'Fun run bertemakan air yang diikuti ratusan peserta di Lapangan Monas. Swarna Creation menjadi partner EO resmi dengan dukungan sponsor Halliburton, Expro, NOV, dan Decathlon.'},
  iatm2:{title:'IATM Water Run — Tim Lengkap',sub:'Event Publik · 2025 · Jakarta',key:'iatm2',desc:'Foto bersama seluruh tim Swarna Creation dan panitia IATM SM UI 2025 setelah event berjalan sukses.'},
  iatm3:{title:'IATM Water Run — Perayaan',sub:'Event Publik · 2025 · Jakarta',key:'iatm3',desc:'Selebrasasi usai event IATM Fun Water Run 2025. Tim yang solid menghasilkan event yang luar biasa.'},
};
function openModal(type) {
  const data=modalData[type]; if(!data)return;
  const imgSrc=typeof IMG!=='undefined'?IMG[data.key]:null;
  document.getElementById('modal-body').innerHTML=`<h3 class="modal-title">${data.title}</h3><p class="modal-sub">${data.sub}</p>${imgSrc?`<div class="modal-img"><img src="${imgSrc}" alt="${data.title}"></div>`:''}<p class="modal-desc">${data.desc}</p>`;
  document.getElementById('modal').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeModal(){ document.getElementById('modal').classList.remove('open'); document.body.style.overflow=''; }
function closeModalOutside(e){ if(e.target===document.getElementById('modal'))closeModal(); }
document.addEventListener('keydown',e=>{ if(e.key==='Escape')closeModal(); });

/* ============================================================
   UTILITIES
   ============================================================ */
function showFileName(input,targetId){ const f=input.files[0],t=document.getElementById(targetId); if(f&&t)t.textContent='✓ '+f.name; }

function showAlert(msg) {
  document.getElementById('custom-alert')?.remove();
  const el=document.createElement('div'); el.id='custom-alert';
  el.style.cssText='position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#EF4444;color:white;padding:.875rem 1.75rem;border-radius:50px;font-size:14px;font-weight:600;z-index:9999;box-shadow:0 8px 24px rgba(239,68,68,.4);max-width:90vw;text-align:center;font-family:Plus Jakarta Sans,sans-serif;animation:slideAlertDown .3s ease;';
  el.textContent='⚠️ '+msg;
  const s=document.createElement('style'); s.textContent='@keyframes slideAlertDown{from{opacity:0;transform:translate(-50%,-20px)}to{opacity:1;transform:translate(-50%,0)}}';
  document.head.appendChild(s); document.body.appendChild(el);
  setTimeout(()=>el.remove(),3500);
}

/* ============================================================
   SCROLL ANIMATIONS
   ============================================================ */
function initScrollAnimations() {
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.style.opacity='1'; e.target.style.transform='translateY(0)'; obs.unobserve(e.target); } });
  },{threshold:.1,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.srv-card,.kl-item,.testi-card,.blog-card,.gi,.pp-item,.pk-card,.team-card,.ck-card,.tl-item').forEach((el,i)=>{
    el.style.opacity='0'; el.style.transform='translateY(24px)';
    el.style.transition=`opacity .5s ease ${i*.05}s, transform .5s ease ${i*.05}s`;
    obs.observe(el);
  });
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded',()=>{
  injectImages();
  initScrollAnimations();
  showPage('home');

  // Hamburger style
  const s=document.createElement('style');
  s.textContent=`.hamburger.active span:nth-child(1){transform:rotate(45deg) translate(5px,5px)}.hamburger.active span:nth-child(2){opacity:0}.hamburger.active span:nth-child(3){transform:rotate(-45deg) translate(5px,-5px)}`;
  document.head.appendChild(s);

  // Enter keys
  document.getElementById('reg-input')?.addEventListener('keydown',e=>{ if(e.key==='Enter')checkStatus(); });
  document.getElementById('ap')?.addEventListener('keydown',e=>{ if(e.key==='Enter')adminLogin(); });
});
