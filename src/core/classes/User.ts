import { prop, pre, modelOptions, index } from "@typegoose/typegoose";
import bcrypt from 'bcryptjs';

@index({ email: 1 })
@pre<User>('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
})

@modelOptions({
    schemaOptions: {
        // Add createdAt and updatedAt fields
        timestamps: true,
    },
})

export class User {
    @prop({ required: true })
    firstname: string;

    @prop({ required: true })
    lastname: string;

    @prop({ unique: true, required: true, trim: true, lowercase: true })
    email: string;

    @prop({ required: true, minlength: 8, maxlength: 60 })
    password: string;

    @prop()
    admin: boolean;


    public async comparePassword(candidatePass: string): Promise<boolean> {
        const match = await bcrypt.compare(candidatePass, this.password);
        return match;
    }

    public async changePass(pass: string): Promise<void> {
        const change = await bcrypt.compare(pass, this.password);

        if(!change) {
            this.password = pass;
        } else {
            throw new Error('The password cannot be the same as the previous one.')
        }
    }

}

