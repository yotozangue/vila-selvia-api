import { modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({
    schemaOptions: {
        // Add createdAt and updatedAt fields
        timestamps: true,
    },
})

export class Meal {

    @prop()
    name: string;

    @prop()
    price: number;

}
