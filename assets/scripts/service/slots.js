// slots.js

// "Enum" de slots e grupos
export const Slot = Object.freeze({ A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 });
export const GROUP = Object.freeze({ DAILY: 1, SPECIAL: 2 });
export const SLOT_GROUP = Object.freeze({
  A: GROUP.DAILY, B: GROUP.DAILY, C: GROUP.DAILY,
  D: GROUP.SPECIAL, E: GROUP.SPECIAL, F: GROUP.SPECIAL
});

/** @typedef {'C'|'R'|'E'|'L'} Rarity */

/** @typedef {Object} Reward
 *  @property {string}  title
 *  @property {string}  description
 *  @property {Rarity}  rarity
 *  @property {string}  iconPath
 *  @property {string}  cardPath
 *  @property {string}  maskPath
 *  @property {boolean} claimed
 *  @property {boolean} revealed
 *  @property {number|null} price
 */

/** @typedef {Object} SlotPayload
 *  @property {keyof typeof Slot} slot
 *  @property {'daily'|'special'}  group
 *  @property {boolean}            locked
 *  @property {Reward|null|undefined} reward
 */

/** @typedef { daily: SlotPayload[], special: SlotPayload[] } RewardsPayload */
