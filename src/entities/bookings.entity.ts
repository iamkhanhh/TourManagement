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

  @Column({ length: 50, nullable: true })
  payment_method: string;

  @Column({ type: 'datetime', nullable: true })
  payment_date: Date;

  @Column()
  payment_id: number;

  @Column({ type: 'int' })
  availability: number;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updatedAt: Date;
}
