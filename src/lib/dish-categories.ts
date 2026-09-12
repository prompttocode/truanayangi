import type { Food } from './foods';
import { foodName, type Language } from './i18n';

export type DishGroup = 'all' | 'food' | 'drink' | 'snack' | 'nhau' | 'custom';

export type DishType =
  | 'all'
  | 'rice'
  | 'noodles'
  | 'bread'
  | 'grill'
  | 'light'
  | 'hotpot'
  | 'pizza'
  | 'veg'
  | 'other';

export type SortOrder = 'name' | 'name-desc' | 'price-up' | 'price-down' | 'rarity-up' | 'rarity-down';

export interface FilterState {
  group: DishGroup;
  type: DishType;
  minPrice: string;
  maxPrice: string;
  sort: SortOrder;
}

export const defaultFilterState: FilterState = {
  group: 'all',
  type: 'all',
  minPrice: '',
  maxPrice: '',
  sort: 'name',
};

export const dishGroupLabels: Record<DishGroup, { vi: string; en: string }> = {
  all: { vi: 'Tất cả', en: 'All' },
  food: { vi: 'Món chính', en: 'Mains' },
  drink: { vi: 'Đồ uống', en: 'Drinks' },
  snack: { vi: 'Ăn vặt', en: 'Snacks' },
  nhau: { vi: 'Món nhậu', en: 'Pub food' },
  custom: { vi: 'Món tự thêm', en: 'Custom' },
};

export const dishTypeLabels: Record<DishType, { vi: string; en: string }> = {
  all: { vi: 'Tất cả loại món', en: 'All types' },
  rice: { vi: 'Cơm & xôi', en: 'Rice & sticky rice' },
  noodles: { vi: 'Bún, phở & mì', en: 'Noodles & soups' },
  bread: { vi: 'Bánh mì & cuốn', en: 'Bread & rolls' },
  grill: { vi: 'Nướng & chiên', en: 'Grilled & fried' },
  light: { vi: 'Salad & món nhẹ', en: 'Salad & light bites' },
  hotpot: { vi: 'Lẩu & cháo', en: 'Hotpot & congee' },
  pizza: { vi: 'Pizza & pasta', en: 'Pizza & pasta' },
  veg: { vi: 'Món chay', en: 'Vegetarian' },
  other: { vi: 'Món khác', en: 'Other dishes' },
};

export const sortLabels: Record<SortOrder, { vi: string; en: string }> = {
  name: { vi: 'Tên A–Z', en: 'Name A–Z' },
  'name-desc': { vi: 'Tên Z–A', en: 'Name Z–A' },
  'price-up': { vi: 'Giá tăng dần', en: 'Price: Low to High' },
  'price-down': { vi: 'Giá giảm dần', en: 'Price: High to Low' },
  'rarity-down': { vi: 'Độ hiếm giảm dần', en: 'Rarity: High to Low' },
  'rarity-up': { vi: 'Độ hiếm tăng dần', en: 'Rarity: Low to High' },
};

