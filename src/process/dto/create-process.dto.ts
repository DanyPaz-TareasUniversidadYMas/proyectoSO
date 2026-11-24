import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateProcessDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(10)
  @Type(() => Number)
  priority: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(20)
  @Type(() => Number)
  burstTime: number;
}
