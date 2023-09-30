import { IsString, IsNotEmpty, IsEmail, MinLength, IsOptional } from 'class-validator'

export class RegistrationDTO {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string

    @IsNotEmpty()
    @IsString()
    confirmationPassword: string
}

export class LoginDTO {
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    password: string

    @IsOptional()
    @IsString()
    token: string
}

export class LogoutDTO {
    @IsNotEmpty()
    @IsString()
    token: string
}