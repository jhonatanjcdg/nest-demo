import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './middlewares/logger.middleware';
import { AuthGuard } from './guards/auth.guard';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { error } from 'console';
import { auth } from 'express-openid-connect';
import { config as auth0Config} from './config/auth0.config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Así se usa el guard de Auth de manera global -- para todos los controladores
  // app.useGlobalGuards(new AuthGuard())
  app.use(auth(auth0Config))
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    exceptionFactory: (errors) => {
      const cleanErrors = errors.map(error => { return { property: error.property, constraints: error.constraints } })
      return new BadRequestException({
        alert: 'Se han detectado los siguientes errores en la petición y te mandamos este mensaje personalizado',
        errors: cleanErrors
      })
    }
  }))
  app.use(loggerGlobal)

  const swaggerConfig = new DocumentBuilder()
                            .setTitle('Demo Nest')
                            .setDescription(`
                              Esta es una API construida con Nest para ser empleada en las demos del módulo 4 de la especialidad Backend Fullstack Developer de Henry
                              `)
                            .setVersion('1.0')
                            .addBearerAuth()
                            .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api', app, document)

  await app.listen(3000);
}
bootstrap();
