import {BaseError} from "./BaseError";

export class ValidationError extends BaseError {
    constructor(errorString: string) {
        super(errorString, 109, ValidationError.name);
    }
}