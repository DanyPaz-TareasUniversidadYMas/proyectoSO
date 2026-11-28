import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class UpdateSystemDto {
  @Type(() => Number)
  @IsInt()
  @Min(-20)
  @Max(19)
  priority: number;
}