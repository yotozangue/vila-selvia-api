import { getModelForClass } from "@typegoose/typegoose";
import { Meal } from '../core/classes/Meal'

const MealModel = getModelForClass(Meal);

export default MealModel;
