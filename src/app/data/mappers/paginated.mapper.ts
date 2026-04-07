import type { PaginatedResult } from '../../types/paginated-result.type';
import { BaseMapper } from './base.mapper';

/**
 * Converte o bloco paginado da API (objeto em `response.data` após o envelope) para `PaginatedResult<T>`.
 */
export class PaginatedMapper extends BaseMapper {
  static toPaginatedResult<T>(
    raw: unknown,
    mapItem: (row: unknown) => T | null
  ): PaginatedResult<T> | null {
    if (!this.isObject(raw)) {
      return null;
    }

    const rowData = raw['data'];
    if (!Array.isArray(rowData)) {
      return null;
    }

    const isValid = this.isValid(raw, {
      current_page: (v) => this.canBeNumber(v),
      last_page: (v) => this.canBeNumber(v),
      per_page: (v) => this.canBeNumber(v),
      total: (v) => this.canBeNumber(v),
    });

    if (!isValid) {
      return null;
    }

    const items = rowData
      .map((row) => mapItem(row))
      .filter((item): item is T => item !== null);

    const fromVal = raw['from'];
    const toVal = raw['to'];

    return {
      items,
      total: this.toNumber(raw['total']),
      currentPage: this.toNumber(raw['current_page'], 1),
      lastPage: Math.max(1, this.toNumber(raw['last_page'], 1)),
      perPage: this.toNumber(raw['per_page']),
      from:
        fromVal === null || fromVal === undefined
          ? null
          : this.canBeNumber(fromVal)
            ? this.toNumber(fromVal)
            : null,
      to:
        toVal === null || toVal === undefined
          ? null
          : this.canBeNumber(toVal)
            ? this.toNumber(toVal)
            : null,
    };
  }
}
