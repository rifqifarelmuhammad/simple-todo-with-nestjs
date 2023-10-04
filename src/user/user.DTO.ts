import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class UpdateProfileDTO {
  @IsOptional()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  isAvatarDeleted: string
}
