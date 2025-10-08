import { Slot } from './slots.js';

export class MockServerSource {
  async fetchPayload() {
    // B e E sempre liberados; os outros podem ou não
    const openDaily   = new Set([Slot.B, ...(Math.random() < 0.5 ? [Slot.A] : [Slot.C])]);
    const openSpecial = new Set([Slot.E, ...(Math.random() < 0.5 ? [Slot.D] : [Slot.F])]);

    const makeReward = (group) => ({
      title: group === 'daily' ? 'Recompensa Diária' : 'Oferta Especial',
      description: group === 'daily' ? 'Item grátis do dia' : 'Oferta por tempo limitado',
      rarity: ['C','R','E','L'][Math.floor(Math.random()*4)],
      iconPath: 'images/icone-carro.png',
      cardPath: 'images/card-carro.png',
      maskPath: 'images/silhueta-carro.png',
      claimed: Math.random() < 0.25,
      revealed: Math.random() < 0.5,
      price: group === 'daily' ? 0 : +((Math.random()*250).toFixed(2))
    });

    const daily = [Slot.A, Slot.B, Slot.C].map(s => ({
      slot: s, group: 'daily', locked: !openDaily.has(s),
      reward: openDaily.has(s) ? makeReward('daily') : null
    }));

    const special = [Slot.D, Slot.E, Slot.F].map(s => ({
      slot: s, group: 'special', locked: !openSpecial.has(s),
      reward: openSpecial.has(s) ? makeReward('special') : null
    }));

    return { daily, special };
  }
}
