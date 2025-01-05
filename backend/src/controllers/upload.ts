import { NextFunction, Request, Response } from 'express'
import { constants } from 'http2'
import path from 'path';
import BadRequestError from '../errors/bad-request-error'


const sanitizeFileName = (fileName: string) => {
    const baseName = path.basename(fileName);
    return baseName.replace(/[<>:"/\\|?*]/g, '');
};

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file) {
        return next(new BadRequestError('Файл не загружен'));
    }
    try {
        const sanitizedFileName = sanitizeFileName(req.file.filename);
        
        const fileName = process.env.UPLOAD_PATH
            ? `/${process.env.UPLOAD_PATH}/${sanitizedFileName}`
            : `/${sanitizedFileName}`;

        return res.status(constants.HTTP_STATUS_CREATED).send({
            fileName,
            originalName: sanitizedFileName,
        });
    } catch (error) {
        return next(error);
    }
};

export default {}
