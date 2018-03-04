import {BaseError} from "./BaseError";

export class MessageError extends BaseError {
    constructor(errorString: string) {
        super(errorString, 106, MessageError.name);
    }
}