import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    /** @methodtype initialization-method */
    constructor(other: string[], delimiter?: string) {
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        }
        this.components = other.map(c => this.unescape(c, this.delimiter));
    }


    /** @methodtype conversion-method */
    public asString(delimiter: string = this.delimiter): string {
        return this.components.join(delimiter);
    }

    /** @methodtype conversion-method */
    public asDataString(): string {
        return this.components.map(c => this.escape(c, this.delimiter)).join(this.delimiter);
    }

    /** @methodtype boolean-query-method */
    public isEmpty(): boolean {
        return this.components.length === 0;
    }

    /** @methodtype get-method */
    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    /** @methodtype get-method */
    public getNoComponents(): number {
        return this.components.length;
    }

    /** @methodtype get-method */
    public getComponent(i: number): string {
        if (i < 0 || i >= this.components.length) {
            throw new Error("Index out of bounds");
        }
        return this.components[i];
    }

    /** @methodtype set-method */
    public setComponent(i: number, c: string): void {
        if (i < 0 || i >= this.components.length) {
            throw new Error("Index out of bounds");
        }
        this.components[i] = c;
    }

    /** @methodtype command-method */
    public insert(i: number, c: string): void {
        if (i < 0 || i > this.components.length) {
            throw new Error("Index out of bounds");
        }
        this.components.splice(i, 0, c);
    }


    /** @methodtype command-method */
    public append(c: string): void {
        this.components.push(c);
    }


    /** @methodtype command-method */
    public remove(i: number): void {
        if (i < 0 || i >= this.components.length) {
            throw new Error("Index out of bounds");
        }
        this.components.splice(i, 1);
    }

    /** @methodtype command-method */
    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

    /** @methotype helper-method */
    public escape(s: string, d: string): string {
        return s.split(d).join(ESCAPE_CHARACTER + d);
    }

    /** @methotype helper-method */
    public unescape(s: string, d: string): string {
        return s.split(ESCAPE_CHARACTER + d).join(d);
    }


}