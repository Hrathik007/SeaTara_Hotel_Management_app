import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum EmailStatus {
  SCHEDULED = 'scheduled',
  PROCESSING = 'processing',
  SENT = 'sent',
  FAILED = 'failed',
  RATE_LIMITED = 'rate_limited'
}

@Entity('emails')
export class Email {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  recipientEmail!: string;

  @Column({ type: 'varchar', length: 500 })
  subject!: string;

  @Column({ type: 'text' })
  body!: string;

  @Column({ type: 'varchar', length: 255 })
  senderEmail!: string;

  @Column({ type: 'timestamp' })
  scheduledTime!: Date;

  @Column({ type: 'timestamp', nullable: true })
  sentAt?: Date;

  @Column({
    type: 'enum',
    enum: EmailStatus,
    default: EmailStatus.SCHEDULED
  })
  status!: EmailStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  jobId?: string;

  @Column({ type: 'text', nullable: true })
  errorMessage?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  userId?: string;

  @Column({ type: 'int', default: 0 })
  retryCount!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
