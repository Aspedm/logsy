import Logsy from './Logsy';

export { Logsy };
export { LogTags } from './config';

export { redactSensitiveDataPlugin } from './plugins/redactSensitiveDataPlugin';
export { devOnlyPlugin } from './plugins/devOnlyPlugin';
export type { ILogsyPlugin, TLogLevel } from './plugins/interfaces';

export type { ILogOptions } from './interface';
