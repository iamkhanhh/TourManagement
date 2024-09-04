import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Payments {
  @PrimaryGeneratedColumn()
  payment_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'datetime' })
  payment_date: Date;

  @Column({ length: 50 })
  payment_method: string;

  @Column({ length: 50, nullable: true })
  status: string;

  @Column({ length: 50, nullable: true })
  transaction_id: string;

  @Column({ length: 50, nullable: true })
  transaction_status: string;

  @Column({ nullable: true })
  booking_id: number;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updatedAt: Date;
}
