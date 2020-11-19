import { Storage } from './interfaces/Storage';
import { NameMappable } from './interfaces/NameMappable';

export class Store<t extends NameMappable> implements Storage<t> {
    data: any = {};
    dataNames: Set<string> = new Set<string>();

    add(i: t): boolean {
        if (this.has(i.name)) { return false; }
        this.data[i.name] = i;
        this.dataNames.add(i.name);
        return true;
    }

    addm(d: t[]): boolean {
        for (let i of d) {
            if (!this.add(i)) {
                throw new Error('Duplicate item: ' + i.name);
            }
        }
        return true;
    }

    has(n: string): boolean {
        return this.dataNames.has(n);
    }

    size(): number {
        return this.dataNames.size;
    }

    get(n: string): t {
        if (this.has(n)) { return this.data[n]; }
        else { throw new Error(n + ' does not exist.'); }
    }

    remove(n: string): boolean {
        if (this.has(n)) {
            this.dataNames.delete(n);
            delete(this.data[n]);
            return true;
        }
        return false;
    }
}