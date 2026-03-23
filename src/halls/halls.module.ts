import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Hall, HallSchema } from './hall.schema';
import { HallsService } from './halls.service';
import { HallsController } from './halls.controller';
@Module({
  imports: [MongooseModule.forFeature([{ name: Hall.name, schema: HallSchema }])],
  providers: [HallsService],
  controllers: [HallsController],
  exports: [HallsService],
})
export class HallsModule {}
