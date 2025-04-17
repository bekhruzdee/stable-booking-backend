import { Booking } from 'src/bookings/entities/booking.entity';
import { Horse } from 'src/horse/entities/horse.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: `varchar` })
  username: string;
  @Column({ unique: true, type: 'varchar', nullable: true })
  email: string;
  @Column({ type: `varchar` })
  password: string;
  @Column({ type: 'varchar', default: 'client' })
  role: string;
  @OneToMany(() => Horse, (horse) => horse.owner)
  horses: Horse[];
  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
