import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { CommonModule } from './common/common.module'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from './auth/auth.guard'
import { JwtModule } from '@nestjs/jwt'
import { TodoModule } from './todo/todo.module'
import { UserModule } from './user/user.module'
import { CloudinaryProvider } from './cloudinary/cloudinary.provider'
import { CloudinaryModule } from './cloudinary/cloudinary.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({}),
    PrismaModule,
    AuthModule,
    CommonModule,
    TodoModule,
    UserModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CloudinaryProvider,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
