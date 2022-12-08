import { index, pre, prop } from "@typegoose/typegoose";

@index({ suite_id: 1, user_id: 1 })

export class Reservation {

    @prop({ required: true })
    suite_id: string;

    @prop({ required: true })
    user_id: string;

    @prop({ required: true })
    number_people: number;

    @prop({ required: true })
    price: number;

    @prop({ required: true, default: 0 })
    status: number;

    @prop({ required: true })
    start_date: Date;

    @prop({ required: true })
    end_date: Date;

}
