// static/js/spotlight-search.js
document.addEventListener('keydown', e => {
  if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
    e.preventDefault();
    const query = prompt('🔍 Search reports:');
    if (!query) return;
    const results = window.ALL_REPORTS.filter(r =>
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      (r.tags || []).some(t => t.includes(query.toLowerCase()))
    );
    console.log('Search results:', results);
    // TODO: render results in a modal or dropdown
  }
});

