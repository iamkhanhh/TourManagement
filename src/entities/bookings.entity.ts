import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Bookings {
  @PrimaryGeneratedColumn()
  booking_id: number;

  @Column()
  user_id: number;

  @Column()
  tour_id: number;

  @Column({ type: 'datetime', nullable: true })
  booking_date: Date;

  @Column({ length: 50, nullable: true })
  status: string;

  @Column()
  payment_id: number;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updatedAt: Date;
}
