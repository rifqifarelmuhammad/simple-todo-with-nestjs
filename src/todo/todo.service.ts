import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common'
import { Prisma, Todo, User } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateTodoDTO, UpdateIsFinishedDTO } from './todo.DTO'
import { TYPE_FILTER, TYPE_ORDER } from './todo.constant'

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllTodos(user: User, orderBy: string, filter: string) {
    if (
      (orderBy && !TYPE_ORDER.includes(orderBy)) ||
      (filter && !TYPE_FILTER.includes(filter))
    ) {
      throw new BadRequestException('Invalid query')
    }

    const { id } = user
    const typeOrder: Prisma.SortOrder =
      orderBy === TYPE_ORDER[1] ? 'asc' : 'desc'
    const typeFilter = filter === TYPE_FILTER[0]
    const todos = await this.prisma.todo.findMany({
      where: {
        userId: id,
        ...(filter ? { isFinished: typeFilter } : {}),
      },
      select: {
        id: true,
        title: true,
        description: true,
        isFinished: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: typeOrder,
      },
    })

    return { todos: todos }
  }

  async createTodo(user: User, { title, description }: CreateTodoDTO) {
    const { id } = user

    const todo = await this.prisma.todo.create({
      data: {
        title: title,
        description: description,
        userId: id,
      },
    })

    return this.finalizeTodo(todo)
  }

  async updateIsFinished(user: User, { todoId }: UpdateIsFinishedDTO) {
    const { id } = user

    const todo = await this.prisma.todo.findUnique({
      where: {
        id: todoId,
      },
    })

    if (!todo) {
      throw new BadRequestException('Todo not found')
    }

    if (todo.userId !== id) {
      throw new UnauthorizedException('Invalid Todo')
    }

    const updatedTodo = await this.prisma.todo.update({
      where: {
        id: todoId,
      },
      data: {
        isFinished: !todo.isFinished,
      },
    })

    return this.finalizeTodo(updatedTodo)
  }

  async deleteTodo(user: User, todoId: string) {
    const { id } = user

    const todo = await this.prisma.todo.findUnique({
      where: {
        id: todoId,
      },
    })

    if (todo.userId !== id) {
      throw new UnauthorizedException('Invalid Todo')
    }

    await this.prisma.todo.delete({
      where: {
        id: todoId,
      },
    })

    await this.prisma.trash.create({
      data: {
        key: 'TODO',
        content: todo,
      },
    })
  }

  private finalizeTodo(todo: Todo) {
    const keys: string[] = ['userId', 'createdAt']
    return Object.fromEntries(
      Object.entries(todo).filter(([key]) => !keys.includes(key))
    )
  }
}
