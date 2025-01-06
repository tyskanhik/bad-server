import { NextFunction, Request, Response } from 'express'
import { constants } from 'http2'
import fs from 'node:fs/promises'
import { validateMimeType } from '../utils/validateMimeType';
import { allowedTypes } from '../middlewares/file';
import BadRequestError from '../errors/bad-request-error'

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file) {
        return next(new BadRequestError('Файл не загружен'));
    }

    if (req.file.size < 2048) {
        await fs.unlink(req.file.path)
        return next(new BadRequestError('Размер файла слишком мал'))
    }
    
    const mimeType = await validateMimeType(req.file.path);
    if (!mimeType || !allowedTypes.includes(mimeType)) {
        await fs.unlink(req.file.path);
        return next(new BadRequestError('Неверный формат файла'));
    }

    try {
        const fileName = process.env.UPLOAD_PATH
            ? `/${process.env.UPLOAD_PATH}/${req.file.filename}`
            : `/${req.file.filename}`;

        return res.status(constants.HTTP_STATUS_CREATED).send({
            fileName,
            originalName: req.file?.originalname,
        });
    } catch (error) {
        return next(error);
    }
};

export default {}

