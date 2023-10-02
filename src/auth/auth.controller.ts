import { Body, Controller, HttpCode, HttpStatus, Patch, Post, Get } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ResponseUtil } from 'src/common/utils/response.util'
import { LoginDTO, LogoutDTO, RegistrationDTO } from './auth.DTO'
import { IsPublic } from 'src/common/decorators/isPublic.decorator'
import { GetCurrentUser } from 'src/common/decorators/getCurrentUser.decorator'
import { User } from '@prisma/client'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly responseUtil: ResponseUtil
  ) {}
  
  @IsPublic()
  @Post('registration')
  @HttpCode(HttpStatus.CREATED)
  async registration(@Body() body: RegistrationDTO) {
    const responseData = await this.authService.registration(body)

    return this.responseUtil.response({
      responseMessage: 'User successfully registered',
      responseCode: HttpStatus.CREATED,
    },
    responseData
    )
  }

  @IsPublic()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDTO) {
    const responseData = await this.authService.login(body)

    return this.responseUtil.response({
      responseMessage: 'Login Successful'
    },
    responseData
    )
  }

  @Patch('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() body: LogoutDTO) {
    await this.authService.logout(body)

    return this.responseUtil.response({
      responseMessage: 'Logout Successful'
    })
  }

  @Get('user')
  @HttpCode(HttpStatus.OK)
  async getUser(@GetCurrentUser() user: User) {
    const responseData = this.authService.getFinalizeUser(user)
    
    return this.responseUtil.response({}, {'user': responseData})
  }
}
