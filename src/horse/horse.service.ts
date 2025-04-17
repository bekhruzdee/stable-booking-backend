import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Horse } from './entities/horse.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class HorseService {
  constructor(
    @InjectRepository(Horse)
    private horseRepository: Repository<Horse>,
  ) {}

  async create(data: Partial<Horse>) {
    try {
      if (data.owner) {
        const ownerExists = await this.horseRepository.manager.findOne(User, {
          where: { id: (data.owner as any).id },
        });

        if (!ownerExists) {
          throw new NotFoundException(
            `User with ID ${(data.owner as any).id} not found❌`,
          );
        }
      }

      const horse = this.horseRepository.create(data);
      const savedHorse = await this.horseRepository.save(horse);

      return {
        message: 'Horse created successfully✅',
        data: savedHorse,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        error.message || 'Error creating horse❌',
      );
    }
  }

  async findAll() {
    try {
      const horses = await this.horseRepository.find({
        relations: ['owner', 'bookings'],
      });

      horses.forEach((horse) => {
        if (horse.owner) {
          const { password, ...ownerWithoutPassword } = horse.owner;
          horse.owner = ownerWithoutPassword as User;
        }
      });

      return {
        status: 200,
        message: 'All horses retrieved successfully✅',
        data: horses,
      };
    } catch (error) {
      return {
        status: 500,
        message: 'Error retrieving horses❌',
        data: error.message,
      };
    }
  }

  async findOne(id: number) {
    try {
      const horse = await this.horseRepository.findOne({
        where: { id },
        relations: ['owner', 'bookings'],
      });

      if (!horse) {
        throw new NotFoundException(`Horse with ID ${id} not found`);
      }

      if (horse.owner) {
        const { password, ...ownerWithoutPassword } = horse.owner;
        horse.owner = ownerWithoutPassword as User;
      }

      return {
        status: 200,
        message: 'Horse found successfully✅',
        data: horse,
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
    const result = await this.horseRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Horse with ID ${id} not found`);
    }

    return {
      status: 200,
      message: 'Horse deleted successfully✅',
      data: null,
    };
  }
}
