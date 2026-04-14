import type { Streaming } from '../../types/streaming.type';
import { BaseMapper } from './base.mapper';

export class StreamingMapper extends BaseMapper {
  static toDomain(raw: unknown): Streaming | null {
    if (!this.isObject(raw)) {
      return null;
    }

    const isValid = this.isValid(raw, {
      id: (val) => this.canBeNumber(val),
      name: (val) => this.isNotEmptyString(val),
      url: (val) => this.isNotEmptyString(val),
      logo_url: (val) => this.isNotEmptyString(val),
    });

    if (!isValid) {
      return null;
    }

    return {
      id: this.toNumber(raw['id']),
      name: this.sanitizeString(raw['name']),
      url: this.sanitizeString(raw['url']),
      logo_url: this.sanitizeString(raw['logo_url']),
    };
  }
}
