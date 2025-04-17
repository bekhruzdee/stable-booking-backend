import { Horse } from 'src/horse/entities/horse.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Horse, (horse) => horse.bookings)
  horse: Horse;

  @ManyToOne(() => User, (user) => user.bookings)
  user: User;

  @Column()
  date: Date;
}
