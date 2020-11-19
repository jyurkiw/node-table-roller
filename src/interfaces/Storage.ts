import { NameMappable } from './NameMappable';

export interface Storage<t extends NameMappable> {
    data: any;

    add(d: t): boolean;
    addm(d: t[]): boolean;
    has(n: string): boolean;
    size(): number;
    get(n: string): t;
    remove(n: string): boolean;
}