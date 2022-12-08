import { App } from "./app";
import UserModel from './models/user.model';

const port = process.env.PORT;

new App().start();

createAdminUser();

async function createAdminUser() {
    const users = await UserModel.find().lean();
    if(users.length == 0) {

        const user = {
            firstname: "Admin",
            lastname: "Admiro",
            email: "admin@admin.com",
            password: "12345678",
            admin: true
        }

        await UserModel.create(user);
        console.log('Admin Created!');
    }
}
