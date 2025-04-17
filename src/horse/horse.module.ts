import { Module } from '@nestjs/common';
import { HorseService } from './horse.service';
import { HorseController } from './horse.controller';
import { Horse } from './entities/horse.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Horse])],
  controllers: [HorseController],
  providers: [HorseService],
})
export class HorseModule {}
