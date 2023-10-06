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
  Query,
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

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllTodos(
    @GetCurrentUser() user: User,
    @Query('orderBy') orderBy: string,
    @Query('filter') filter: string
  ) {
    const responseData = await this.todoService.getAllTodos(
      user,
      orderBy,
      filter
    )

    return this.responseUtil.response({}, { todos: responseData })
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
