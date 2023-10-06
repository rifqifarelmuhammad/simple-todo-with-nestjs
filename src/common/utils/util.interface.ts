import { HttpStatus } from '@nestjs/common'

export interface ResponseInterface {
  responseCode?: HttpStatus
  responseMessage?: string
  responseStatus?: 'SUCCESS' | 'FAILED'
}

export interface FinalizeUser {
  name: string
  avatar: string
}
