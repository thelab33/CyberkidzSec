// static/js/main.js — Starforge Unified Main Script

// Utility: Throttle
function throttle(fn, wait) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last > wait) {
      last = now;
      fn(...args);
    }
  };
}

// 0. Skip-Nav
function initSkipNav() {
  const skipBar = document.getElementById('skipBar');
  const warpText = document.getElementById('warpText');
  const closeBtn = document.getElementById('skipBarClose');
  let confetti;

  function show() {
    skipBar.classList.add('visible');
    warpText.classList.add('opacity-100','scale-100','translate-y-0');
    warpText.classList.remove('opacity-0','scale-90','-translate-y-1/2');
    if (window.ConfettiGenerator) {
      confetti = new ConfettiGenerator({ target: 'confettiCanvas', max: 80 });
      confetti.render();
    }
  }
  function hide() {
    skipBar.classList.remove('visible');
    warpText.classList.remove('opacity-100','scale-100','translate-y-0');
    warpText.classList.add('opacity-0','scale-90','-translate-y-1/2');
    if (confetti) confetti.clear();
  }

  window.addEventListener('keydown', e => {
    if ((e.ctrlKey||e.metaKey) && e.key==='ArrowUp') {
      e.preventDefault(); show();
    }
    if (e.key==='Escape') hide();
  });
  closeBtn?.addEventListener('click', hide);
}

// 1. Warp Overlay
function initWarpOverlay() {
  const hero = document.getElementById('hero');
  if (!hero || hero.querySelector('#warp-overlay')) return;
  const overlay = document.createElement('div');
  overlay.id = 'warp-overlay';
  hero.prepend(overlay);
}

// 2. AOS
function initAOS() {
  if (window.AOS) AOS.init({ offset:120, delay:100, duration:600, easing:'ease-in-out', once:true, mirror:false });
}

// 3. Scroll + Header
function initScrollHeader() {
  const p = document.getElementById('scrollProgress');
  const h = document.getElementById('siteHeader');
  const update = throttle(() => {
    const y = window.scrollY;
    const max = document.body.scrollHeight - window.innerHeight;
    if (p) p.style.transform = `scaleX(${max>0?y/max:0})`;
    if (h) h.classList.toggle('scrolled', y>50);
  }, 16);
  document.addEventListener('scroll', update);
  update();
}

// 4. Audio FX
function initAudioFX() {
  const audio = {
    click: new Audio('/static/sfx/keyboard-clack.mp3'),
    unlock: new Audio('/static/sfx/vhs-unlock.mp3'),
    swoosh: new Audio('/static/sfx/swoosh.mp3'),
    breach: new Audio('/static/sfx/breach.mp3')
  };
  Object.values(audio).forEach(a=>a.volume=0.15);
  document.addEventListener('click', e => {
    const t = e.target;
    if (t.closest('.vault-popup-trigger')) audio.unlock.play();
    else if (t.matches('a, .report-card, button')) audio.click.play();
    else if (t.closest('#themeToggle')) audio.swoosh.play();
  });
  return audio;
}

// 5. Theme & Ghost
function initThemeGhost(audio) {
  const btn = document.getElementById('themeToggle');
  const html = document.documentElement;
  const body = document.body;
  const applyTheme = m=>{ html.dataset.theme=m; localStorage.setItem('theme',m) };
  const applyGhost = e=>{ const v=e?'true':'false'; html.dataset.ghostMode=v; body.dataset.ghostMode=v; localStorage.setItem('ghost',v) };
  applyTheme(localStorage.getItem('theme')||'dark');
  applyGhost(localStorage.getItem('ghost')==='true');
  btn?.addEventListener('click',()=> applyTheme(html.dataset.theme==='dark'?'light':'dark'));
  window.addEventListener('keydown', e=>{
    if(e.ctrlKey&&e.key.toLowerCase()==='m'){
      const m=prompt('Enter theme mode (dark, light, ghost, infrared):'); if(!m) return;
      if(m==='ghost') applyGhost(true);
      else{ applyGhost(false); if(m==='infrared') applyTheme('infrared'); else applyTheme(m); }
    }
  });
}

