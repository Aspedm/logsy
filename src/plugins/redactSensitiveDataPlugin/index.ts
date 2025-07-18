import type { ILogsyPlugin } from '../interfaces';

import { redactData } from './utils/reductData';

export const redactSensitiveDataPlugin: ILogsyPlugin = {
  transform(message, rest) {
    const redacted = rest.map((item) => {
      if (typeof item === 'object' && item !== null) {
        return redactData(item);
      }

      return item;
    });

    return { message, rest: redacted };
  },
};
