import { useMemo } from 'react';

/**
 * Groups and returns top N items per buff, sorted by the absolute numeric value in `buff_bonus_text`.
 *
 * @param {Array} items - List of items to group and sort.
 * @param {Object} options
 * @param {number} options.topN - Number of top items to return per buff.
 * @returns {Object} buffId => [top items]
 */
export function useTopItemsByBuff(items, { topN = 3 } = {}) {
  const extractBonusValue = (text) => {
    if (typeof text !== 'string') return 0;
    const match = text.match(/-?\d+/);
    return match ? Math.abs(parseInt(match[0], 10)) : 0;
  };

  return useMemo(() => {
    const grouped = {};

    for (const item of items) {
      if (!item.buff_id) continue;
      if (!grouped[item.buff_id]) grouped[item.buff_id] = [];
      grouped[item.buff_id].push(item);
    }

    const topByBuff = Object.fromEntries(
      Object.entries(grouped).map(([buffId, itemList]) => [
        buffId,
        itemList
          .slice()
          .sort(
            (a, b) => extractBonusValue(b.buff_bonus_text) - extractBonusValue(a.buff_bonus_text)
          )
          .slice(0, topN),
      ])
    );

    return topByBuff;
  }, [items, topN]);
}
