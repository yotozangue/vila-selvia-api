import { Router, Request, Response, NextFunction } from 'express';
import { verifyToken } from '../auth/index';

import Actions from '../core/services/User.actions';

const router: Router = Router();

router.route('/panel')
    .get((req: Request, res: Response, next: NextFunction) => {
        res.render('views/panel');
    })

router.route('/')
    .get(verifyToken, async (req: Request, res: Response) => {
        const email = `${req.headers['email']}`;
        const user = await Actions.getUser(email);
        res.status(200).json(user);
    })
    .patch(verifyToken, async (req: Request, res: Response) => {
        const user = await Actions.getUser(`${req.headers['email']}`);
        const { firstname, lastname, email, admin} = req.body;

        await Actions.updateUser(user, firstname, lastname, email, admin);
        res.status(200).json(user);
    })

router.route('/pass')
    .patch(verifyToken, async (req: Request, res: Response) => {
        const user = await Actions.getUser(`${req.headers['email']}`);
        const { newpass, oldpass } = req.body;

        await Actions.changePassUser(res, user.id, newpass, oldpass);
    });

export default router;
