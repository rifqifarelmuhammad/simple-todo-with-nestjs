import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthenticatedRequestInterface } from './auth.interface'
import { Reflector } from '@nestjs/core'
import { PrismaService } from 'src/prisma/prisma.service'
import { isPast } from 'date-fns'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService
  ) {}

  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest<AuthenticatedRequestInterface>()

    const rawToken = req.headers.authorization.split(' ')[1]
    if (rawToken) {
      req.body.token = rawToken
    }

    Logger.log(req.body, `Req ${req.method} ${req.url} from ${req.ips}`)

    if (this.getPublicStatus(ctx)) return true

    if (req.headers.authorization) {
      const accessToken = await this.prisma.token.findUnique({
        where: {
          accessToken: rawToken,
        },
      })

      if (!accessToken) {
        throw new UnauthorizedException(`Invalid Token`)
      }

      const { blacklistStatus, expiredAt } = accessToken
      if (blacklistStatus === 'BLACKLISTED') {
        throw new UnauthorizedException('Token blacklisted')
      }

      if (isPast(new Date(expiredAt))) {
        throw new UnauthorizedException('Token expired')
      }

      const { key: userId } = await this.jwtService.verifyAsync(rawToken, {
        secret: process.env.APP_ACCESS_SECRET,
        ignoreExpiration: true,
      })

      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      })

      req.user = user
      return true
    }

    return false
  }

  private getPublicStatus(ctx: ExecutionContext) {
    return this.reflector.getAllAndOverride<boolean>('isPublic', [
      ctx.getHandler(),
      ctx.getClass(),
    ])
  }
}
