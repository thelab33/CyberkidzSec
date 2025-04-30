// static/js/back_to_top.js
(function(){
  const btn = document.getElementById('backToTopBtn');
  const toggle = ()=>btn.style.display = window.scrollY>400?'flex':'none';
  window.addEventListener('scroll',toggle,{passive:true});
  btn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
})();

