import { BadRequestException, ConflictException, UnauthorizedException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma/prisma.service'
import { LoginDTO, LogoutDTO, RegistrationDTO } from './auth.DTO'
import { hash, compare } from 'bcrypt'
import { User } from '@prisma/client'
import { TIME_UNIT } from './auth.constant'

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private readonly prisma: PrismaService,
    ) {}

    async registration({
        name,
        email,
        password,
        confirmationPassword
    }: RegistrationDTO) {
        if (password !== confirmationPassword) {
            throw new BadRequestException('Password does not match confirmation password')
        }

        const lowerCasedEmail = email.toLowerCase()

        const disposableEmails: string[] = process.env.DISPOSABLE_EMAILS.split(',')

        const emailDomain = lowerCasedEmail.split('@')[1]

        if (!disposableEmails.includes(emailDomain)) {
            throw new BadRequestException('Invalid email address')
        }

        const isUserExists = await this.prisma.user.findUnique({
            where: {
              email: lowerCasedEmail,
            },
        })

        if (isUserExists) {
            throw new ConflictException('User already exists')
        }

        const hashedPassword = await hash (
            password,
            parseInt(process.env.APP_SALT_ROUNDS)
        )
        
        const user = await this.prisma.user.create({
            data: {
                name: name,
                email: lowerCasedEmail,
                password: hashedPassword
            }
        })

        const accessToken = await this.generateToken(user.id)

        return {
            'accessToken': accessToken
        }
    }

    async login({
        email,
        password,
        token
    }: LoginDTO) {
        const user = await this.prisma.user.findUnique({
            where: {
              email,
            },
        })
      
        if (!user) {
            throw new UnauthorizedException('Invalid Email or Password')
        }

        const isPasswordValid = await compare(password, user.password)

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid Email or Password')
        }

        const { id } = user

        if (token) {
            await this.blacklistToken(token)
        }

        const accessToken = await this.generateToken(id)

        await this.prisma.user.update({
            where: {
                id: id
            },
            data: {
                lastLogin: new Date()
            }
        })

        return {
            'accessToken': accessToken
        }
    }

    async logout({ token }: LogoutDTO) {
        await this.blacklistToken(token)
    }

    private async generateToken(key: string) {
        const accessToken = await this.jwtService.signAsync(
            { key },
            {
                secret: process.env.APP_ACCESS_SECRET,
                expiresIn: process.env.APP_ACCESS_EXPIRY
            }
        )

        await this.prisma.token.create({
            data: {
                accessToken: accessToken,
                expiredAt: new Date(
                    Date.now() + this.getExpiry(process.env.APP_ACCESS_EXPIRY)
                ),
                userId: key
            }
        })

        return accessToken
    }

    private async blacklistToken(tokenId: string) {
        await this.prisma.token.update({
            where: {
                accessToken: tokenId
            },
            data: {
                blacklistStatus: 'BLACKLISTED',
                blacklistedAt: new Date()
            }
        })
    }

    private getExpiry(expiry: string) {
        const duration = parseInt(expiry.substring(0, expiry.length - 1))
        const unit = expiry[expiry.length - 1]
        return duration * TIME_UNIT[unit]
    }
}
