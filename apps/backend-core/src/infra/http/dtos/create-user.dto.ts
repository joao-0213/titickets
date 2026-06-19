import { IsEmail, IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(11, 14)
  cpf: string;

  @IsString()
  @IsNotEmpty()
  passwordRaw: string;

  @IsString()
  telephone?: string;
}
