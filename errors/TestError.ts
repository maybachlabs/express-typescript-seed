import {BaseError} from "./BaseError";

export class TestError extends BaseError {
    constructor(errorString: string) {
        super(errorString, 107, TestError.name);
    }
}