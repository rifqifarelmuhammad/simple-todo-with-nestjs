import { IsString, IsNotEmpty, IsOptional, MaxLength, IsBoolean } from 'class-validator'

export class CreateTodoDTO {
    @IsNotEmpty()
    @IsString()
    title: string

    @IsOptional()
    @IsString()
    @MaxLength(50)
    description: string
}

export class UpdateIsFinishedDTO {
    @IsNotEmpty()
    @IsString()
    todoId: string
}