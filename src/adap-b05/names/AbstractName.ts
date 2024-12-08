import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { InvalidStateException } from "../common/InvalidStateException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        IllegalArgumentException.assert(delimiter != null && delimiter.length == 1, "Delimiter must be a single character");
        this.delimiter = delimiter;
    }

    public clone(): Name {
        return Object.create(this);
    }

    public asString(delimiter: string = this.delimiter): string {
        IllegalArgumentException.assert(delimiter != null && delimiter.length == 1, "Delimiter must be a single character");
        let s: string = "";
        for (let i = 0; i < this.getNoComponents(); i++) {
            s += this.getComponent(i);
            if (i < this.getNoComponents() - 1) {
                s += delimiter;
            }
        }
        return s;
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        let s: string = "";
        for (let i = 0; i < this.getNoComponents(); i++) {
            s += this.escape(this.getComponent(i), this.delimiter);
            if (i < this.getNoComponents() - 1) {
                s += this.delimiter;
            }
        }
        return s;
    }

    public isEqual(other: Name): boolean {
        IllegalArgumentException.assert(other != null && other != undefined, "Argument must not be null or undefined");
        if (this.getNoComponents() !== other.getNoComponents()) {
            return false;
        }
        if (this.delimiter !== other.getDelimiterCharacter()) {
            return false;
        }
        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }
        return true;
    }

    public getHashCode(): number {
        let hashCode: number = 0;
        const s: string = this.asDataString()+this.delimiter;
        for (let i = 0; i < s.length; i++) {
            let c = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }
        return hashCode;
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
        IllegalArgumentException.assert(other != null && other != undefined, "Argument must not be null or undefined");
        let oldLength = this.getNoComponents() + other.getNoComponents();
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
        MethodFailedException.assert(this.getNoComponents() === oldLength, "Concatenation failed");
    
    }

    /** @methotype helper-method */
    protected escape(s: string, d: string): string {
        return s.split(ESCAPE_CHARACTER).join(ESCAPE_CHARACTER + ESCAPE_CHARACTER).split(d).join(ESCAPE_CHARACTER + d);
    }

    /** @methotype helper-method */
    protected unescape(s: string, d: string): string {
        return s.split(ESCAPE_CHARACTER + d).join(d).split(ESCAPE_CHARACTER + ESCAPE_CHARACTER).join(ESCAPE_CHARACTER);
    }

    /** @methotype helper-method */
    protected checkProperlyMasked(c: string): void {
        let escaped = false;
        for (let i = 0; i < c.length; i++) {
            if (escaped) {
                IllegalArgumentException.assert(c[i] == ESCAPE_CHARACTER || c[i] == this.delimiter, "Component is not properly masked");
                escaped = false;
            } else {
                if (c[i] == ESCAPE_CHARACTER) {
                    escaped = true;
                } else if (c[i] == this.delimiter) {
                    throw new IllegalArgumentException("Component is not properly masked");
                }
            }
        }
        IllegalArgumentException.assert(!escaped, "Component is not properly masked");
    }
}