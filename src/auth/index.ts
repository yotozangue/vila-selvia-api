import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { IUserModel } from '../models/user.model';
import AuthService from './service';
const secret = `${process.env.SECRET}`;

export async function signup(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {
        const user = await AuthService.createUser(req.body);

        const token: string = jwt.sign(
            {
                id: user?.id
            },
            secret,
            {
                expiresIn: '60m',
            }
        );

        res.status(201).json({
            logged: true,
            token,
            message: 'Sign in successfull'
        });

    } catch (error) {
        res.status(400).json({
            logged: false,
            error: `${error}`
        });
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {

    try {

        const user: IUserModel = await AuthService.loginUser(req.body);

        const token: string = jwt.sign(
            {
                id: user?.id
            },
            secret,
            {
                expiresIn: '60m',
            }
        );

        res.status(200).json({
            status: 200,
            logged: true,
            token,
            message: 'Sign in successfull'
        });

    } catch (error) {
        res.status(400).json({
            logged: false,
            error: `${error}`
        });
    }

}

export async function verifyToken(req: Request, res: Response, next: NextFunction) {

    const email:any = req.headers['email'] || req.params.email;;

    const authorization: any = req.headers['authorization'] || req.params.authorization;

    if(!authorization || !email) return res.status(401).json({msg: 'acess denied'});

    try {
        jwt.verify(authorization, secret);

        const { id }: any = jwt.decode(authorization);

        if(await AuthService.compareUser(id, email)) {
            next();
        }

    } catch (error) {
        return res.status(401).json({
            msg: 'acess denied',
            error: `${error}`
        });
    }
}

export async function verifyAdmin(req: Request, res: Response, next: NextFunction) {

    const email:any = req.headers['email'] || req.params.email;

    try {
        await AuthService.isAdmin(email);
        verifyToken(req, res, next);

    } catch (error) {
        return res.status(401).json({
            msg: 'acess denied',
            error: `${error}`
        });
    }


}
