import { Router, Request, Response } from 'express';
import { verifyAdmin } from '../../src/auth';
import SuiteModel from '../models/suite.model';

const router: Router = Router();

router.route('/')
    .get(async (req: Request, res: Response) => {
        const suites = await SuiteModel.find().lean();
        res.status(200).json(suites);
    })
    .post(async (req: Request, res: Response) => {
        const {
            name,
            description,
            price,
            beds,
            rooms,
            bathrooms,
            minimal_nights,
            maximum_nights,
            maximum_people,
            size,
            address,
            detailed_description
        } = req.body;

        try {
          const suite = await SuiteModel.create({ name, description, price, beds, rooms, bathrooms, minimal_nights, maximum_nights, maximum_people, size, address, detailed_description});
          res.status(200).json(suite);
        } catch (error) {
          res.status(400).json({ error: error })
        }
    })
router.route('/:suite_id')
    .get(async (req: Request, res: Response) => {
        const { suite_id } = req.params;
        try {
            const suite = await SuiteModel.findById(suite_id).lean();
            res.status(200).json(suite);
        } catch (error) {
            res.status(400).json({error: 'Suite not found'});
        }
    })
    .patch(verifyAdmin, async (req: Request, res: Response) => {

        const { suite_id } = req.params;

        const {
            name,
            description,
            price,
            beds,
            rooms,
            bathrooms,
            minimal_nights,
            maximum_nights,
            maximum_people,
            size,
            address,
            detailed_description,
            avaliations
        } = req.body;

        try {
            const suite = await SuiteModel.findByIdAndUpdate(suite_id, { name, description, price, beds, rooms, bathrooms, minimal_nights, maximum_nights, maximum_people, size, address, detailed_description, avaliations});
            res.status(200).json(suite);
        } catch (error) {
            res.status(400).json({error: error});
        }

    })
    .delete(verifyAdmin, async (req: Request, res: Response) => {

        const { suite_id } = req.params;
        try {
            await SuiteModel.findByIdAndDelete(suite_id);
            res.status(200).json({msg: 'Ok'});
        } catch (error) {
            res.status(400).json({error: error});
        }

    })


export default router;
