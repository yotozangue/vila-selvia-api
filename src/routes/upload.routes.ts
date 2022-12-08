import { Router, Request, Response } from 'express';
import path from 'path';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { PhotoSuite, ErroUpload, ErroDownload } from '../core/classes/PhotoSuite';
import { verifyAdmin } from '../auth';
import SuiteModel from '../models/suite.model';

const router: Router = Router();

router.route('/uploads/:suite_id/:email/:authorization')
    .post(verifyAdmin, async (req: Request, res: Response) => {

        const { suite_id } = req.params;

        if(!req.files || Object.keys(req.files).length == 0) {
            return res.status(400).send('No file upload');
        }

        const filesNames = Object.keys(req.files);

        const directory = path.join(__dirname, '..', '..', 'files');
        if(!existsSync(directory)) {
            mkdirSync(directory);
        }

        const bd = req.app.locals.db;
        const fileCtrl = new PhotoSuite(bd);
        let idsArquivosSalvos: any = [];
        let quantidadeErrosGravacao = 0;
        let quantidadeErrosObjArquivoInvalido = 0;
        let quantidadeErroInesperado = 0;


        const isSuite = await fileCtrl.checkSuite(suite_id);
        if(!isSuite) return res.status(401).json({err: 'Fake suite'});

        const promises = filesNames.map(async (file) => {
            if(!req.files) return;
            const objFile = req.files[file];

            try {
                const idFile = await fileCtrl.uploadFile(objFile);
                idsArquivosSalvos.push(idFile);
            } catch (error) {
                console.error(error);
                switch (error) {
                    case ErroUpload.NAO_FOI_POSSIVEL_GRAVAR:
                        quantidadeErrosGravacao++;
                        break;
                    case ErroUpload.OBJETO_ARQUIVO_INVALIDO:
                        quantidadeErrosObjArquivoInvalido++;
                        break;
                    default:
                        quantidadeErroInesperado++;
                }

            }

        })

        await Promise.all(promises);

        try {
            const suite = await SuiteModel.findById(suite_id, { photos: 1 });

            if(!suite) throw new Error('a');

            const promise = suite.photos.map(photo => {
                idsArquivosSalvos.push(photo);
            })

            await Promise.all(promise);

        } catch (error) {
            console.error(error);
        }

        await fileCtrl.registrarFotosNaSuite(suite_id, idsArquivosSalvos);
        let quantidadeAruqivosSalvos = idsArquivosSalvos.length;

        res.json({
            quantidadeAruqivosSalvos,
            quantidadeErrosGravacao,
            quantidadeErroInesperado,
            quantidadeErrosObjArquivoInvalido
        })
    })

router.route('/download/:id')
    .get(async (req: Request, res: Response) => {
        const { id } = req.params;


        try {
            const bd = req.app.locals.db;
            const fileCtrl = new PhotoSuite(bd);
            const caminhoArquivo = await fileCtrl.downloadFile(id)
            return res.download(caminhoArquivo, () => {
                unlinkSync(caminhoArquivo)
            })
        } catch (erro) {
            switch (erro) {
                case ErroDownload.ID_INVALIDO:
                    return res.status(400).json({ mensagem: ErroDownload.ID_INVALIDO })
                case ErroDownload.NAO_FOI_POSSIVEL_GRAVAR:
                    return res.status(500).json({ mensagem: ErroDownload.NAO_FOI_POSSIVEL_GRAVAR })
                case ErroDownload.NENHUM_ARQUIVO_ENCONTRADO:
                    return res.status(404).json({ mensagem: ErroDownload.NENHUM_ARQUIVO_ENCONTRADO })
                default:
                    return res.status(500).json({ mensagem: 'Erro no servidor' })
            }
        }
    })

router.route('/delete/:suite_id/:image_id')
    .delete(verifyAdmin, async (req: Request, res: Response) => {
        const { suite_id, image_id } = req.params;
        console.log(suite_id);
        console.log(image_id);
        try {
            const bd = req.app.locals.db;
            const fileCtrl = new PhotoSuite(bd);
            const suite = await fileCtrl.deleteFoto(suite_id, image_id);
            res.status(200).json(suite);
        }
        catch(error) {
            res.status(400).json({error: error});
        }

    })

export default router;
