import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { BookingService } from './bookings.service';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(@Body() data: any) {
    return this.bookingService.create(data);
  }

  @Get('all')
  findAll() {
    return this.bookingService.findAll();
  }

  @Get('id/:id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(+id);
  }
}
