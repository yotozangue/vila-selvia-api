import { IUserModel } from "../models/user.model";

export interface IAuthService {
    createUser(userModel: IUserModel): Promise <IUserModel>;
    loginUser(userModel: IUserModel): Promise <IUserModel>;
    compareUser(id: string, email: string): Promise<boolean>;
    isAdmin(email: string): Promise<boolean>;
}
