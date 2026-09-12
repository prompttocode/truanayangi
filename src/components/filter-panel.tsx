import React, { useState } from 'react';
import { SlidersHorizontal, Minus, Plus, RotateCcw } from 'lucide-react';
import {
  type FilterState,
  defaultFilterState,
  dishGroupLabels,
  dishTypeLabels,
  sortLabels,
  type DishGroup,
  type DishType,
  type SortOrder,
} from '@/lib/dish-categories';
import type { Language } from '@/lib/i18n';

interface FilterPanelProps {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  language: Language;
  totalMatches?: number;
}

export function FilterPanel({
  filters,
  onChange,
  language,
  totalMatches,
}: FilterPanelProps) {
  const vi = language === 'vi';
  const [collapsed, setCollapsed] = useState(false);

  const hasActiveFilters =
    filters.group !== 'all' ||
    filters.type !== 'all' ||
    filters.minPrice !== '' ||
    filters.maxPrice !== '' ||
    filters.sort !== 'name';

  const resetFilters = () => {
    onChange(defaultFilterState);
  };

  return (
    <div className={`discovery-filter-panel ${collapsed ? 'is-collapsed' : ''}`}>
      <button
        type="button"
        className="filter-panel-header"
        onClick={() => setCollapsed(!collapsed)}
        aria-expanded={!collapsed}
        aria-controls="filter-panel-body"
      >
        <div className="filter-panel-title">
          <SlidersHorizontal size={17} aria-hidden="true" />
          <span>{vi ? 'Bộ lọc' : 'Filters'}</span>
          {totalMatches !== undefined && (
            <span className="filter-badge">
              {totalMatches} {vi ? 'món' : 'dishes'}
            </span>
          )}
        </div>
        <div className="filter-toggle-icon" aria-hidden="true">
          {collapsed ? <Plus size={16} /> : <Minus size={16} />}
        </div>
      </button>

      {!collapsed && (
        <div id="filter-panel-body" className="filter-panel-body">
          <div className="filter-row">
            <label className="filter-field">
              <span className="filter-label">{vi ? 'Nhóm món' : 'Dish group'}</span>
              <div className="filter-select-wrap">
                <select
                  value={filters.group}
                  onChange={(e) =>
                    onChange({ ...filters, group: e.target.value as DishGroup })
                  }
                >
                  {(Object.keys(dishGroupLabels) as DishGroup[]).map((key) => (
                    <option key={key} value={key}>
                      {vi ? dishGroupLabels[key].vi : dishGroupLabels[key].en}
                    </option>
                  ))}
                </select>
              </div>
            </label>

            <label className="filter-field">
              <span className="filter-label">{vi ? 'Loại món' : 'Dish type'}</span>
              <div className="filter-select-wrap">
                <select
                  value={filters.type}
                  onChange={(e) =>
                    onChange({ ...filters, type: e.target.value as DishType })
                  }
                >
                  {(Object.keys(dishTypeLabels) as DishType[]).map((key) => (
                    <option key={key} value={key}>
                      {vi ? dishTypeLabels[key].vi : dishTypeLabels[key].en}
                    </option>
                  ))}
                </select>
              </div>
            </label>

            <label className="filter-field">
              <span className="filter-label">{vi ? 'Giá từ (VNĐ)' : 'Price from (VND)'}</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder={vi ? 'VD: 30.000' : 'e.g. 30,000'}
                value={filters.minPrice}
                onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
              />
            </label>
          </div>

          <div className="filter-row">
            <label className="filter-field">
              <span className="filter-label">{vi ? 'Giá đến (VNĐ)' : 'Price to (VND)'}</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder={vi ? 'VD: 100.000' : 'e.g. 100,000'}
                value={filters.maxPrice}
                onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
              />
            </label>

            <label className="filter-field">
              <span className="filter-label">{vi ? 'Sắp xếp' : 'Sort by'}</span>
              <div className="filter-select-wrap">
                <select
                  value={filters.sort}
                  onChange={(e) =>
                    onChange({ ...filters, sort: e.target.value as SortOrder })
                  }
                >
                  {(Object.keys(sortLabels) as SortOrder[]).map((key) => (
                    <option key={key} value={key}>
                      {vi ? sortLabels[key].vi : sortLabels[key].en}
                    </option>
                  ))}
                </select>
              </div>
            </label>

            <div className="filter-field filter-actions-field">
              {hasActiveFilters && (
                <button
                  type="button"
                  className="filter-reset-btn"
                  onClick={resetFilters}
                  title={vi ? 'Xoá tất cả bộ lọc' : 'Clear all filters'}
                >
                  <RotateCcw size={14} />
                  <span>{vi ? 'Đặt lại' : 'Reset'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
