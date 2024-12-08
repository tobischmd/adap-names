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
        IllegalArgumentException.assert(other != null && other != undefined, "Argument must not be null or undefined");
        this.components = other.map(c => this.unescape(c, this.delimiter));
    }

    public clone(): Name {
        return Object.create(this);
    }

    public asString(delimiter: string = this.delimiter): string {
        IllegalArgumentException.assert(delimiter != null && delimiter.length == 1, "Delimiter must be a single character");
        return this.components.join(delimiter);
    }

    public toString(): string {
        return this.asDataString();
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents(), "Index out of bounds");
        let component = this.components[i];
        return component;
    }

    public setComponent(i: number, c: string) {
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents(), "Index out of bounds");
        IllegalArgumentException.assert(c != null && c != undefined, "Argument must not be null or undefined");
        this.checkProperlyMasked(c);
        c = this.unescape(c, this.delimiter);
        this.components[i] = c;
        MethodFailedException.assert(this.components[i] != null && this.components[i] != undefined && this.components[i] === c, "Setting component failed");
    }

    public insert(i: number, c: string) {
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents(), "Index out of bounds");
        IllegalArgumentException.assert(c != null && c != undefined, "Argument must not be null or undefined");
        this.checkProperlyMasked(c);
        c = this.unescape(c, this.delimiter);
        let length = this.getNoComponents();
        this.components.splice(i, 0, c);
        MethodFailedException.assert(this.components[i] != null && this.components[i] != undefined && this.components[i] === c && this.getNoComponents() === length + 1,"Inserting component failed");
    }

    public append(c: string) {
        IllegalArgumentException.assert(c != null && c != undefined, "Argument must not be null or undefined");
        this.checkProperlyMasked(c);
        c = this.unescape(c, this.delimiter);
        let length = this.getNoComponents();
        this.components.push(c);
        MethodFailedException.assert(this.components[this.getNoComponents() - 1] != null && this.components[this.getNoComponents() - 1] != undefined && this.components[this.getNoComponents() - 1] === c && this.getNoComponents() === length + 1, "Appending component failed");
    }

    public remove(i: number) {
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents(), "Index out of bounds");
        let length = this.getNoComponents();
        this.components.splice(i, 1);
        MethodFailedException.assert(this.getNoComponents() === length - 1, "Removing component failed");
    }
}