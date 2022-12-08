import { Router, Request, Response, NextFunction } from 'express';
import { signup, login } from '../auth/index';

const router: Router = Router();

router.route('/login')
    .get((req: Request, res: Response) => {
        res.render('views/login');
    })
    .post((req: Request, res: Response, next: NextFunction) => {
        login(req, res, next);
    });

router.route('/signup')
    .get((req: Request, res: Response) => {
        res.render('views/signup');
    })
    .post((req: Request, res: Response, next: NextFunction) => {
        signup(req, res, next);
    });


export default router;
