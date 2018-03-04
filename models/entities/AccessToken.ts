import {BelongsTo, Column, DataType, ForeignKey, Table} from 'sequelize-typescript';
import {BaseModel} from "./BaseModel";
import {User} from "./User";

@Table
export class AccessToken extends BaseModel<AccessToken> {

    @Column(DataType.TEXT)
    token: string;

    @BelongsTo(() => User)
    user: User;

    @ForeignKey(() => User)
    @Column(DataType.UUID)
    userId: string;

    @Column
    clientId: string;
}
