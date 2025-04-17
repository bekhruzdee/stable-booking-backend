import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { Horse } from 'src/horse/entities/horse.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async create(data: Partial<Booking>) {
    try {
      const horseId =
        typeof data.horse === 'object' ? (data.horse as any).id : data.horse;
      const userId =
        typeof data.user === 'object' ? (data.user as any).id : data.user;

      const horse = await this.bookingRepository.manager.findOne(Horse, {
        where: { id: horseId },
      });
      if (!horse) {
        throw new NotFoundException(`Horse with ID ${horseId} not found❌`);
      }

      const user = await this.bookingRepository.manager.findOne(User, {
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found❌`);
      }

      const booking = this.bookingRepository.create({
        ...data,
        horse,
        user,
      });

      const saved = await this.bookingRepository.save(booking);

      return {
        message: 'Booking created successfully✅',
        data: saved,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        error.message || 'Error creating booking❌',
      );
    }
  }

  async findAll() {
    try {
      const bookings = await this.bookingRepository.find({
        relations: ['horse', 'user'],
      });

      bookings.forEach((booking) => {
        if (booking.horse?.owner) {
          const { password, ...ownerWithoutPassword } = booking.horse.owner;
          booking.horse.owner = ownerWithoutPassword as User;
        }

        if (booking.user) {
          const { password, ...userWithoutPassword } = booking.user;
          booking.user = userWithoutPassword as User;
        }
      });

      return {
        status: 200,
        message: 'All bookings fetched successfully✅',
        data: bookings,
      };
    } catch (error) {
      return {
        status: 500,
        message: 'Error fetching bookings❌',
        data: error.message,
      };
    }
  }

  async findOne(id: number) {
    try {
      const booking = await this.bookingRepository.findOne({
        where: { id },
        relations: ['horse', 'user'],
      });

      if (!booking) {
        throw new NotFoundException(`Booking with ID ${id} not found`);
      }

      if (booking.horse?.owner) {
        const { password, ...ownerWithoutPassword } = booking.horse.owner;
        booking.horse.owner = ownerWithoutPassword as User;
      }

      if (booking.user) {
        const { password, ...userWithoutPassword } = booking.user;
        booking.user = userWithoutPassword as User;
      }

      return {
        status: 200,
        message: 'Booking fetched successfully✅',
        data: booking,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      return {
        status: 500,
        message: 'Internal Server Error❌',
        data: error.message,
      };
    }
  }

  async remove(id: number) {
    try {
      const booking = await this.bookingRepository.findOne({ where: { id } });

      if (!booking) {
        throw new NotFoundException(`Booking with ID ${id} not found`);
      }

      await this.bookingRepository.delete(id);

      return {
        status: 200,
        message: 'Booking deleted successfully✅',
        data: null,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      return {
        status: 500,
        message: 'Internal Server Error❌',
        data: error.message,
      };
    }
  }
}
