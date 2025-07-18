export interface ILogsyPlugin {
    /**
     * Transform the log message and its arguments.
     * @param message The log message.
     * @param rest The rest of the arguments.
     * @returns An object containing the transformed message and arguments.
     */
    transform?: (message: string, rest: unknown[]) => {
        message: string;
        rest: unknown[];
    };

    /**
     * Called before the log message is emitted.
     * @param level The log level.
     * @param message The log message.
     * @param rest The rest of the arguments.
     */
    beforeLog?: (level: TLogLevel, message: string, rest: unknown[]) => void;

    /**
     * Called after the log message is emitted.
     * @param level The log level.
     * @param message The log message.
     * @param rest The rest of the arguments.
     */
    afterLog?: (level: TLogLevel, message: string, rest: unknown[]) => void;
}

export type TLogLevel = 'log' | 'info' | 'warn' | 'error';
