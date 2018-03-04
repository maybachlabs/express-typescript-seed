import {AllowNull, BeforeSave, Column, Table, Unique} from 'sequelize-typescript';
import {Utils} from "../../utils";
import {BaseModel} from "./BaseModel";

@Table
export class Client extends BaseModel<Client> {

    @AllowNull(false)
    @Unique
    @Column
    clientId: string;

    @AllowNull(false)
    @Column
    clientSecret: string;

    @BeforeSave
    static encryptPassword(instance: Client) {
        instance.clientSecret = Utils.encryptPassword(instance.clientSecret);
    }
}
