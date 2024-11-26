import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { Node } from "./Node";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public add(cn: Node): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(cn, "Child Node must not be null or undefined")
        this.childNodes.add(cn);
    }

    public remove(cn: Node): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(cn, "Child Node must not be null or undefined")
        const childExists = this.childNodes.has(cn)
        IllegalArgumentException.assertCondition(!childExists, "Node must be in Directory to remove it")
        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

}