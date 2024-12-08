import { InvalidStateException } from "../common/InvalidStateException";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { Exception } from "../common/Exception";
import { Node } from "./Node";
import { RootNode } from "./RootNode";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public hasChildNode(cn: Node): boolean {
        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void {
        this.childNodes.add(cn);
    }

    public removeChildNode(cn: Node): void {
        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

    public findNodes(bn: string): Set<Node> {
        try {
            const result: Set<Node> = new Set<Node>();
            if (this.doGetBaseName() === bn) {
                result.add(this);
            }
            this.childNodes.forEach((node) => {
                const foundNodes = node.findNodes(bn);
                foundNodes.forEach((foundNode) => {
                    result.add(foundNode);
                });
            });
            this.assertClassInvariants();
            return result;
        } catch (e: any) {
            if (e instanceof ServiceFailureException) {
                throw e;
            }
            ServiceFailureException.assert(false, "Error finding nodes", e)
        }
        return new Set<Node>();
    }
}