import { Injectable } from '@nestjs/common';
import { v2, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import * as toStream from 'buffer-to-stream'

@Injectable()
export class CloudinaryService {
    async uploadFile(file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            const upload = v2.uploader.upload_stream(
                {folder: `${process.env.CLOUDINARY_FOLDER}`},
                (error, result) => {
                if (error) return reject(error)

                resolve(result)
            })

            toStream(file.buffer).pipe(upload)
        })
    }

    async deleteFile(public_id: string) {
        await v2.uploader.destroy(
            public_id,
            (result, error) => {
                if (error) return error

                return result
            }
        )
    }
}
