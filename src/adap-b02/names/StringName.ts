import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected length: number = 0;

    /** @methodtype initialization-method */
    constructor(other: string, delimiter?: string) {
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        }
        this.name = other;
        this.length = this.splitIntoComponents(this.name).length;
    }


    /** @methodtype conversion-method */
    public asString(delimiter: string = this.delimiter): string {
        return this.splitIntoComponents(this.name).map(s => this.unescape(s, this.delimiter)).join(delimiter);
    }

    /** @methodtype conversion-method */
    public asDataString(): string {
        return this.name;
    }


    /** @methodtype boolean-query-method */
    public isEmpty(): boolean {
        return this.name.length === 0;
    }

    /** @methodtype get-method */
    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    /** @methodtype get-method */
    public getNoComponents(): number {
        return this.length;
    }

    /** @methodtype get-method */
    public getComponent(x: number): string {
        if (x < 0 || x >= this.length) {
            throw new Error("Index out of bounds");
        }

        return this.splitIntoComponents(this.name)[x];
    }

    /** @methodtype set-method */
    public setComponent(n: number, c: string): void {
        if (n < 0 || n >= this.length) {
            throw new Error("Index out of bounds");
        }
        let components = this.splitIntoComponents(this.name);
        components[n] = this.escape(this.unescape(c, this.delimiter), this.delimiter);
        this.name = components.join(this.delimiter);
    }

    /** @methodtype command-method */
    public insert(n: number, c: string): void {
        if (n < 0 || n > this.length) {
            throw new Error("Index out of bounds");
        }
        let components = this.splitIntoComponents(this.name);
        components.splice(n, 0, c);
        this.name = components.join(this.delimiter);
        this.length++;
    }


    /** @methodtype command-method */
    public append(c: string): void {
        let components = this.splitIntoComponents(this.name);
        components.push(c);
        this.name = components.join(this.delimiter);
        this.length++;
    }


    /** @methodtype command-method */
    public remove(n: number): void {
        if (n < 0 || n >= this.length) {
            throw new Error("Index out of bounds");
        }
        let components = this.splitIntoComponents(this.name);
        components.splice(n, 1);
        this.name = components.join(this.delimiter);
        this.length--;
    }


    /** @methodtype command-method */
    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

    /** @methotype helper-method */
    private escape(s: string, d: string): string {
        return s.split(d).join(ESCAPE_CHARACTER + d);
    }

    /** @methotype helper-method */
    private splitIntoComponents(s: string): string[] {
        let components: string[] = [];
        let escaped = false;
        let current = "";
        for (let i = 0; i < s.length; i++) {
            if (s[i] === ESCAPE_CHARACTER) {
                current += s[i];
                if (escaped) {
                    escaped = false;
                } else {
                escaped = true;
                }
            } else if (s[i] === this.delimiter && !escaped) {
                components.push(current);
                current = "";
            } else {
                current += s[i];
                escaped = false;
            }
        }
        components.push(current);
        return components;
    }

    /** @methotype helper-method */
    private unescape(s: string, d: string): string {
        return s.split(ESCAPE_CHARACTER + d).join(d);
    }
}