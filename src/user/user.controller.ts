import {
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
} from '@nestjs/common'
import { UserService } from './user.service'
import { ResponseUtil } from 'src/common/utils/response.util'
import { GetCurrentUser } from 'src/common/decorators/getCurrentUser.decorator'
import { User } from '@prisma/client'
import { UpdateProfileDTO } from './user.DTO'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly responseUtil: ResponseUtil
  ) {}

  @Patch('profile')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @GetCurrentUser() user: User,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 5000000 })],
      })
    )
    file: Express.Multer.File,
    @Body() body: UpdateProfileDTO
  ) {
    const responseData = await this.userService.updateProfile(user, file, body)

    return this.responseUtil.response(
      {
        responseMessage: 'Profile has been updated',
      },
      responseData
    )
  }
}
