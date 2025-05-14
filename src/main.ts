import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseUtil } from './common/utils/response.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
 app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  });

  const responseUtil = app.get(ResponseUtil);

  app.useGlobalFilters(new HttpExceptionFilter(responseUtil));

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
