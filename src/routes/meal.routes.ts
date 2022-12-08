import { Router, Request, Response } from 'express';
import MealModel from '../models/meal.model';

import { verifyToken } from '../auth/index';
import { verifyAdmin } from '../auth/index';

const router: Router = Router();

router.route('/')
    .get(async(req: Request, res: Response) => {
        const addons = await MealModel.find().lean();
        res.status(200).json(addons);
    })
    .post(verifyAdmin, async(req: Request, res: Response) => {
        const { name, price } = req.body;

        try {
            const addons = await MealModel.create({ name, price });
            res.status(200).json(addons);
        } catch (error) {
            console.error(error);
            res.status(401).json({
                msg: 'acess denied',
                error: `Internal Server Error`
            });
        }
    });

router.route('/:id')
    .get(verifyToken, async(req: Request, res: Response) => {

        const { id } = req.params;

        try {
            const addons = await MealModel.findById(id);
            res.status(200).json(addons);
        } catch (error) {
            console.error(error);
            res.status(401).json({
                error: `Internal Server Error`
            });
        }

    })
    .patch(verifyAdmin, async(req: Request, res: Response) => {

        const { id } = req.params;
        const { name, price } = req.body;

        try {
            const addons = await MealModel.findByIdAndUpdate(id, { name, price});
            res.status(200).json(addons);
        } catch (error) {
            console.error(error);
            res.status(401).json({
                error: `Internal Server Error`
            });
        }

    })
    .delete(verifyAdmin, async(req: Request, res: Response) => {
        const { id } = req.params;

        try {
            await MealModel.findByIdAndDelete(id);
            res.status(200).json({ msg: 'OK.'});
        } catch (error) {
            console.error(error);
            res.status(401).json({
                error: `Internal Server Error`
            });
        }
    });


export default router;
