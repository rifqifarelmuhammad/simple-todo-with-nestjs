import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { UpdateProfileDTO } from './user.DTO'
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary'
import { IMAGE_FILE_TYPE } from './user.constant'

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService
  ) {}

  async getProfile(user: User) {
    const { id } = user
    return await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        avatar: true,
        name: true,
        email: true,
      },
    })
  }

  async updateProfile(
    user: User,
    file: Express.Multer.File,
    { name, isAvatarDeleted }: UpdateProfileDTO
  ) {
    if (!file && !name && !isAvatarDeleted) {
      throw new BadRequestException('Avatar and Name cannot be empty')
    }

    let uploadedFile: UploadApiResponse | UploadApiErrorResponse
    if (file) {
      const splitedFileName = file.originalname.split('.')
      const fileType = splitedFileName[splitedFileName.length - 1]

      if (!IMAGE_FILE_TYPE.includes(fileType)) {
        throw new BadRequestException('Invalid file type')
      }

      uploadedFile = await this.cloudinary.uploadFile(file).catch(() => {
        throw new InternalServerErrorException('Failed to upload file')
      })
    }

    const { id, avatar } = user
    if ((isAvatarDeleted || file) && avatar) {
      const publicId = avatar.split('.')[0]
      await this.cloudinary.deleteFile(publicId)
    }

    return await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        ...(name ? { name: name } : {}),
        ...(isAvatarDeleted
          ? { avatar: null }
          : file
          ? { avatar: `${uploadedFile.public_id}.${uploadedFile.format}` }
          : {}),
      },
      select: {
        avatar: true,
        name: true,
      },
    })
  }
}
