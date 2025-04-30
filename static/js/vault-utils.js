/*  vault-utils.js  – lightweight client helpers
    Everything attaches to window.Vault so any page can call
    Vault.getCvssColor(7.8)  etc.
    Inject window.ALL_REPORTS in the page template so the
    helpers have data to work with.
*/

(() => {
  const COLORS = [
    "#f97316","#e879f9","#38bdf8","#34d399","#facc15",
    "#a855f7","#22d3ee","#c084fc","#fb923c","#4ade80"
  ];

  /* ─────────────── CVSS helpers ─────────────── */
  function getCvssColor(score){
    if(score>=9)  return "text-red-400";
    if(score>=7)  return "text-orange-400";
    if(score>=4)  return "text-yellow-400";
    return "text-emerald-400";
  }
  function getCvssLabel(score){
    if(score>=9)  return "Critical";
    if(score>=7)  return "High";
    if(score>=4)  return "Medium";
    return "Low";
  }

  /* ─────────────── data helpers ─────────────── */
  const R = () => window.ALL_REPORTS || [];

  function filterReportsByTag(tag){
    return tag==="All" ? R() : R().filter(r=>r.tags.includes(tag));
  }
  function sortReports(list,key){
    const sev = ["Low","Medium","High","Critical"];
    return [...list].sort((a,b)=>{
      if(key==="date")    return new Date(b.date)-new Date(a.date);
      if(key==="cvss")    return b.cvss-a.cvss;
      if(key==="severity")return sev.indexOf(b.severity)-sev.indexOf(a.severity);
      return 0;
    });
  }
  function getAllTags(){
    return Array.from(new Set(R().flatMap(r=>r.tags))).sort();
  }

  /* ─────────────── chart helpers ─────────────── */
  function getSeverityRadarData(){
    const map={}; R().forEach(r=>map[r.severity]=(map[r.severity]||0)+1);
    return Object.entries(map).map(([s,c])=>({severity:s,count:c}));
  }
  function getCvssByYear(){
    const map={}; R().forEach(r=>{
      const y=new Date(r.date).getFullYear();
      (map[y]=map[y]||[]).push(r.cvss);
    });
    return Object.entries(map).map(([y,arr])=>({
      year:+y,
      cvss:+(arr.reduce((a,b)=>a+b,0)/arr.length).toFixed(1)
    }));
  }
  function getMonthlyReportTrends(){
    const map={}; R().forEach(r=>{
      const k=new Date(r.date).toISOString().slice(0,7);
      map[k]=(map[k]||0)+1;
    });
    return Object.entries(map).map(([m,c])=>({month:m,count:c}));
  }

  /* ─────────────── shimmer SVG helper ─────────────── */
  function shimmer(w,h){
    return `
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="g">
        <stop stop-color="#333" offset="20%"/>
        <stop stop-color="#222" offset="50%"/>
        <stop stop-color="#333" offset="70%"/>
      </linearGradient></defs>
      <rect width="${w}" height="${h}" fill="#333"/>
      <rect id="r" width="${w}" height="${h}" fill="url(#g)">
        <animate attributeName="x" from="-${w}" to="${w}"
                 dur="1s" repeatCount="indefinite"/>
      </rect>
    </svg>`;
  }

  /* expose */
  window.Vault = {
    COLORS, getCvssColor, getCvssLabel,
    filterReportsByTag, sortReports, getAllTags,
    getSeverityRadarData, getCvssByYear, getMonthlyReportTrends,
    shimmer
  };
})();

