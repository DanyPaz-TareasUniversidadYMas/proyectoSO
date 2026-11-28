import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { UserRoles } from '../enums';

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['email', 'password'] as const)) {
    @IsEnum(UserRoles)
    @IsOptional()
    role?: UserRoles;
}
