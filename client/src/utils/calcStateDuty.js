// src/utils/calcStateDuty.js

/**
 * Базовая пошлина для ИСКА (полная, до 50%) с потолком 900 000 ₽
 * @param {number} S - цена иска
 * @returns {number}
 */
function baseClaimDuty(S) {
  if (!Number.isFinite(S) || S <= 0) return 0;

  let g;
  if (S <= 100_000) {
    g = 4_000;
  } else if (S <= 300_000) {
    g = 4_000 + 0.03 * (S - 100_000);
  } else if (S <= 500_000) {
    g = 10_000 + 0.025 * (S - 300_000);
  } else if (S <= 1_000_000) {
    g = 15_000 + 0.02 * (S - 500_000);
  } else if (S <= 3_000_000) {
    g = 25_000 + 0.01 * (S - 1_000_000);
  } else if (S <= 8_000_000) {
    g = 45_000 + 0.007 * (S - 3_000_000);
  } else if (S <= 24_000_000) {
    g = 80_000 + 0.0035 * (S - 8_000_000);
  } else if (S <= 50_000_000) {
    g = 136_000 + 0.003 * (S - 24_000_000);
  } else if (S <= 100_000_000) {
    g = 214_000 + 0.002 * (S - 50_000_000);
  } else {
    g = 314_000 + 0.0015 * (S - 100_000_000);
  }
  return Math.min(g, 900_000);
}

/**
 * Итоговая пошлина "по-простому":
 * всегда считаем как для судебного приказа = 50% от иска,
 * с потолком 450 000 ₽.
 * @param {number} claim - цена иска (руб.)
 * @returns {number}
 */
export function calcStateDuty(claim) {
  const gClaim = baseClaimDuty(Number(claim));
  const gOrder = gClaim * 0.5;
  return Math.round(Math.min(gOrder, 450_000));
}
