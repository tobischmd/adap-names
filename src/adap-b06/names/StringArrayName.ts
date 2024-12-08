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
        let clone = Object.create(this);
        Object.setPrototypeOf(clone, StringArrayName.prototype);
        return clone;
    }

    private deepClone(): StringArrayName {
        let clone = structuredClone(this);
        Object.setPrototypeOf(clone, StringArrayName.prototype);
        return clone;
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

    public setComponent(i: number, c: string) : Name{
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents(), "Index out of bounds");
        IllegalArgumentException.assert(c != null && c != undefined, "Argument must not be null or undefined");
        this.checkProperlyMasked(c);
        const clone = this.deepClone();
        c = clone.unescape(c, clone.delimiter);
        clone.components[i] = c;
        MethodFailedException.assert(clone.components[i] != null && clone.components[i] != undefined && clone.components[i] === c, "Setting component failed");
        return clone;
    }

    public insert(i: number, c: string) : Name  {
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents(), "Index out of bounds");
        IllegalArgumentException.assert(c != null && c != undefined, "Argument must not be null or undefined");
        this.checkProperlyMasked(c);
        c = this.unescape(c, this.delimiter);
        let length = this.getNoComponents();
        const clone = this.deepClone();
        clone.components.splice(i, 0, c);
        MethodFailedException.assert(clone.components[i] != null && clone.components[i] != undefined && clone.components[i] === c && clone.getNoComponents() === length + 1,"Inserting component failed");
        return clone
    }

    public append(c: string): Name {
        IllegalArgumentException.assert(c != null && c != undefined, "Argument must not be null or undefined");
        this.checkProperlyMasked(c);
        c = this.unescape(c, this.delimiter);
        let length = this.getNoComponents();

        const clone = this.deepClone();
        clone.components.push(c);
        MethodFailedException.assert(clone.components[clone.getNoComponents() - 1] != null && clone.components[clone.getNoComponents() - 1] != undefined && clone.components[clone.getNoComponents() - 1] === c && clone.getNoComponents() === length + 1, "Appending component failed");
        return clone;
    }

    public remove(i: number): Name {
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents(), "Index out of bounds");
        let length = this.getNoComponents();
        const clone = this.deepClone();
        clone.components.splice(i, 1);
        MethodFailedException.assert(clone.getNoComponents() === length - 1, "Removing component failed");
        return clone;
    }
}