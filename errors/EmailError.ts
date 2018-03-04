import {BaseError} from "./BaseError";

export class EmailError extends BaseError {
    constructor(errorString: string) {
        super(errorString, 105, EmailError.name);
    }
}