export function classifyFood(food: Food): { group: DishGroup; type: DishType } {
  if (food.customId) {
    const lowerName = food.name.toLowerCase();
    if (food.veg) return { group: 'custom', type: 'veg' };
    if (/cơm|xôi|rice/.test(lowerName)) return { group: 'custom', type: 'rice' };
    if (/phở|bún|mì|miến|hủ tiếu|soba|udon|ramen/.test(lowerName)) return { group: 'custom', type: 'noodles' };
    if (/bánh mì|cuốn|roll|sandwich|burger/.test(lowerName)) return { group: 'custom', type: 'bread' };
    if (/nướng|chiên|rán|grill|bbq/.test(lowerName)) return { group: 'custom', type: 'grill' };
    if (/lẩu|cháo|soup/.test(lowerName)) return { group: 'custom', type: 'hotpot' };
    if (/pizza|pasta|spaghetti/.test(lowerName)) return { group: 'custom', type: 'pizza' };
    if (/salad|gỏi/.test(lowerName)) return { group: 'custom', type: 'light' };
    return { group: 'custom', type: 'other' };
  }

  const name = food.name.toLowerCase();
  const sub = food.sub.toLowerCase();
  const combined = `${name} ${sub}`;

  // Group classification
  let group: DishGroup = 'food';
  if (/cà phê|trà|sinh tố|nước ép|soda|đá xay|sữa|juice|coffee|tea/.test(combined)) {
    group = 'drink';
  } else if (/chè|kem|bánh ngọt|snack|khoai tây lắc|ăn vặt/.test(combined)) {
    group = 'snack';
  } else if (/nhậu|mồi|bia|mực nướng|ốc/.test(combined)) {
    group = 'nhau';
  }

  // Type classification - check compound words and specific types first
  let type: DishType = 'other';
  if (/lẩu|cháo/.test(combined)) {
    type = 'hotpot';
  } else if (/pizza|pasta|mì ý|lasagna|mac & cheese|gnocchi|nui xào/.test(combined)) {
    type = 'pizza';
  } else if (/bánh mì|bánh cuốn|bánh xèo|gỏi cuốn|kimbap|sandwich|kebab|cuộn|burrito|taco|quesadilla|burger|pita/.test(combined)) {
    type = 'bread';
  } else if (/cơm|xôi|biryani|risotto|gyudon|bibimbap/.test(combined)) {
    type = 'rice';
  } else if (/phở|bún|\bmì\b|mì |mì$|hủ tiếu|ramen|udon|soba|miến|bánh canh|bánh đa|pad thai/.test(combined)) {
    type = 'noodles';
  } else if (/salad|poke|falafel|dimsum|nem nướng/.test(combined)) {
    type = 'light';
  } else if (/nướng|chiên|bít tết|rán|bbq|fish & chips|bò né|lúc lắc/.test(combined)) {
    type = 'grill';
  } else if (food.veg) {
    type = 'veg';
  }

  return { group, type };
}

/**
 * Normalizes input number/string into thousands of VND (e.g. 50k -> 50, 50.000 -> 50, 50000 -> 50)
 */
export function parsePriceBound(val: string): number | null {
  const cleaned = val.trim().replace(/\./g, '').replace(/,/g, '').replace(/[kKđĐ]/g, '');
  if (!cleaned) return null;
  const num = Number(cleaned);
  if (!Number.isFinite(num) || num < 0) return null;
  // If user entered full amount in VND like 50000, convert to thousands (50)
  if (num >= 1000) return num / 1000;
  return num;
}

export function filterAndSortFoods(
  population: Food[],
  filters: FilterState,
  language: Language
): Food[] {
  const min = parsePriceBound(filters.minPrice);
  const max = parsePriceBound(filters.maxPrice);

  const filtered = population.filter(f => {
    const { group, type } = classifyFood(f);

    if (filters.group !== 'all') {
      if (filters.group === 'custom' && !f.customId) return false;
      if (filters.group !== 'custom' && group !== filters.group) return false;
    }

    if (filters.type !== 'all') {
      if (filters.type === 'veg') {
        if (!f.veg) return false;
      } else if (type !== filters.type) {
        return false;
      }
    }

    if (min !== null && f.price < min) return false;
    if (max !== null && f.price > max) return false;

    return true;
  });

  const vi = language === 'vi';
  return filtered.sort((a, b) => {
    switch (filters.sort) {
      case 'name':
        return foodName(a, language).localeCompare(foodName(b, language), vi ? 'vi' : 'en');
      case 'name-desc':
        return foodName(b, language).localeCompare(foodName(a, language), vi ? 'vi' : 'en');
      case 'price-up':
        return a.price - b.price || a.rarity - b.rarity;
      case 'price-down':
        return b.price - a.price || b.rarity - a.rarity;
      case 'rarity-up':
        return a.rarity - b.rarity || a.price - b.price;
      case 'rarity-down':
        return b.rarity - a.rarity || b.price - a.price;
      default:
        return a.rarity - b.rarity || a.price - b.price;
    }
  });
}
