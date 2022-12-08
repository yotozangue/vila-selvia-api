
import SuiteModel from '../../models/suite.model';
import ReservationModel from '../../models/reservation.model';
import MealModel from '../../models/meal.model';
import AddonsModel from '../../models/addons.model';
import UserModel, { IUserModel } from '../../models/user.model';

const ReservationService = {

    async getReservations(suite_id: string) {
        const reservations = await ReservationModel.find({suite_id}).lean();
        return reservations;
    },

    async newReservation(suite_id: string, user_id: string, number_people: number, price: number, start_date: Date, end_date: Date) {

        const reservation = await ReservationModel.create({suite_id, user_id, number_people, price, start_date, end_date});

        return reservation;
    },

    async getAll() {
        const reservations = await ReservationModel.find().lean();
        return reservations;
    },

    async verifyAvailableDay(start_date: Date, end_date: Date, suite_id: string) {

        if (new Date() > start_date) throw new Error('Dia não disponível.');

        const last_date = await
        ReservationModel.find(
                {
                    suite_id
                },
                {
                    end_date: 1,
                    status: 1
                }
            )

        last_date.forEach(reservation => {
            if (end_date < start_date) throw new Error(`Dia inválido.`)
            if (reservation.end_date > start_date && reservation.status < 3) throw new Error(`Dia não disponível.`);
        });
    },

    async verifyPeopleSuite(suite_id: string, number_people: number) {
        const suite = await
        SuiteModel.findById(
            suite_id,
            {
                maximum_people: 1
            }
        )
        .catch(() => { throw new Error('No suite') });

        if(!suite) throw new Error('No suite');

        if (number_people > suite.maximum_people) throw new Error('Max People');

    },

    async getReservationPrice(suite_id: string, number_people: number, meal: string, addons: string[], start_date: Date, end_date: Date) {

        let total = 0;

        // Set total days
        const time = end_date.getTime() - start_date.getTime();
        const days =  time / (1000 * 60 * 60 * 24);

        // First Query To get Price
        const suite_query = await SuiteModel.findById(suite_id, {price: 1});
        if(!suite_query) throw new Error('Suite Not Found');
        const suite_price = suite_query?.price;

        const meal_query = await MealModel.findById(meal);
        let meal_price = 0;

        if(!meal_query) {
            console.log('No Meal');
        } else {
            meal_price = meal_query?.price;
        }


        for (let i = 0; i < addons.length; i++) {
            const element = addons[i];
            const addons_query = await AddonsModel.findById(element, {price: 1});

            if(!addons_query) {
                console.log('No Addon');
            } else {
                total += addons_query?.price * number_people;
            }

        }

        total += suite_price * days;
        total += meal_price * number_people * days;
        return total;
    },

    async verifyUser(user_id: string) {
        const user = await UserModel.findById(user_id);
        if(!user) throw new Error('No User :/');
    },

    async verifyUserEquals(user: IUserModel, reservation_id: string) {
        const reservation = await ReservationModel.findById(reservation_id, { user_id: 1});

        if(reservation?.user_id != user.id) throw new Error('Not Autorizado');
    }

}

export default ReservationService;
