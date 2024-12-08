import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { InvalidStateException } from "../common/InvalidStateException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        super(delimiter);
        this.components = other.map(c => this.unescape(c, this.delimiter));
    }

    public clone(): Name {
        return Object.create(this);
    }

    public asString(delimiter: string = this.delimiter): string {
        return this.components.join(delimiter);
    }

    public toString(): string {
        return this.asDataString();
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        let component = this.components[i];
        return component;
    }

    public setComponent(i: number, c: string) {
        this.checkProperlyMasked(c);
        c = this.unescape(c, this.delimiter);
        this.components[i] = c;
    }

    public insert(i: number, c: string) {
        this.checkProperlyMasked(c);
        c = this.unescape(c, this.delimiter);
        let length = this.getNoComponents();
        this.components.splice(i, 0, c);
    }

    public append(c: string) {
        this.checkProperlyMasked(c);
        c = this.unescape(c, this.delimiter);
        let length = this.getNoComponents();
        this.components.push(c);
    }

    public remove(i: number) {
        let length = this.getNoComponents();
        this.components.splice(i, 1);
    }
}