import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    public open(): void {
        IllegalArgumentException.assertCondition(this.state === FileState.CLOSED, "File must be closed to open")
        // do something
    }

    public read(noBytes: number): Int8Array {
        // read something
        return new Int8Array();
    }

    public close(): void {
        IllegalArgumentException.assertCondition(this.state === FileState.OPEN, "File must be open to close")
        // do something
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

}