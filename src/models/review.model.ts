import { getModelForClass } from "@typegoose/typegoose";
import { Review } from '../core/classes/Review'

const ReviewModel = getModelForClass(Review);

export default ReviewModel;
