import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const whitelist: string[] = process.env.APP_WHITELIST.split(',')

  const corsOptions = {
    credentials: true,
    origin: whitelist,
    methods: '*',
  }

  const app = await NestFactory.create(AppModule)
  app.enableCors(corsOptions)
  app.useGlobalPipes(new ValidationPipe())

  await app.listen(process.env.APP_PORT)
}
bootstrap()
