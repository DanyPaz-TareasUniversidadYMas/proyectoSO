import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateProcessDto } from './create-process.dto';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { ProcessState } from '../enums';

export class UpdateProcessDto extends PartialType(OmitType(CreateProcessDto, ['burstTime'] as const)) {

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(20)
    remainingTime?: number;

    @IsOptional()
    @IsEnum(ProcessState)
    state?: ProcessState;

    @IsOptional()
    @IsDate()
    blockedAt?: Date;


}
