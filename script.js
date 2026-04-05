/* =============================================
   WEDDING INVITATION — script.js
   ============================================= */

/* ── PARTICLE CANVAS ── */
(function(){
  const canvas = document.getElementById('particles');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function Particle(){
    this.reset = function(){
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.size = Math.random() * 1.4 + 0.3;
      this.speedY = -(Math.random() * 0.4 + 0.1);
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.life = 0;
      this.maxLife = Math.random() * 200 + 100;
      this.gold = Math.random() > 0.5;
    };
    this.reset();
    this.y = Math.random() * H; // scatter start
  }

  for(let i = 0; i < 80; i++) particles.push(new Particle());

  function draw(){
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.life++;
      if(p.life > p.maxLife || p.y < -10) p.reset();
      const alpha = Math.sin((p.life / p.maxLife) * Math.PI) * 0.7;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.gold
        ? `rgba(201,168,76,${alpha})`
        : `rgba(253,248,240,${alpha * 0.4})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── COUNTDOWN ── */
function updateCountdown(){
  const target = new Date('2026-12-12T08:00:00');
  const now = new Date();
  const diff = target - now;
  if(diff <= 0){
    ['cd-d','cd-h','cd-m','cd-s'].forEach(id => document.getElementById(id).textContent = '0');
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  document.getElementById('cd-d').textContent = d;
  document.getElementById('cd-h').textContent = String(h).padStart(2,'0');
  document.getElementById('cd-m').textContent = String(m).padStart(2,'0');
  document.getElementById('cd-s').textContent = String(s).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ── MUSIC ── */
let playing = false;
function toggleMusic(){
  const audio = document.getElementById('bg-music');
  const icon = document.getElementById('music-icon');
  const btn = document.getElementById('music-btn');
  if(playing){
    audio.pause();
    icon.textContent = '♪';
    btn.style.borderColor = 'rgba(201,168,76,0.4)';
    playing = false;
  } else {
    audio.play().catch(()=>{});
    icon.textContent = '■';
    btn.style.borderColor = 'var(--gold)';
    playing = true;
  }
}

/* ── SCROLL REVEAL ── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){
      const delay = e.target.dataset.delay || 0;
      setTimeout(() => e.target.classList.add('visible'), parseInt(delay));
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ── NAV DOTS ── */
const sections = ['cover','couple','event','story','countdown','location','gallery','video','gift','rsvp','guestbook','closing'];
const dots = document.querySelectorAll('.nav-dot');

function scrollToSection(id){
  const el = document.getElementById(id);
  if(el) el.scrollIntoView({ behavior:'smooth' });
}

window.addEventListener('scroll', () => {
  let cur = 0;
  sections.forEach((id, i) => {
    const el = document.getElementById(id);
    if(el && window.scrollY >= el.offsetTop - 240) cur = i;
  });
  dots.forEach((d, i) => d.classList.toggle('active', i === cur));
});

/* ── 3D MOUSE TILT on cover frame ── */
const coverFrame = document.getElementById('coverFrame');
if(coverFrame){
  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const rx = (e.clientY - cy) / cy * 5;
    const ry = (e.clientX - cx) / cx * -5;
    coverFrame.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  document.addEventListener('mouseleave', () => {
    coverFrame.style.transform = '';
  });
}

/* ── 3D HOVER TILT on gallery items ── */
document.querySelectorAll('.gal-3d').forEach(item => {
  item.addEventListener('mousemove', e => {
    const rect = item.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    item.style.transform = `translateY(-6px) rotateX(${y * -14}deg) rotateY(${x * 14}deg) scale(1.04)`;
  });
  item.addEventListener('mouseleave', () => {
    item.style.transform = '';
  });
});

/* ── RSVP FORM ── */
function submitRSVP(e){
  e.preventDefault();
  const name = document.getElementById('rsvp-name').value.trim();
  const attend = document.getElementById('rsvp-attend').value;
  const msg = document.getElementById('rsvp-msg');
  if(!name || !attend){
    msg.textContent = 'Mohon lengkapi nama dan status kehadiran.';
    msg.style.color = '#e07070';
    return;
  }
  msg.textContent = 'Terima kasih, ' + name + '! Konfirmasi telah kami terima. ✦';
  msg.style.color = 'var(--gold)';
  e.target.reset();
}

/* ── COPY REKENING ── */
function copyRek(){
  navigator.clipboard.writeText('1234567890').then(() => {
    const btn = document.querySelector('.btn-copy-gold');
    const label = document.getElementById('copy-label');
    label.textContent = 'Tersalin! ✦';
    btn.classList.add('copied');
    setTimeout(() => {
      label.textContent = 'Salin Nomor Rekening';
      btn.classList.remove('copied');
    }, 2500);
  }).catch(() => {
    alert('Nomor rekening: 1234567890');
  });
}

/* ── GUESTBOOK ── */
const savedComments = [];

function addComment(e){
  e.preventDefault();
  const name = document.getElementById('guest-name').value.trim();
  const msg = document.getElementById('guest-msg').value.trim();
  if(!name || !msg) return;

  const now = new Date();
  const timeStr = now.toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' });

  savedComments.unshift({ name, msg, time: timeStr });
  renderComments();
  e.target.reset();
}

function renderComments(){
  const list = document.getElementById('comment-list');
  list.innerHTML = '';
  savedComments.forEach(c => {
    const div = document.createElement('div');
    div.className = 'comment-card reveal visible';
    div.innerHTML = `
      <div class="comment-name">${escapeHtml(c.name)}</div>
      <div class="comment-text">${escapeHtml(c.msg)}</div>
      <div class="comment-time">${c.time}</div>
    `;
    list.appendChild(div);
  });
}

function escapeHtml(str){
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ── SCROLL-TRIGGERED SECTION BACKGROUNDS ── */
(function(){
  const cover = document.getElementById('cover');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const coverBg = cover.querySelector('.cover-bg');
    if(coverBg){
      const pct = Math.min(y / window.innerHeight, 1);
      coverBg.style.opacity = 1 - pct * 0.5;
    }
  });
})();

document.querySelector(".video-overlay").onclick = function(){
  const iframe = document.querySelector(".video-wrapper iframe");
  iframe.src += "&autoplay=1&mute=1";
  this.style.display = "none";
};

const params = new URLSearchParams(window.location.search);
const guest = params.get("to");

if(guest){
  document.getElementById("guestText").innerText = guest;
}

// ==========================
// GET NAMA TAMU DARI URL
// ==========================
function getGuestName() {
  const params = new URLSearchParams(window.location.search);
  let name = params.get("to");

  if (!name) return "Tamu Undangan";

  // decode URL (biar spasi normal)
  name = decodeURIComponent(name);

  // sanitize (hindari script injection)
  name = name.replace(/[^a-zA-Z0-9\s.,'-]/g, "");

  return name;
}

// ==========================
// SET KE HTML
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  const guestEl = document.getElementById("guestText");

  if (guestEl) {
    guestEl.textContent = getGuestName();
  }
});