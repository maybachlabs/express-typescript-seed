import {BaseError} from "./BaseError";

export class DatabaseError extends BaseError {
    constructor(errorString: string) {
        super(errorString, 102, DatabaseError.name);
    }
}