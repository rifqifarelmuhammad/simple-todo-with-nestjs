import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common'
import { Todo, User } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateTodoDTO, UpdateIsFinishedDTO } from './todo.DTO'

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllTodoDesc(user: User) {
    const { id } = user
    const todos = await this.prisma.todo.findMany({
      where: {
        userId: id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        isFinished: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return { todos: todos }
  }

  async getAllTodoAsc(user: User) {
    const { id } = user
    const todos = await this.prisma.todo.findMany({
      where: {
        userId: id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        isFinished: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'asc',
      },
    })

    return { todos: todos }
  }

  async getAllTodoFinished(user: User) {
    const { id } = user
    const todos = await this.prisma.todo.findMany({
      where: {
        userId: id,
        isFinished: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        isFinished: true,
        updatedAt: true,
      },
    })

    return { todos: todos }
  }

  async getAllTodoNotFinished(user: User) {
    const { id } = user
    const todos = await this.prisma.todo.findMany({
      where: {
        userId: id,
        isFinished: false,
      },
      select: {
        id: true,
        title: true,
        description: true,
        isFinished: true,
        updatedAt: true,
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
