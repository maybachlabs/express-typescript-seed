export class BaseError implements Error {

    public message: string;
    public code: number;
    public name: string;

    constructor(errorString: string, code: number,  name: string) {
        this.message = errorString;
        this.code = code;
        this.name = name;
    }
}