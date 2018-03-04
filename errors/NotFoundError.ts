import {BaseError} from "./BaseError";

export class NotFoundError extends BaseError {
    constructor(errorString: string) {
        super(errorString, 103, NotFoundError.name);
    }
}