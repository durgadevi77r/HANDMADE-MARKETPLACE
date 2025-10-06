export async function resolveApiBase() {
  const verify = async (base) => {
    try {
      const res = await fetch(`${base}/`);
      return res.ok;
    } catch (_) {
      return false;
    }
  };

  const cached = localStorage.getItem('apiBase');
  if (cached && (await verify(cached))) return cached;
  const candidates = [
    'http://localhost:5000',
    'http://localhost:5001',
    'http://localhost:5002',
    'http://localhost:5003',
    'http://localhost:5004',
    'http://localhost:5005',
  ];
  for (const base of candidates) {
    if (await verify(base)) {
      localStorage.setItem('apiBase', base);
      return base;
    }
  }
  return candidates[0];
}

export async function apiFetch(path, options = {}) {
  let base = localStorage.getItem('apiBase');
  if (!base || !(await (async () => { try { return (await fetch(`${base}/`)).ok } catch { return false } })())) {
    base = await resolveApiBase();
  }
  return fetch(`${base}${path}`, options);
}


