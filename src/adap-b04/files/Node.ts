import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { Name } from "../names/Name";
import { Directory } from "./Directory";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        IllegalArgumentException.assertIsNotNullOrUndefined(bn, "Arguments must not be null or undefined")
        IllegalArgumentException.assertIsNotNullOrUndefined(pn, "Arguments must not be null or undefined")

        this.doSetBaseName(bn);
        this.parentNode = pn;
    }

    public move(to: Directory): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(to, "Arguments must not bel null or undefined")
        this.parentNode.remove(this);
        to.add(this);
    }

    public getFullName(): Name {
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(bn, "Arguments must not be null or undefined")
        IllegalArgumentException.assertCondition(bn !== '', "Argument must not be empty String")
        this.doSetBaseName(bn);
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Node {
        return this.parentNode;
    }

}
