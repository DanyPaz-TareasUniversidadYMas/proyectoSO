import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ProcessState } from '../enums';

@Entity()
export class Process {


    @PrimaryGeneratedColumn()
    pid: number;

    @Column()
    priority: number;

    @Column()
    burstTime: number;

    @Column()
    remainingTime: number;
  
    @Column({
        enum: ProcessState
    })
    state: ProcessState;

    @Column('date')
    arrivalTime: Date;

    @CreateDateColumn()
    createdAt: Date;
  
    @CreateDateColumn({
        type: 'date',
        nullable: true
    })
    blockedAt: Date | null;
}
