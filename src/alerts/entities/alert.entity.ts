import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AlertSeverity, AlertType } from '../enums';

@Entity()
export class Alert {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: AlertType })
    type: AlertType;

    @Column({ type: 'enum', enum: AlertSeverity })
    severity: AlertSeverity;

    @Column()
    message: string;

    @Column({ type: 'int', nullable: true })
    referenceId: number | null;

    @Column({ default: false })
    resolved: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    resolvedAt: Date | null;
}