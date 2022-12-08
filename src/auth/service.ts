import UserModel, { IUserModel } from '../models/user.model';
import { IAuthService } from './interface';

const AuthService: IAuthService = {

    async createUser(body: IUserModel): Promise <IUserModel> {

        const { firstname, lastname, email, password, admin } = body;

        if (password.length < 8) {
            throw new Error('Password is shorter, min (8)');
        }

        const user: IUserModel = new UserModel({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password,
            admin: admin
        });

        const query = await UserModel.findOne({
            email: email,
        })

        if (query) {
            throw new Error('This email already exists');
        }

        const saved: IUserModel = await user.save();
        return saved;
    },

    async loginUser(body: IUserModel): Promise <IUserModel> {

        const user = await UserModel.findOne({
            email: body.email,
        });
        const isMatched = user && await user.comparePassword(body.password);

        if (isMatched) {
            return user;
        }

        throw new Error('Invalid password or email');

    },

    async compareUser(id: string, email: string): Promise<boolean> {

        const user1 = await UserModel.findOne({
            email: email,
        });
        const user2 = await UserModel.findById(id);

        if(JSON.stringify(user1) === JSON.stringify(user2)) {
            return true;
        }

        throw new Error('Invalid token or email');

    },

    async isAdmin(email: string): Promise<boolean> {
        const { admin }: any = await UserModel.findOne({
            email: email,
        });

        if(!admin) {
            throw new Error('No permission.');
        }

        return admin;
    },

}

export default AuthService;
