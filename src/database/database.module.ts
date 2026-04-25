import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3333,
      username: "root",
      password: "gioocharkviani",
      database: "mtiskari",
      entities: [__dirname + "/../**/*.entity{.ts,.js}"],
      synchronize: true,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
