import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { BookingService } from './bookings.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/role.guard';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  create(@Body() data: any) {
    return this.bookingService.create(data);
  }

  @UseGuards(AuthGuard)
  @Get('all')
  findAll() {
    return this.bookingService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('id/:id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(+id);
  }
}
