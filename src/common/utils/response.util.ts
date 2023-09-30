import { Injectable, Logger } from '@nestjs/common'
import { ResponseInterface } from './util.interface';
import { HttpStatus } from '@nestjs/common/enums'

@Injectable()
export class ResponseUtil {
    response(
        { responseCode, responseMessage, responseStatus }: ResponseInterface,
        data?: any
    ) {
        const responseBody = {
            responseCode: responseCode || HttpStatus.OK,
            responseMessage: responseMessage || 'Data retrieved successfully',
            responseStatus: responseStatus || 'SUCCESS',
            ...data,
        }

        Logger.log(responseBody, 'Response Body')

        return responseBody
    }
}