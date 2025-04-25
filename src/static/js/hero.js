// static/js/hero.js
(function(){
  const badge = document.getElementById('ghostModeBadge');
  const seq=[];                   // track last 2 keys
  document.addEventListener('keydown',e=>{
    seq.push(e.key.toLowerCase()); if(seq.length>2)seq.shift();
    if(seq.join('')==='gh'){ badge.classList.remove('hidden');
      setTimeout(()=>badge.classList.add('hidden'),4000);}
  });
})();

