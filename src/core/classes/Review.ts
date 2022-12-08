import { prop } from "@typegoose/typegoose";

export class Review {

    @prop({ required: true })
    suite_id: string;

    @prop({ required: true })
    user_id: string;

    @prop({ required: true })
    stars: number;

    @prop()
    description: string;

}
