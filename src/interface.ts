import { LogTags } from './config';

export interface ILogOptions {
    logsy: boolean;
    style: string;
    label: string | LogTags;
}
