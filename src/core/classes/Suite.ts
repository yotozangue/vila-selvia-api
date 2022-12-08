import { prop } from "@typegoose/typegoose";


export class Suite {

    @prop({ required: true })
    name: string;

    @prop({ required: true })
    description: string;

    @prop({ required: true })
    price: number;

    @prop({ required: true })
    beds: number;

    @prop({ required: true })
    rooms: number;

    @prop({ required: true })
    bathrooms: number;

    @prop({ default: 1 })
    minimal_nights: number;

    @prop({ required: true })
    maximum_nights: number;

    @prop({ required: true })
    maximum_people: number;

    @prop({ required: true })
    size: number;

    @prop({ required: true })
    address: {
        address: string,
        number: number,
        state: string,
        city: string,
        cep: string
    }

    @prop()
    avaliations: {
        type: string,
        quantity: number,
        rating: number
    }

    @prop()
    detailed_description: string;

    @prop()
    photos: string[];
}
