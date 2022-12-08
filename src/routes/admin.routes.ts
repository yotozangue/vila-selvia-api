import { Router, Request, Response, NextFunction } from 'express';
import UserModel from '../models/user.model';

import { verifyAdmin } from '../auth/index';

const router: Router = Router();

router.route('/')
    .get(async(req: Request, res: Response, next: NextFunction) => {
        res.render('admin/')
    })

router.route('/users')
    .get(verifyAdmin, async(req: Request, res:Response) => {
        const users = await UserModel.find({}, {password: 0}).lean();
        res.status(200).json(users);
    })

router.route('/user/:id')
    .get(verifyAdmin, async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const user = await UserModel.findById(id, {password: 0});
            res.status(200).json(user);

        } catch (error) {
            console.error(error);
            res.status(400).json({error: 'Internal Server Error'});
        }

    })

    .patch(verifyAdmin, async (req: Request, res: Response) => {
        const { id } = req.params;
        const { admin } = req.body;

        try {
            await UserModel.findByIdAndUpdate(id, { admin });
            res.status(200).json({msg: 'ok'});
        } catch (error) {
            console.error(error);
            res.status(400).json({error: 'Internal Server Error'});
        }

    })

    .delete(verifyAdmin, async (req: Request, res: Response) => {

        const { id } = req.params;

        try {
            await UserModel.findByIdAndDelete(id);
            res.status(200).json({msg: 'ok'});
        } catch (error) {
            console.error(error);
            res.status(400).json({error: 'Internal Server Error'});
        }
    })

export default router;
