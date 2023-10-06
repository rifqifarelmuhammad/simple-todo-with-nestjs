import { User } from '@prisma/client'
import { Request } from 'express'

export interface AuthenticatedRequestInterface extends Request {
  user: User
}
