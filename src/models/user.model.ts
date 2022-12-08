import { getModelForClass } from "@typegoose/typegoose";
import { Document } from 'mongoose';
import { User } from '../core/classes/User';

const UserModel = getModelForClass(User);

export interface IUserModel extends Document {
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    admin: boolean
}


export default UserModel;
