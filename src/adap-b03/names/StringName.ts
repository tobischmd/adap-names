import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected length: number = 0;

    constructor(other: string, delimiter?: string) {
        super(delimiter);
        this.name = other;
        this.length = this.splitIntoComponents(this.name).length;
    }

    getNoComponents(): number {
        return this.length;
    }

    asDataString(): string {
        return this.name;
    }

    getComponent(i: number): string {
        if (i < 0 || i >= this.length) {
            throw new Error("Index out of bounds");
        }

        return this.splitIntoComponents(this.name)[i];
    }
    setComponent(i: number, c: string) {
        if (i < 0 || i >= this.length) {
            throw new Error("Index out of bounds");
        }
        let components = this.splitIntoComponents(this.name);
        components[i] = c;
        this.name = components.join(this.delimiter);
    }

    insert(i: number, c: string) {
        if (i < 0 || i > this.length) {
            throw new Error("Index out of bounds");
        }
        let components = this.splitIntoComponents(this.name);
        components.splice(i, 0, c);
        this.name = components.join(this.delimiter);
        this.length++;
    }

    append(c: string) {
        let components = this.splitIntoComponents(this.name);
        components.push(c);
        this.name = components.join(this.delimiter);
        this.length++;
    }

    remove(i: number) {
        if (i < 0 || i >= this.length) {
            throw new Error("Index out of bounds");
        }
        let components = this.splitIntoComponents(this.name);
        components.splice(i, 1);
        this.name = components.join(this.delimiter);
        this.length--;
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

}