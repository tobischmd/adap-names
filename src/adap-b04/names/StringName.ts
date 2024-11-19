import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { InvalidStateException } from "../common/InvalidStateException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailureException } from "../common/MethodFailureException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;
    private empty: boolean = true;

    constructor(other: string, delimiter?: string) {
        super(delimiter);
        if (other == null || other == undefined) {
            throw new IllegalArgumentException("Argument must not be null or undefined");
        }
        this.name = other;
        this.empty = false;
        this.noComponents = this.splitIntoComponents(other).length;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        if (i < 0 || i >= this.getNoComponents()) {
            throw new IllegalArgumentException("Index out of bounds");
        }
        let components = this.splitIntoComponents(this.name);
        let component = components[i];
        if (component == null || component == undefined) {
            throw new InvalidStateException("Component is null or undefined");
        }
        return this.unescape(component, this.delimiter);
    }

    public setComponent(i: number, c: string) {
        this.checkProperlyMasked(c);
        if (i < 0 || i >= this.getNoComponents()) {
            throw new IllegalArgumentException("Index out of bounds");
        }
        if (c == null || c == undefined) {
            throw new IllegalArgumentException("Argument must not be null or undefined");
        }
        let components = this.splitIntoComponents(this.name);
        components[i] = c;
        this.name = components.join(this.delimiter);
        if (this.getComponent(i) == null || this.getComponent(i) == undefined || this.getComponent(i) !== c) {
            throw new MethodFailureException("Setting component failed");
        }
    }

    public insert(i: number, c: string) {
        this.checkProperlyMasked(c);
        if (i < 0 || i > this.getNoComponents()) {
            throw new IllegalArgumentException("Index out of bounds");
        }
        if (c == null || c == undefined) {
            throw new IllegalArgumentException("Argument must not be null or undefined");
        }
        let components = this.splitIntoComponents(this.name);
        components.splice(i, 0, c);
        this.name = components.join(this.delimiter);
        if (this.getComponent(i) == null || this.getComponent(i) == undefined || this.getComponent(i) !== c) {
            throw new MethodFailureException("Inserting component failed");
        }
        this.noComponents++;
        if (this.getNoComponents() !== components.length) {
            throw new MethodFailureException("Inserting component failed");
        }
        this.empty = false;
    }

    public append(c: string) {
        this.checkProperlyMasked(c);
        if (c == null || c == undefined) {
            throw new IllegalArgumentException("Argument must not be null or undefined");
        }
        let components = this.splitIntoComponents(this.name);
        components.push(c);
        this.name = components.join(this.delimiter);
        this.noComponents++;
        this.empty = false;
        if (this.getComponent(this.getNoComponents() - 1) == null || this.getComponent(this.getNoComponents() - 1) == undefined || this.getComponent(this.getNoComponents() - 1) !== c) {
            throw new MethodFailureException("Appending component failed");
        }
        if (this.getNoComponents() !== components.length) {
            throw new MethodFailureException("Appending component failed");
        }
    }

    public remove(i: number) {
        if (i < 0 || i >= this.getNoComponents()) {
            throw new IllegalArgumentException("Index out of bounds");
        }
        let components = this.splitIntoComponents(this.name);
        components.splice(i, 1);
        this.name = components.join(this.delimiter);
        this.noComponents--;
        if (this.getNoComponents() !== components.length) {
            throw new MethodFailureException("Removing component failed");
        }
        if (this.getNoComponents() === 0) {
            this.empty = true;
        }
    }

    public concat(other: Name): void {
        super.concat(other);
        this.empty = false;
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