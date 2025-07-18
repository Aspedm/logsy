import type { ILogsyPlugin, TLogLevel } from '../interfaces';

export const devOnlyPlugin: ILogsyPlugin = {
    beforeLog(level: TLogLevel): void {
        const env = typeof process !== 'undefined' && process.env?.NODE_ENV;
        if (env !== 'development') {
            const noop = (): void => {};
            console[level] = noop;
        }
    },
};
