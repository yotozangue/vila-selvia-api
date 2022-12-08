import { getModelForClass } from "@typegoose/typegoose";
import { Reservation } from '../core/classes/Reservation'

const ReservationModel = getModelForClass(Reservation);

export default ReservationModel;
