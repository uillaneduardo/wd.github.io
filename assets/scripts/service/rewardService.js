import { Slot, SLOT_GROUP, GROUP } from './slots.js';

export class RewardService {
  /** @param {{fetchPayload:()=>Promise<import('./slots.js').RewardsPayload>}} source */
  constructor(source) {
    this.source = source;
    /** @type {Map<string, any>} */
    this.slots = new Map(); // slot -> objeto normalizado
  }

  async load() {
    const payload = await this.source.fetchPayload();
    this._normalize(payload).forEach(s => this.slots.set(s.slot, s));
  }

  _lockedPlaceholder(slot) {
    return {
      slot,
      group: SLOT_GROUP[slot],
      locked: true,
      title: 'Bloqueado',
      description: 'Esse slot está bloqueado',
      rarity: null,
      iconPath: '../images/icone-cadeado.png',
      cardPath: '../images/silhueta-cadeado.png',
      maskPath: '../images/silhueta-cadeado.png',
      claimed: false,
      revealed: true,
      price: null
    };
  }

  /** @param {import('./slots.js').RewardsPayload} payload */
  _normalize(payload) {
    const result = new Map();

    const ingest = (arr = []) => {
      for (const item of arr) {
        const s = item.slot;
        const base = this._lockedPlaceholder(s);
        const locked = !!item.locked || item.reward == null;

        if (locked) {
          result.set(s, base);
        } else {
          const r = item.reward;
          const price = (SLOT_GROUP[s] === GROUP.DAILY) ? 0 : (r.price ?? 0);
          result.set(s, { ...base, locked: false, ...r, price });
        }
      }
    };

    ingest(payload.daily);
    ingest(payload.special);

    // Garante que todos existam
    for (const s of Object.values(Slot)) {
      if (!result.has(s)) result.set(s, this._lockedPlaceholder(s));
    }
    // B e E nunca bloqueados
    for (const s of [Slot.B, Slot.E]) {
      const cur = result.get(s);
      result.set(s, { ...cur, locked: false, title: cur.title === 'Bloqueado' ? 'Indisponível' : cur.title, price: 0 });
    }
    return [...result.values()];
  }

  // ===== API pública =====
  getSlot(slot) { return this.slots.get(slot); }
  isLocked(slot) { return !!this.getSlot(slot)?.locked; }
  getRarity(slot) { return this.getSlot(slot)?.rarity ?? null; }
  isClaimed(slot) { return !!this.getSlot(slot)?.claimed; }
  isRevealed(slot) { return !!this.getSlot(slot)?.revealed; }
  getPrice(slot) { return this.getSlot(slot)?.price ?? 0; }
  getTitle(slot) { return this.getSlot(slot)?.title ?? ''; }
  getDescription(slot) { return this.getSlot(slot)?.description ?? ''; }
  getIconPath(slot) { return this.getSlot(slot)?.iconPath ?? ''; }
  getCardPath(slot) { return this.getSlot(slot)?.cardPath ?? ''; }
  getMaskPath(slot) { return this.getSlot(slot)?.maskPath ?? ''; }

  revelarCarta(){revealed = true;}

  getIconUrl(slot) {
    const p = this.getSlot(slot)?.iconPath;
    return p ? `url("${p}")` : 'none';
  }
  getCardUrl(slot) {
    let p;
    if(this.isRevealed(slot)) p = this.getSlot(slot)?.cardPath;
    else p = this.getSlot(slot)?.maskPath;
    return p ? `url("${p}")` : 'none';
  }
  getRarityColor(slot){
    if(this.isLocked(slot)) return 'var(--cor-predominante)';
    const rarity = this.getRarity(slot);
    switch(rarity){
      case 'C': return 'var(--cor-liberdade)';
      case 'R': return 'var(--cor-autoescola)';
      case 'E': return 'var(--cor-adrenalina)';
      case 'L': return 'var(--cor-limitada)';
    }
  }
  getStateClassToAdd(slot){
    if(this.isLocked(slot)) return;
    if(this.isRevealed(slot)) return 'slot-raridade';
    else return 'revelando-card';
  }
  getStateClassToRemove(slot){
    if(this.isLocked(slot)) return;
    if(this.isRevealed(slot)) return 'revelando-card';
    else return 'slot-raridade';
  }
}
