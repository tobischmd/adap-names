import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;
    private empty: boolean = true;

    constructor(other: string, delimiter?: string) {
        super(delimiter);
        IllegalArgumentException.assert(other != null && other != undefined, "Argument must not be null or undefined");
        this.name = other;
        this.empty = false;
        this.noComponents = this.splitIntoComponents(other).length;
    }

    public clone(): Name {
        let clone = Object.create(this);
        Object.setPrototypeOf(clone, StringName.prototype);
        return clone;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    private deepClone(): StringName {
        let clone = structuredClone(this);
        Object.setPrototypeOf(clone, StringName.prototype);
        return clone;
    }

    public getComponent(i: number): string {
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents(), "Index out of bounds");
        let components = this.splitIntoComponents(this.name);
        let component = components[i];
        return this.unescape(component, this.delimiter);
    }

    public setComponent(i: number, c: string) : Name {
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents(), "Index out of bounds");
        IllegalArgumentException.assert(c != null && c != undefined, "Argument must not be null or undefined");
        this.checkProperlyMasked(c);

        const clone = this.deepClone();
        let components = clone.splitIntoComponents(clone.name);
        components[i] = c;
        clone.name = components.join(clone.delimiter);
        MethodFailedException.assert(clone.getComponent(i) != null && clone.getComponent(i) != undefined && clone.getComponent(i) === c, "Setting component failed");
        return clone;
    }

    public insert(i: number, c: string) : Name {
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents(), "Index out of bounds");
        IllegalArgumentException.assert(c != null && c != undefined, "Argument must not be null or undefined");
        this.checkProperlyMasked(c);

        const clone = this.deepClone();
        let components = this.splitIntoComponents(clone.name);
        components.splice(i, 0, c);
        clone.name = components.join(clone.delimiter);
        if (clone.getComponent(i) == null || clone.getComponent(i) == undefined || clone.getComponent(i) !== c) {
            throw new MethodFailedException("Inserting component failed");
        }
        clone.noComponents++;
        MethodFailedException.assert(clone.getNoComponents() === components.length, "Inserting component failed");
        clone.empty = false;
        return clone;
    }

    public append(c: string) : Name {
        IllegalArgumentException.assert(c != null && c != undefined, "Argument must not be null or undefined");
        this.checkProperlyMasked(c);

        const clone = this.deepClone();
        let components = clone.splitIntoComponents(clone.name);
        components.push(c);
        clone.name = components.join(clone.delimiter);
        clone.noComponents++;
        clone.empty = false;
        MethodFailedException.assert(clone.getComponent(clone.getNoComponents() - 1) != null && clone.getComponent(clone.getNoComponents() - 1) != undefined && clone.getComponent(clone.getNoComponents() - 1) === c, "Appending component failed");
        MethodFailedException.assert(clone.getNoComponents() === components.length, "Appending component failed");
        return clone;
    }

    public remove(i: number): Name {
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents(), "Index out of bounds");

        const clone = this.deepClone();
        let components = clone.splitIntoComponents(clone.name);
        components.splice(i, 1);
        clone.name = components.join(clone.delimiter);
        clone.noComponents--;
        MethodFailedException.assert(clone.getNoComponents() === components.length, "Removing component failed");
        
        if (clone.getNoComponents() === 0) {
            clone.empty = true;
        }

        return clone;
    }

    public concat(other: Name): Name {
        const concat = super.concat(other);
        this.empty = false;
        return concat;
    }


     /** @methotype helper-method */
     private splitIntoComponents(s: string): string[] {
        if (this.empty) return [];
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
}