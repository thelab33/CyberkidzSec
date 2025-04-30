/* search.worker.js  – tiny Fuse.js-powered full-text search in a Web Worker */
importScripts("https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.js");

let fuse;

self.onmessage = (e) => {
  const { type, reports, q } = e.data;

  if (type === "INDEX") {
    fuse = new Fuse(reports, {
      keys: ["title", "tags", "summary"],
      includeScore: true,
      threshold: 0.4,
    });
    self.postMessage({ type: "READY" });
  }

  if (type === "QUERY") {
    if (!fuse) return self.postMessage({ type: "RESULTS", results: [] });
    const res = q ? fuse.search(q).slice(0, 20) : [];
    self.postMessage({ type: "RESULTS", results: res });
  }
};

