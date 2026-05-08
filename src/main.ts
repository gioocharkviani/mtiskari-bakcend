import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";
import { ValidationPipe, VersioningType } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");

  //application version control
  app.enableVersioning({
    prefix: "v",
    defaultVersion: "1",
    type: VersioningType.URI,
  });

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  console.log(`aplication v1 is running , running time ${new Date()}`);
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
