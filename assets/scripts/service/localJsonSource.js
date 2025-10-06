export class LocalJsonSource {
  /** @param {string} url */
  constructor(url) { this.url = url; }

  async fetchPayload() {
    const res = await fetch(this.url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error('Falha ao buscar payload: ' + res.status);
    return res.json(); // deve retornar { daily: [...], special: [...] }
  }
}
