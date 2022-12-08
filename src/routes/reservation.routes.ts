import { Router, Request, Response, NextFunction } from 'express';
import ReservationModel from '../models/reservation.model';
import { verifyToken } from '../auth/index';
import Actions from '../core/services/User.actions';

import ReservationService from '../core/services/reservation.service'

const router: Router = Router();

router.route('/:suite_id')
    .get(async(req: Request, res: Response) => {
        const { suite_id } = req.params;
        const reservations = await ReservationService.getReservations(suite_id);
        res.status(200).json(reservations);
    })
    .post(async(req: Request, res: Response) => {
        const { suite_id } = req.params;

        const { user_id, meal, addons, number_people, start_date, end_date } = req.body;

        try {
            await ReservationService.verifyUser(user_id);
            await ReservationService.verifyAvailableDay(new Date(start_date), new Date(end_date), suite_id);
            await ReservationService.verifyPeopleSuite(suite_id, number_people);
            const price = await ReservationService.getReservationPrice(suite_id, number_people, meal, addons, new Date(start_date), new Date(end_date));

            const reservation = await ReservationService.newReservation(suite_id, user_id, number_people, price, start_date, end_date);
            res.status(200).json(reservation);
        }
        catch(error) {
            console.log(error);
            res.status(403).json({error: `${error}`});
        }

    })
    .delete(async(req: Request, res: Response) => {
        const { suite_id } = req.params;
        try {
            await ReservationModel.findByIdAndDelete(suite_id);
            res.status(200).json({ msg: 'OK.'});
        } catch (error) {
            console.error(error);
            res.status(401).json({
                error: `Internal Server Error`
            });
        }
    });

router.route('/')
    .get(async(req: Request, res: Response) => {
        res.status(200).json(await ReservationService.getAll());
    })

router.route('/:reservation_id/change/:new_status')
    .get(verifyToken, async(req: Request, res: Response) => {

        const { reservation_id, new_status } = req.params;
        const user = await Actions.getUser(`${req.headers['email']}`);

        try {
            await ReservationService.verifyUserEquals(user, reservation_id);
            const reservation = await ReservationModel.findByIdAndUpdate(reservation_id, { status: new_status });
            res.status(200).json(reservation);
        } catch (error) {
            res.status(401).json({
                error: error
            });
        }
    })

router.route('/user/teste')
    .get(verifyToken, async(req: Request, res: Response) => {
        const user = await Actions.getUser(`${req.headers['email']}`);
        try {
            const reservations = await ReservationModel.find({ user_id: user._id })
            res.status(200).json(reservations);
        } catch(error) {

        }

    })

export default router;
