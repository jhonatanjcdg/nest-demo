import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TodosModule } from './todos/todos.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import {TypeOrmModule} from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { User } from './users/users.entity';
// import { Todo } from './todos/todos.entity';
import typeOrmConfig from './config/typeorm'
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: './.env.development'
      load: [typeOrmConfig]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      // useFactory: (configService: ConfigService) => ({
      //   type: 'postgres',
      //   database: configService.get('DB_NAME'),
      //   host: configService.get('DB_HOST'),
      //   port: configService.get('DB_PORT'),
      //   username: configService.get('DB_USERNAME'),
      //   password: configService.get('DB_PASSWORD'),
      //   entities: [User, Todo],
      //   synchronize: true,
      //   logging: true,
      // }),
      useFactory: (ConfigService: ConfigService) => ConfigService.get('typeorm')
    }),
    UsersModule,
    TodosModule,
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1h'},
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard
    // }
  ],
})
export class AppModule {}
