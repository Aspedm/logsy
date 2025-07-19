import type { ILogsyPlugin, TLogLevel } from '../interfaces';

const originalConsole: Partial<Record<TLogLevel, typeof console.log>> = {};

export const devOnlyPlugin: ILogsyPlugin = {
  beforeLog(level: TLogLevel): void {
    const env = typeof process !== 'undefined' && process.env?.NODE_ENV;
    if (env !== 'development') {
      if (!originalConsole[level]) {
        originalConsole[level] = console[level];
        console[level] = (): void => {};
      }
    }
  },

  afterLog(level: TLogLevel): void {
    if (originalConsole[level]) {
      console[level] = originalConsole[level]!;
      delete originalConsole[level];
    }
  },
};
