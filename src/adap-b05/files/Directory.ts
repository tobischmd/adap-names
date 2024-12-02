import { InvalidStateException } from "../common/InvalidStateException";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { Exception } from "../common/Exception";
import { Node } from "./Node";
import { RootNode } from "./RootNode";
import { AssertionDispatcher, ExceptionType } from "../common/AssertionDispatcher";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public add(cn: Node): void {
        this.childNodes.add(cn);
    }

    public remove(cn: Node): void {
        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

    public findNodes(bn: string): Set<Node> {
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, bn !== "" && bn !== null, "Invalid base name");
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
            ServiceFailureException.assertCondition(false, "Error finding nodes", e)
        }
        return new Set<Node>();
    }
}