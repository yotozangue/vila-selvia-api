import { Response } from 'express';
import UserModel, { IUserModel } from '../../models/user.model';

export default class UserActions {

    public static async getUser(email: string): Promise <IUserModel> {

        const user = await UserModel.findOne({
            email: email,
        });

        if(!user) {
            throw new Error('Internal Error.');
        }

        return user;
    }

    public static async updateUser(user: IUserModel, firstname: string, lastname: string, email: string, admin: boolean): Promise<IUserModel> {


        const patchUser = await UserModel.findByIdAndUpdate(user.id, {firstname, lastname, email});

        if(patchUser) {
            if (patchUser.admin) {
                await UserModel.findByIdAndUpdate(user.id, {admin});
            }

            /* if(password) {
                console.log(`Mudando a senha!`);
                patchUser?.changePass(password);
                patchUser?.save();
            } */


            return patchUser;
        }
        throw new Error('Internal Error');

    }

    public static async changePassUser(res: Response, id: string, newPass: string, oldPass: string): Promise<void> {

        const user = await UserModel.findById(id);

        if(await user?.comparePassword(oldPass)) {
            try {
                await user?.changePass(newPass);
                await user?.save();

                res.status(200).json({
                    'msg': 'Password changed successfully.'
                });

            } catch (error) {
                res.status(400).json({
                    'Error': `${error}`
                });
            }

        } else {
            res.status(401).json({
                'Error': 'Invalid Password.'
            });
        }
    }

}
