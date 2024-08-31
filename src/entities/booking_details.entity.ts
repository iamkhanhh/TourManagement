import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Booking_Details {
  @PrimaryGeneratedColumn()
  booking_detail_id: number;

  @Column()
  user_id: number;

  @Column()
  booking_id: number;

  @Column()
  tour_id: number;

  @Column()
  number_of_people: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updatedAt: Date;
}
