import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { FinalizeUser } from './util.interface'

@Injectable()
export class GetFinalizeUserUtil {
  getFinalizeUser(user: User) {
    const avatar = user.avatar
      ? user.avatar
      : process.env.CLOUDINARY_DEFAULT_AVATAR

    const finalizeUser: FinalizeUser = {
      name: user.name,
      avatar: avatar,
    }

    return finalizeUser
  }
}
