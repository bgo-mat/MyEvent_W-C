import { Buffer } from 'buffer';
// @ts-ignore
import process from 'process/browser';

(window as any).global = window;
(window as any).process = process;
(window as any).Buffer = Buffer;
