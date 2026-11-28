import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";
import { REGEX } from "../../common/regex";

export class CreateUserDto {


    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @Matches(REGEX.EMAIL)
    email: string;

    @IsString()
    @IsNotEmpty()
    @Matches(REGEX.PASSWORD)
    password: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean; 

}
