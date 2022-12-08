import { getModelForClass } from "@typegoose/typegoose";
import { Suite } from '../core/classes/Suite'

const SuiteModel = getModelForClass(Suite);

export default SuiteModel;
