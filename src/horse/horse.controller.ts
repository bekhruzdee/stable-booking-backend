import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { HorseService } from './horse.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/role.guard';

@Controller('horses')
export class HorseController {
  constructor(private readonly horseService: HorseService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  create(@Body() createHorseDto: any) {
    return this.horseService.create(createHorseDto);
  }

  @UseGuards(AuthGuard)
  @Get('all')
  findAll() {
    return this.horseService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('id/:id')
  findOne(@Param('id') id: string) {
    return this.horseService.findOne(+id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.horseService.remove(+id);
  }
}
