import { Cloneable } from "../common/Cloneable";
import { Equality } from "../common/Equality";
import { Printable } from "../common/Printable";
import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    abstract asString(delimiter: string): string;

    public toString(): string {
        return this.asDataString();
    }

    abstract asDataString(): string;

    public isEqual(other: Name): boolean {
        return this.asDataString() === other.asDataString();
    }

    public getHashCode(): number {
        let hashCode: number = 0;
        const s: string = this.asDataString();
        for (let i = 0; i < s.length; i++) {
            let c = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }
        return hashCode;
    }

    public clone(): Name {
        return JSON.parse(JSON.stringify(this));
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

    /** @methotype helper-method */
    protected escape(s: string, d: string): string {
        return s.split(d).join(ESCAPE_CHARACTER + d);
    }

    /** @methotype helper-method */
    protected unescape(s: string, d: string): string {
        return s.split(ESCAPE_CHARACTER + d).join(d);
    }

}