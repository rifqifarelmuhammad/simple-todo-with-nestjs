import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class UpdateProfileDTO {
    @IsOptional()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsBoolean()
    isAvatarDeleted: boolean
}