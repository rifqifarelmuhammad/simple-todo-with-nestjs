import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Patch,
  Delete,
  Param,
} from '@nestjs/common'
import { TodoService } from './todo.service'
import { ResponseUtil } from 'src/common/utils/response.util'
import { GetCurrentUser } from 'src/common/decorators/getCurrentUser.decorator'
import { User } from '@prisma/client'
import { CreateTodoDTO, UpdateIsFinishedDTO } from './todo.DTO'

@Controller('todo')
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
    private readonly responseUtil: ResponseUtil
  ) {}

  @Get('desc')
  @HttpCode(HttpStatus.OK)
  async getAllTodoDesc(@GetCurrentUser() user: User) {
    const responseData = await this.todoService.getAllTodoDesc(user)

    return this.responseUtil.response({}, responseData)
  }

  @Get('asc')
  @HttpCode(HttpStatus.OK)
  async getAllTodoAsc(@GetCurrentUser() user: User) {
    const responseData = await this.todoService.getAllTodoAsc(user)

    return this.responseUtil.response({}, responseData)
  }

  @Get('is-finished')
  @HttpCode(HttpStatus.OK)
  async getAllTodoFinished(@GetCurrentUser() user: User) {
    const responseData = await this.todoService.getAllTodoFinished(user)

    return this.responseUtil.response({}, responseData)
  }

  @Get('not-finished')
  @HttpCode(HttpStatus.OK)
  async getAllTodoNotFinished(@GetCurrentUser() user: User) {
    const responseData = await this.todoService.getAllTodoNotFinished(user)

    return this.responseUtil.response({}, responseData)
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTodo(@GetCurrentUser() user: User, @Body() body: CreateTodoDTO) {
    const responseData = await this.todoService.createTodo(user, body)

    return this.responseUtil.response(
      {
        responseMessage: 'Todo has been created',
        responseCode: HttpStatus.CREATED,
      },
      responseData
    )
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  async updateIsFinished(
    @GetCurrentUser() user: User,
    @Body() body: UpdateIsFinishedDTO
  ) {
    const responseData = await this.todoService.updateIsFinished(user, body)

    return this.responseUtil.response(
      {
        responseMessage: 'Todo has been updated',
      },
      responseData
    )
  }

  @Delete(':todoId')
  @HttpCode(HttpStatus.OK)
  async deleteTodo(
    @GetCurrentUser() user: User,
    @Param('todoId') todoId: string
  ) {
    await this.todoService.deleteTodo(user, todoId)

    return this.responseUtil.response({
      responseMessage: 'Todo has been deleted',
    })
  }
}
