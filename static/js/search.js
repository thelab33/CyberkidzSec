/* search.js  – mirrors the old React hook */
export class SearchWorker {
  constructor(reports) {
    this.ready = false;
    this.w = new Worker("/js/search.worker.js");
    this.w.onmessage = ({ data }) => {
      if (data.type === "READY") this.ready = true;
    };
    this.w.postMessage({ type: "INDEX", reports });
  }

  /** returns Promise<Report[]> */
  query(q) {
    return new Promise((resolve) => {
      if (!this.w) return resolve([]);
      const handler = ({ data }) => {
        if (data.type === "RESULTS") {
          this.w.removeEventListener("message", handler);
          resolve(data.results.map((r) => r.doc));
        }
      };
      this.w.addEventListener("message", handler);
      this.w.postMessage({ type: "QUERY", q });
    });
  }

  destroy() {
    this.w?.terminate();
    this.w = null;
  }
}

