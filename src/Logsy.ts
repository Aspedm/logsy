import { DEFAULT_LABEL_COLOR, LogTags } from './config';
import type { ILogOptions } from './interface';
import type { ILogsyPlugin, TLogLevel } from './plugins/interfaces';
import { getLabelStyle } from './styles';

class Logsy {
  private static readonly DEFAULT_LABEL = LogTags.DEFAULT;

  private static readonly DEFAULT_STYLE = getLabelStyle(DEFAULT_LABEL_COLOR);

  private static readonly plugins: ILogsyPlugin[] = [];

  static use(plugin: ILogsyPlugin): void {
    Logsy.plugins.push(plugin);
  }

  private static emitBefore(level: TLogLevel, message: string, rest: unknown[]): void {
    for (const plugin of Logsy.plugins) {
      plugin.beforeLog?.(level, message, rest);
    }
  }

  private static emitAfter(level: TLogLevel, message: string, rest: unknown[]): void {
    for (const plugin of Logsy.plugins) {
      plugin.afterLog?.(level, message, rest);
    }
  }

  private static parseArgs(...args: unknown[]): {
    message: string;
    options: ILogOptions;
    rest: unknown[];
  } {
    const params = [...args];

    let message = '';
    if (typeof params[0] === 'string') {
      message = params.shift() as string;
    }

    let options: ILogOptions = {
      logsy: true,
      label: Logsy.DEFAULT_LABEL,
      style: Logsy.DEFAULT_STYLE,
    };

    if (
      params[0] &&
      typeof params[0] === 'object' &&
      !Array.isArray(params[0]) &&
      (
        'logsy' in (params[0] as object)
      )
    ) {
      const opts = params.shift() as ILogOptions;

      options = {
        ...options,
        ...opts,
      };
    }

    let rest = params;

    // Apply transform plugins
    for (const plugin of Logsy.plugins) {
      if (plugin.transform) {
        const result = plugin.transform(message, rest);

        message = result.message;
        rest = result.rest;
      }
    }

    return { message, options, rest };
  }

  static info(...args: unknown[]): void {
    const data = Logsy.parseArgs(...args);
    const prefix = `%c${data.options.label}%c${data.message}`;

    Logsy.emitBefore('info', data.message, data.rest);
    console.info(prefix, data.options.style, 'color: inherit', ...data.rest);
    Logsy.emitAfter('info', data.message, data.rest);
  }

  static warn(...args: unknown[]): void {
    const data = Logsy.parseArgs(...args);
    const prefix = `%c${data.options.label}%c${data.message}`;

    Logsy.emitBefore('warn', data.message, data.rest);
    console.warn(prefix, data.options.style, 'color: inherit', ...data.rest);
    Logsy.emitAfter('warn', data.message, data.rest);
  }

  static error(...args: unknown[]): void {
    const data = Logsy.parseArgs(...args);
    const prefix = `%c${data.options.label}%c${data.message}`;

    Logsy.emitBefore('error', data.message, data.rest);
    console.error(prefix, data.options.style, 'color: inherit', ...data.rest);
    Logsy.emitAfter('error', data.message, data.rest);
  }

  static log(...args: unknown[]): void {
    const data = Logsy.parseArgs(...args);
    const prefix = `%c${data.options.label}%c${data.message}`;

    Logsy.emitBefore('log', data.message, data.rest);
    console.log(prefix, data.options.style, 'color: inherit', ...data.rest);
    Logsy.emitAfter('log', data.message, data.rest);
  }

  static async spinner<T>(
    message: string,
    promise: Promise<T>,
    options: ILogOptions = {
      logsy: true,
      label: Logsy.DEFAULT_LABEL,
      style: Logsy.DEFAULT_STYLE,
    },
  ): Promise<T> {
    const {style, label} = options;

    const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let i = 0;

    const prefix = (): string => `%c${label}%c ${spinnerFrames[i % spinnerFrames.length]} ${message}`;
    const interval = setInterval(() => {
      i++;
      console.clear();
      console.log(prefix(), style, 'color: inherit');
    }, 200);

    return promise
      .then((res) => {
        clearInterval(interval);
        console.clear();
        console.log(`%c${label}%c ✅ ${message}`, style, 'color: inherit', res);
        return res;
      })
      .catch((err) => {
        clearInterval(interval);
        console.clear();
        console.error(`%c${label}%c ❌ ${message}`, style, 'color: inherit', err);
        return undefined as unknown as T;
      });
  }
}

export default Logsy;
