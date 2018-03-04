import {AllowNull, BeforeSave, Column, DataType, HasOne, IsEmail, Table, Unique} from 'sequelize-typescript';
import {AccessToken} from "./AccessToken";
import {BaseModel} from "./BaseModel";
import {RoleEnum} from "../enums/RoleEnum";
import {Utils} from "../../utils";

@Table
export class User extends BaseModel<User> {

    @AllowNull(false)
    @Column
    firstName: string;

    @AllowNull(false)
    @Column
    lastName: string;

    @AllowNull(false)
    @IsEmail
    @Unique
    @Column
    email: string;

    @AllowNull(false)
    @Column
    password: string;

    @Column(DataType.ENUM(RoleEnum.ADMIN, RoleEnum.MEMBER))
    role: RoleEnum;

    @HasOne(() => AccessToken)
    accessToken: AccessToken;

    @Column
    profilePicUrl: string;

    @BeforeSave
    static encryptPassword(instance: User) {
        instance.password = Utils.encryptPassword(instance.password);
    }
}
