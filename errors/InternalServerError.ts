import {BaseError} from "./BaseError";

export class InternalServerError extends BaseError {
    constructor(errorString: string) {
        super(errorString, 105, InternalServerError.name);
    }
}