// 6. Mobile
function initMobileMenu() {
  const mt = document.getElementById('menuToggle');
  const nav = document.getElementById('mobileNav');
  let open=false;
  mt?.addEventListener('click',()=>{
    open=!open;
    nav?.classList.toggle('translate-y-0',open);
    nav?.classList.toggle('-translate-y-full',!open);
    mt.setAttribute('aria-expanded',open);
  });
}

// 7. Vault Feed WS
function initVaultFeed() {
  const status = document.getElementById('vaultStatusLive'); if(!status) return;
  const connect = ()=>{
    const proto=location.protocol==='https:'?'wss':'ws';
    const ws=new WebSocket(`${proto}://${location.host}/ws/status`);
    ws.onmessage=({data})=>{ status.textContent=`Vault: ${data}`; status.classList.toggle('bg-green-600',data==='LIVE'); status.classList.toggle('bg-red-600',data!=='LIVE'); };
    ws.onclose=()=>{ status.textContent='Disconnected'; status.classList.replace('bg-green-600','bg-red-600'); setTimeout(connect,3000); };
  };
  connect();
}

// 8. Bootloader
function initBootloader() {
  const boot=document.getElementById('bootloader'); const log=document.getElementById('bootLines'); if(!boot||!log) return;
  const lines=[
    '[0.00] Initializing CYBERKIDZSEC Vault System...','[0.21] Engaging Ghost Mode Subsystems...','[0.34] ⚠️ Memory Leak Detected in Sector 7G',
    '[0.42] HUD Interface Compiled.','#!@% Error: /dev/null overflow','[0.73] Authenticating Operative: 🧠 Codebreaker',
    '[0.91] 🚨 Subspace Trace Signal Detected','[1.04] Neural Sync Lock Established.','SYSTEM: Breach Protocols Engaged...',
    '[1.48] Vault Stability: ✔ Stable','[2.00] ✅ WARP MODE Online — Stay Ghosted. 💀'
  ];
  const classify=t=>t.match(/ERROR|⚠️|Trace/)?'error':t.match(/#!@%|Breach/)?'glitch':t.match(/✔|✅/)?'success':'';
  log.innerHTML='';
  lines.forEach((l,i)=>setTimeout(()=>{const s=document.createElement('span');s.textContent=l;s.classList.add('line',classify(l));log.appendChild(s);},i*300));
  setTimeout(()=>{boot.classList.add('hidden');document.body.classList.remove('no-scroll');const c=document.createElement('div');c.className='post-boot-cursor';c.textContent='~$';document.body.appendChild(c);},lines.length*300+1000);
  boot.addEventListener('click',()=>boot.classList.add('hidden'));
  document.addEventListener('keydown',e=>e.key==='Escape'&&boot.classList.add('hidden'));
}

// 9. Breach Alert
function initBreachAlert(audio) {
  const breach=document.getElementById('ghostBreachWarning');const footer=document.getElementById('footer'); if(!breach||!footer)return;
  const stab=parseInt(footer.dataset.vaultStability||'100',10); const ghost=document.body.dataset.ghostMode==='true';
  if(ghost&&stab<50){ breach.style.display='block'; audio.breach.play().catch(()=>{}); document.body.classList.add('glitch'); setTimeout(()=>document.body.classList.remove('glitch'),2000);}   
}

// 10. Hero Typer & Section
function initHeroTyper() {
  const typer=document.getElementById('heroTyper'); if(!typer)return;
  const lines=['🔐 Zero-Day Archive Updating…','💀 Ghosted but not gone.','🛰️ Live Vault Feed: Stable.','⚡ Stay Dangerous, Operative.'];
  let idx=0; const next=()=>{ typer.textContent=lines[idx]; typer.classList.remove('animate-typewriter'); void typer.offsetWidth; typer.classList.add('animate-typewriter'); idx=(idx+1)%lines.length; };
  next(); setInterval(next,4000);
}

function initHeroSection() {
  const $=id=>document.getElementById(id);
  const hero=$('hero'); if(!hero)return;
  if(!hero.querySelector('.orbit-container')){
    const oc=document.createElement('div');oc.className='orbit-container';['small','med','large'].forEach(size=>{const r=document.createElement('div');r.classList.add('orbit',`orbit--${size}`);oc.appendChild(r);});hero.appendChild(oc);
  }
  if(!$('lensFlare')){const f=document.createElement('div');f.id='lensFlare';hero.appendChild(f);}
  const heading=$('hero-heading'); if(heading&&!heading.querySelector('.glitch')){const txt=heading.textContent.trim();heading.innerHTML=`<span class="glitch" data-text="${txt}"><span class="hero-skull">💀</span>${txt.replace('💀','').trim()}</span>`;}
  hero.classList.add('opacity-0'); requestAnimationFrame(()=>{hero.classList.remove('opacity-0');hero.classList.add('animate-warpStabilize');});
  const canvas=$('heroStarfield'); if(canvas?.getContext){const ctx=canvas.getContext('2d');let stars=[];const resize=()=>{canvas.width=canvas.offsetWidth;canvas.height=canvas.offsetHeight;const num=Math.floor((canvas.width*canvas.height)/8000);stars=Array.from({length:num},()=>({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*1.5+0.3,alpha:Math.random(),delta:Math.random()*0.02+0.01}));};const draw=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);stars.forEach(s=>{s.alpha+=s.delta;if(s.alpha<=0||s.alpha>=1)s.delta*=-1;ctx.globalAlpha=s.alpha;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,2*Math.PI);ctx.fillStyle='#fff';ctx.fill();});ctx.globalAlpha=1;requestAnimationFrame(draw);};resize();draw();window.addEventListener('resize',resize);}  
  const halo=$('heroHalo'),sparks=$('ghostSparks'),ghostMode=document.body.dataset.ghostMode==='true';const triggerGhost=()=>{halo?.classList.add('opacity-50');$('ghostMsg')?.classList.remove('hidden');if(!sparks)return;sparks.classList.remove('hidden');setInterval(()=>{const s=document.createElement('div');s.className='spark';s.style.left=`${Math.random()*100}%`;s.style.top=`${Math.random()*100}%`;s.style.animationDuration=`${2+Math.random()*2}s`;sparks.appendChild(s);setTimeout(()=>s.remove(),4000);},300);};ghostMode?triggerGhost():setTimeout(()=>{halo?.classList.add('opacity-30');sparks.classList.remove('hidden');},1200);
  const searchBtn=$('searchBtn'),searchInput=$('globalSearch');if(searchBtn&&searchInput){searchBtn.addEventListener('click',()=>searchInput.focus());document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();searchInput.focus();}});}  
  const parallax=$('heroParallax');if(parallax){window.addEventListener('mousemove',e=>{const{innerWidth:w,innerHeight:h}=window;const x=(e.clientX-w/2)/w;const y=(e.clientY-h/2)/h;parallax.style.transform=`rotateX(${y*4}deg) rotateY(${x*6}deg)`;});}
  const meteor=$('xpMeteor');if(meteor){meteor.classList.add('animate-ping','rounded-full');setInterval(()=>{meteor.style.opacity='1';setTimeout(()=>meteor.style.opacity='0.2',600);},3000);}  
  fetch('/static/data/reports.json').then(r=>r.json()).then(data=>{const size=9,page=1;console.log('🔍 Showing reports:',data.slice((page-1)*size,page*size));});
  fetch('/api/vault_dashboard/status').then(r=>r.json()).then(d=>{const xp=d.vault_xp_percentage;$('heroXpFill')?.style.setProperty('width',xp+'%');$('xpMeteor')?.style.setProperty('transform',`translateX(${xp}%) scaleX(0.9)`);if(xp<30)document.querySelector('.hero-skull')?.classList.add('text-red-500');});
}

// Initialization
window.addEventListener('DOMContentLoaded',()=>{
  const audio=initAudioFX();
  initSkipNav();
  initWarpOverlay();
  initAOS();
  initScrollHeader();
  initThemeGhost(audio);
  initMobileMenu();
  initHeaderBehavior();
  initVaultFeed();
  initBootloader();
  initBreachAlert(audio);
  initHeroTyper();
  initHeroSection();
  const cleanupStar = initStarfield('heroStarfield');
  window.addEventListener('beforeunload',()=>cleanupStar&&cleanupStar());
});

