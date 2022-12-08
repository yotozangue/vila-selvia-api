// App
import express from 'express';
import { createServer, Server } from 'http';

// routes
import indexRoutes from './routes/index.routes';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import userRoutes from './routes/user.routes';
import reservationRoutes from './routes/reservation.routes';
import mealRoutes from './routes/meal.routes';
import addonsRoutes from './routes/addons.routes';
import uploadRoutes from './routes/upload.routes';
import suiteRoutes from './routes/suite.routes';

// database
import connect from './database';
import { Advice, UseAspect } from '@arekushii/ts-aspect';
import { ExceptionActionAspect } from './core/aspects/exception-action.aspect';


// middleware
import cors from 'cors';
import fileupload from 'express-fileupload';

export class App {

    app: express.Application;
    server: Server;

    constructor() {
        this.app = express();
        this.server = createServer(this.app);
        this.database();
        this.middlewares();
        this.cors();
        this.routes();
    }

    public start(): void {
        const port = process.env.PORT;
        this.app.listen(port, () => {
            console.log(`Starting on port ${port}`);
        });
    }

    @UseAspect(Advice.TryCatch, ExceptionActionAspect)
    private async database(): Promise<void> {
        const db = await connect();
        this.app.locals.db = db;
    }

    public middlewares():void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({
            extended: false
        }));
        this.app.use(fileupload());
        this.app.use(express.static('public'));
    }

    public cors(): void {
        const options: cors.CorsOptions = {
            methods: '*',
            origin: '*'
        };
        this.app.use(cors(options));
    }

    public routes(): void {
        this.app.use('/', indexRoutes);
        this.app.use('/auth', authRoutes);
        this.app.use('/admin', adminRoutes);
        this.app.use('/user', userRoutes);
        this.app.use('/reservation', reservationRoutes);
        this.app.use('/meal', mealRoutes);
        this.app.use('/addons', addonsRoutes);
        this.app.use('/', uploadRoutes);
        this.app.use('/suite', suiteRoutes);
    }

}
