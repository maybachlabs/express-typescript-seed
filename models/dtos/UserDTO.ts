import {User} from "../entities/User";

export class UserDTO {

    public id: string;
    public firstName: string;
    public lastName: string;
    public email: string;
    public profilePicUrl: string;

    constructor(user: User) {
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.profilePicUrl = user.profilePicUrl;
    }
}