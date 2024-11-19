import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { InvalidStateException } from "../common/InvalidStateException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailureException } from "../common/MethodFailureException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        super(delimiter);
        if (other == null || other == undefined) {
            throw new IllegalArgumentException("Argument must not be null or undefined");
        }
        this.components = other.map(c => this.unescape(c, this.delimiter));
    }

    public clone(): Name {
        return Object.create(this);
    }

    public asString(delimiter: string = this.delimiter): string {
        if (delimiter == null || delimiter.length != 1) {
            throw new IllegalArgumentException("Delimiter must be a single character");
        }
        return this.components.join(delimiter);
    }

    public toString(): string {
        return this.asDataString();
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        if (i < 0 || i >= this.getNoComponents()) {
            throw new IllegalArgumentException("Index out of bounds");
        }
        let component = this.components[i];
        if (component == null || component == undefined) {
            throw new InvalidStateException("Component is null or undefined");
        }
        return component;
    }

    public setComponent(i: number, c: string) {
        this.checkProperlyMasked(c);
        c = this.unescape(c, this.delimiter);
        if (i < 0 || i >= this.getNoComponents()) {
            throw new IllegalArgumentException("Index out of bounds");
        }
        if (c == null || c == undefined) {
            throw new IllegalArgumentException("Argument must not be null or undefined");
        } 
        this.components[i] = c;
        if (this.components[i] == null || this.components[i] == undefined || this.components[i] !== c) {
            throw new MethodFailureException("Setting component failed");
        }
    }

    public insert(i: number, c: string) {
        this.checkProperlyMasked(c);
        c = this.unescape(c, this.delimiter);
        let length = this.getNoComponents();
        if (i < 0 || i > this.getNoComponents()) {
            throw new IllegalArgumentException("Index out of bounds");
        }
        if (c == null || c == undefined) {
            throw new IllegalArgumentException("Argument must not be null or undefined");
        }
        this.components.splice(i, 0, c);
        if (this.components[i] == null || this.components[i] == undefined || this.components[i] !== c || this.getNoComponents() !== length + 1) {
            throw new MethodFailureException("Inserting component failed");
        }
    }

    public append(c: string) {
        this.checkProperlyMasked(c);
        c = this.unescape(c, this.delimiter);
        let length = this.getNoComponents();
        if (c == null || c == undefined) {
            throw new IllegalArgumentException("Argument must not be null or undefined");
        }
        this.components.push(c);
        if (this.components[this.getNoComponents() - 1] == null || this.components[this.getNoComponents() - 1] == undefined || this.components[this.getNoComponents() - 1] !== c || this.getNoComponents() !== length + 1) {
            throw new MethodFailureException("Appending component failed");
        }
    }

    public remove(i: number) {
        let length = this.getNoComponents();
        if (i < 0 || i >= this.getNoComponents()) {
            throw new IllegalArgumentException("Index out of bounds");
        }
        this.components.splice(i, 1);
        if (this.getNoComponents() !== length - 1) {
            throw new MethodFailureException("Removing component failed");
        }
    }
}