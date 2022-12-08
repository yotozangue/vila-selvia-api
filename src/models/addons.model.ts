import { getModelForClass } from "@typegoose/typegoose";
import { Addons } from '../core/classes/Addons'

const AddonsModel = getModelForClass(Addons);

export default AddonsModel;
