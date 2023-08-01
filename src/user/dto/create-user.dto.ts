import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly username: string;
  
  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @Exclude()
  readonly password2: string;

  @Exclude()
  readonly code: string;
}
